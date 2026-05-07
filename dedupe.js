// Cross-platform duplicate payment detection for SpendScope.
// Loaded after parser-utils.js and before script.js.

const CROSS_DEDUP_TIME_WINDOW_SECONDS = 60;
const CROSS_DEDUP_AMOUNT_TOLERANCE = 0.01;

function applyCrossPlatformDedup(transactions) {
  console.info("[Cross Dedup] entered", { total: transactions.length });

  if (!Array.isArray(transactions) || !transactions.length) {
    console.info("[Cross Dedup Applied]", {
      total: 0,
      sameSourceIgnored: 0,
      crossSourceCandidates: 0,
      matched: 0,
      applied: 0,
      expenseDuplicates: 0,
      refundDuplicates: 0,
      transferDuplicates: 0,
    });
    return transactions || [];
  }

  const transferResult = applyCrossPlatformTransferDedup(transactions);
  transactions = transferResult.transactions;
  const sameSourceIgnored = countSameSourceDedupIgnored(transactions);

  const bankCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isCrossDedupCandidate(transaction, ["中国银行"]) && transaction.transferPairRole !== "bankTransferDuplicate");

  const paymentPlatformCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isCrossDedupCandidate(transaction, ["支付宝", "微信"]) && transaction.transferPairRole !== "primaryTransfer");

  console.info("[Cross Dedup Source Counts]", {
    total: transactions.length,
    bankCandidates: bankCandidates.length,
    paymentPlatformCandidates: paymentPlatformCandidates.length,
  });

  const usedPaymentIndexes = new Set();
  const updatedByIndex = new Map();
  const matchedSamples = [];
  const duplicateStats = { expense: 0, income: 0, refund: 0 };

  bankCandidates.forEach(({ transaction: bankTransaction, index: bankIndex }) => {
    const candidates = paymentPlatformCandidates
      .filter(({ transaction: paymentTransaction, index: paymentIndex }) => {
        if (usedPaymentIndexes.has(paymentIndex)) return false;

        if (!isCrossDedupDirectionCompatible(bankTransaction, paymentTransaction)) return false;

        const amountDiff = Math.abs(Number(bankTransaction.amount) - Number(paymentTransaction.amount));
        if (amountDiff > CROSS_DEDUP_AMOUNT_TOLERANCE) return false;

        const timeDiffSeconds = Math.abs(bankTransaction.date.getTime() - paymentTransaction.date.getTime()) / 1000;
        if (timeDiffSeconds > CROSS_DEDUP_TIME_WINDOW_SECONDS) return false;

        return true;
      })
      .map(({ transaction: paymentTransaction, index: paymentIndex }) => {
        const timeDiffSeconds = Math.abs(bankTransaction.date.getTime() - paymentTransaction.date.getTime()) / 1000;
        const similarity = getCrossDedupTextSimilarity(bankTransaction, paymentTransaction);

        return {
          paymentTransaction,
          paymentIndex,
          timeDiffSeconds,
          similarity,
          amountDiff: Math.abs(Number(bankTransaction.amount) - Number(paymentTransaction.amount)),
        };
      })
      .sort((a, b) => {
        if (a.timeDiffSeconds !== b.timeDiffSeconds) return a.timeDiffSeconds - b.timeDiffSeconds;
        if (a.amountDiff !== b.amountDiff) return a.amountDiff - b.amountDiff;
        return b.similarity - a.similarity;
      });

    const best = candidates[0];
    if (!best) return;

    usedPaymentIndexes.add(best.paymentIndex);

    const paymentSource = getTransactionSourcePlatform(best.paymentTransaction);
    const duplicateSemanticType = getCrossDedupSemanticType(bankTransaction, best.paymentTransaction);
    const duplicateGroupKey = `cross-dedup-${bankIndex}-${best.paymentIndex}`;
    const updatedPaymentTransaction = {
      ...best.paymentTransaction,
      duplicateGroupKey,
      duplicatePairRole: "primaryPlatformRecord",
      duplicatePlatform: "中国银行",
      duplicateMatchedBankMerchant: bankTransaction.merchant || "",
      duplicateMatchedBankDescription: bankTransaction.description || "",
      duplicateMatchedBankTime: bankTransaction.time || "",
      duplicateMatchedBankAmount: bankTransaction.amount,
    };
    const updatedBankTransaction = {
      ...bankTransaction,
      type: "排除",
      category: getCrossDedupExcludedCategory(bankTransaction, best.paymentTransaction),
      excludeReason: "跨平台重复记录",
      duplicateGroupKey,
      duplicatePairRole: "bankDuplicate",
      duplicateType: "跨平台重复记录",
      duplicatePlatform: paymentSource,
      duplicateMatchedMerchant: best.paymentTransaction.merchant || "",
      duplicateMatchedDescription: best.paymentTransaction.description || "",
      duplicateMatchedTime: best.paymentTransaction.time || "",
      duplicateMatchedAmount: best.paymentTransaction.amount,
    };

    updatedByIndex.set(best.paymentIndex, updatedPaymentTransaction);
    updatedByIndex.set(bankIndex, updatedBankTransaction);
    if (duplicateSemanticType === "支出") duplicateStats.expense += 1;
    if (duplicateSemanticType === "收入") duplicateStats.income += 1;
    if (duplicateSemanticType === "退款") duplicateStats.refund += 1;

    matchedSamples.push({
      semanticType: duplicateSemanticType,
      bankTime: bankTransaction.time,
      bankMerchant: bankTransaction.merchant,
      bankDescription: bankTransaction.description,
      bankAmount: bankTransaction.amount,
      paymentPlatform: paymentSource,
      paymentTime: best.paymentTransaction.time,
      paymentMerchant: best.paymentTransaction.merchant,
      paymentDescription: best.paymentTransaction.description,
      paymentAmount: best.paymentTransaction.amount,
      timeDiffSeconds: Math.round(best.timeDiffSeconds),
      similarity: best.similarity,
    });
  });

  console.info("[Cross Dedup Candidates]", {
    bankCandidates: bankCandidates.length,
    paymentPlatformCandidates: paymentPlatformCandidates.length,
    possibleMatches: matchedSamples.length,
    samples: matchedSamples.slice(0, 20),
  });

  const dedupedTransactions = transactions.map((transaction, index) => {
    return updatedByIndex.get(index) || transaction;
  });

  console.log("[Cross Source Dedup Applied]", {
    total: transactions.length,
    sameSourceIgnored,
    crossSourceCandidates: bankCandidates.length + paymentPlatformCandidates.length,
    matched: matchedSamples.length,
    applied: matchedSamples.length,
    expenseDuplicates: duplicateStats.expense,
    refundDuplicates: duplicateStats.income + duplicateStats.refund,
    transferDuplicates: transferResult.matched,
    matchedSamples: matchedSamples.slice(0, 20),
  });

  return dedupedTransactions;
}

function isCrossDedupCandidate(transaction, sourcePlatforms) {
  const source = getTransactionSourcePlatform(transaction);
  return (
    sourcePlatforms.includes(source) &&
    ["支出", "收入", "退款"].includes(transaction?.type) &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime())
  );
}

function countSameSourceDedupIgnored(transactions) {
  let ignored = 0;
  for (let leftIndex = 0; leftIndex < transactions.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < transactions.length; rightIndex += 1) {
      const left = transactions[leftIndex];
      const right = transactions[rightIndex];
      const leftSource = getTransactionSourcePlatform(left);
      if (!leftSource || leftSource !== getTransactionSourcePlatform(right)) continue;
      if (!isCrossDedupComparable(left) || !isCrossDedupComparable(right)) continue;
      if (!isCrossDedupDirectionCompatible(left, right)) continue;
      if (Math.abs(Number(left.amount) - Number(right.amount)) > CROSS_DEDUP_AMOUNT_TOLERANCE) continue;
      const timeDiffSeconds = Math.abs(left.date.getTime() - right.date.getTime()) / 1000;
      if (timeDiffSeconds <= CROSS_DEDUP_TIME_WINDOW_SECONDS) ignored += 1;
    }
  }
  return ignored;
}

function isCrossDedupComparable(transaction) {
  return (
    ["支出", "收入", "退款"].includes(transaction?.type) &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime())
  );
}

function applyCrossPlatformTransferDedup(transactions) {
  const alipayTransferCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isAlipayTransferCandidate(transaction));
  const bankTransferCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isBankTransferCandidate(transaction));
  const usedBankIndexes = new Set();
  const updatedByIndex = new Map();
  const matchedSamples = [];

  alipayTransferCandidates.forEach(({ transaction: alipayTransaction, index: alipayIndex }) => {
    const candidates = bankTransferCandidates
      .filter(({ transaction: bankTransaction, index: bankIndex }) => {
        if (usedBankIndexes.has(bankIndex)) return false;
        const amountDiff = Math.abs(Number(alipayTransaction.amount) - Number(bankTransaction.amount));
        if (amountDiff > CROSS_DEDUP_AMOUNT_TOLERANCE) return false;
        const timeDiffSeconds = Math.abs(alipayTransaction.date.getTime() - bankTransaction.date.getTime()) / 1000;
        return timeDiffSeconds <= CROSS_DEDUP_TIME_WINDOW_SECONDS;
      })
      .map(({ transaction: bankTransaction, index: bankIndex }) => ({
        bankTransaction,
        bankIndex,
        timeDiffSeconds: Math.abs(alipayTransaction.date.getTime() - bankTransaction.date.getTime()) / 1000,
        amountDiff: Math.abs(Number(alipayTransaction.amount) - Number(bankTransaction.amount)),
      }))
      .sort((a, b) => {
        if (a.timeDiffSeconds !== b.timeDiffSeconds) return a.timeDiffSeconds - b.timeDiffSeconds;
        return a.amountDiff - b.amountDiff;
      });

    const best = candidates[0];
    if (!best) return;

    usedBankIndexes.add(best.bankIndex);
    const groupKey = `cross-transfer-${alipayIndex}-${best.bankIndex}`;
    updatedByIndex.set(alipayIndex, {
      ...alipayTransaction,
      type: "排除",
      category: "账户转移",
      excludeReason: "账户转移",
      transferPairRole: "primaryTransfer",
      transferGroupKey: groupKey,
      duplicatePairRole: "primaryTransfer",
      duplicateGroupKey: groupKey,
      duplicatePlatform: "中国银行",
    });
    updatedByIndex.set(best.bankIndex, {
      ...best.bankTransaction,
      type: "排除",
      category: "账户转移",
      excludeReason: "跨平台账户转移",
      transferPairRole: "bankTransferDuplicate",
      transferGroupKey: groupKey,
      duplicatePairRole: "bankTransferDuplicate",
      duplicateGroupKey: groupKey,
      duplicateType: "跨平台账户转移",
      duplicatePlatform: "支付宝",
    });
    matchedSamples.push({
      alipayTime: alipayTransaction.time,
      bankTime: best.bankTransaction.time,
      amount: alipayTransaction.amount,
      timeDiffSeconds: Math.round(best.timeDiffSeconds),
    });
  });

  console.log("[Cross Transfer Dedup Applied]", {
    total: transactions.length,
    alipayTransferCandidates: alipayTransferCandidates.length,
    bankTransferCandidates: bankTransferCandidates.length,
    matched: matchedSamples.length,
    applied: matchedSamples.length,
  });

  return {
    transactions: transactions.map((transaction, index) => updatedByIndex.get(index) || transaction),
    matched: matchedSamples.length,
  };
}

function isAlipayTransferCandidate(transaction) {
  return (
    getTransactionSourcePlatform(transaction) === "支付宝" &&
    ["排除", "不计收支"].includes(transaction?.type) &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime()) &&
    /银行卡定时转入|自动转入|转入余额宝|余额宝转入|基金转入|蚂蚁基金|账户转移/.test(getCrossTransferText(transaction))
  );
}

function isBankTransferCandidate(transaction) {
  return (
    getTransactionSourcePlatform(transaction) === "中国银行" &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime()) &&
    /支付宝|蚂蚁|蚂蚁基金|余额宝|网上快捷支付|银企对接/.test(getCrossTransferText(transaction))
  );
}

function getCrossTransferText(transaction) {
  return `${transaction?.merchant || ""} ${transaction?.description || ""} ${transaction?.transactionType || ""} ${transaction?.platform || ""} ${transaction?.rawType || ""} ${transaction?.["交易名称"] || ""} ${transaction?.["附言"] || ""} ${transaction?.["对方账户名"] || ""} ${transaction?.["商品说明"] || ""} ${transaction?.["交易说明"] || ""}`;
}

function isCrossDedupDirectionCompatible(bankTransaction, paymentTransaction) {
  const bankType = getCrossDedupSemanticType(bankTransaction);
  const paymentType = getCrossDedupSemanticType(paymentTransaction);
  if (bankType === paymentType) return true;
  return bankType === "退款" && paymentType === "退款";
}

function getCrossDedupSemanticType(transaction) {
  if (transaction?.type === "退款") return "退款";
  const text = `${transaction?.merchant || ""} ${transaction?.description || ""} ${transaction?.transactionType || ""} ${transaction?.rawType || ""}`;
  if (transaction?.type === "收入" && /退款|快捷退款|网上快捷退款|退回|原路退回|冲正|撤销/.test(text)) return "退款";
  return transaction?.type || "";
}

function getCrossDedupExcludedCategory(bankTransaction, paymentTransaction) {
  const semanticType = getCrossDedupSemanticType(bankTransaction) || getCrossDedupSemanticType(paymentTransaction);
  if (semanticType === "支出") return "重复扣款";
  if (semanticType === "收入" || semanticType === "退款") return "重复退款";
  return "重复记录";
}

function getCrossDedupTextSimilarity(bankTransaction, paymentTransaction) {
  const bankText = normalizeCrossDedupText(
    `${bankTransaction.merchant || ""} ${bankTransaction.description || ""} ${bankTransaction.transactionType || ""}`
  );
  const paymentText = normalizeCrossDedupText(
    `${paymentTransaction.merchant || ""} ${paymentTransaction.description || ""} ${paymentTransaction.transactionType || ""}`
  );

  if (!bankText || !paymentText) return 0;
  if (bankText.includes(paymentText) || paymentText.includes(bankText)) return 1;

  const bankTokens = getCrossDedupTokens(bankText);
  const paymentTokens = getCrossDedupTokens(paymentText);
  if (!bankTokens.size || !paymentTokens.size) return 0;

  const intersection = Array.from(bankTokens).filter((token) => paymentTokens.has(token)).length;
  const union = new Set([...bankTokens, ...paymentTokens]).size;
  return union ? intersection / union : 0;
}

function normalizeCrossDedupText(value) {
  return String(value || "")
    .replace(/中国银行|银行卡|储蓄卡|信用卡|支付宝支付科技有限公司|财付通支付科技有限公司|财付通|支付宝|微信支付|微信/g, " ")
    .replace(/网上快捷支付|快捷支付|扫码支付|二维码支付|消费|付款|支出|交易|订单|商户/g, " ")
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getCrossDedupTokens(text) {
  const value = String(text || "");
  const tokens = new Set();

  value.split(/\s+/).forEach((token) => {
    if (token.length >= 2) tokens.add(token);
  });

  const chinese = value.replace(/[^\u4e00-\u9fa5]/g, "");
  for (let index = 0; index < chinese.length - 1; index += 1) {
    tokens.add(chinese.slice(index, index + 2));
  }

  return tokens;
}
