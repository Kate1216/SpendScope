// Cross-platform duplicate payment detection for SpendScope.
// Loaded after parser-utils.js and before script.js.

const CROSS_DEDUP_TIME_WINDOW_SECONDS = 60;
const CROSS_DEDUP_AMOUNT_TOLERANCE = 0.01;

function applyCrossPlatformDedup(transactions) {
  console.info("[Cross Dedup] entered", { total: transactions.length });

  if (!Array.isArray(transactions) || !transactions.length) {
    console.info("[Cross Dedup Applied]", {
      total: 0,
      bankExpenseCandidates: 0,
      paymentExpenseCandidates: 0,
      matched: 0,
      applied: 0,
      matchedSamples: [],
    });
    return transactions || [];
  }

  const bankExpenses = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => {
      return (
        getTransactionSourcePlatform(transaction) === "中国银行" &&
        transaction.type === "支出" &&
        Number.isFinite(Number(transaction.amount)) &&
        Number(transaction.amount) > 0 &&
        transaction.date instanceof Date &&
        !Number.isNaN(transaction.date.getTime())
      );
    });

  const paymentExpenses = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => {
      const source = getTransactionSourcePlatform(transaction);
      return (
        (source === "支付宝" || source === "微信") &&
        transaction.type === "支出" &&
        Number.isFinite(Number(transaction.amount)) &&
        Number(transaction.amount) > 0 &&
        transaction.date instanceof Date &&
        !Number.isNaN(transaction.date.getTime())
      );
    });

  console.info("[Cross Dedup Source Counts]", {
    total: transactions.length,
    bankExpenseCandidates: bankExpenses.length,
    paymentExpenseCandidates: paymentExpenses.length,
  });

  const usedPaymentIndexes = new Set();
  const updatedByIndex = new Map();
  const matchedSamples = [];

  bankExpenses.forEach(({ transaction: bankTransaction, index: bankIndex }) => {
    const candidates = paymentExpenses
      .filter(({ transaction: paymentTransaction, index: paymentIndex }) => {
        if (usedPaymentIndexes.has(paymentIndex)) return false;

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
    const duplicateGroupKey = `cross-dedup-${bankIndex}-${best.paymentIndex}`;
    const updatedPaymentTransaction = {
      ...best.paymentTransaction,
      duplicateGroupKey,
      duplicatePairRole: "primaryPayment",
      duplicateMatchedBankMerchant: bankTransaction.merchant || "",
      duplicateMatchedBankDescription: bankTransaction.description || "",
      duplicateMatchedBankTime: bankTransaction.time || "",
      duplicateMatchedBankAmount: bankTransaction.amount,
    };
    const updatedBankTransaction = {
      ...bankTransaction,
      type: "排除",
      category: "重复扣款",
      excludeReason: "重复扣款",
      duplicateGroupKey,
      duplicatePairRole: "bankDuplicate",
      duplicateType: "支付平台重复扣款",
      duplicatePlatform: paymentSource,
      duplicateMatchedMerchant: best.paymentTransaction.merchant || "",
      duplicateMatchedDescription: best.paymentTransaction.description || "",
      duplicateMatchedTime: best.paymentTransaction.time || "",
      duplicateMatchedAmount: best.paymentTransaction.amount,
    };

    updatedByIndex.set(best.paymentIndex, updatedPaymentTransaction);
    updatedByIndex.set(bankIndex, updatedBankTransaction);

    matchedSamples.push({
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
    bankExpenseCandidates: bankExpenses.length,
    paymentExpenseCandidates: paymentExpenses.length,
    possibleMatches: matchedSamples.length,
    samples: matchedSamples.slice(0, 20),
  });

  const dedupedTransactions = transactions.map((transaction, index) => {
    return updatedByIndex.get(index) || transaction;
  });

  console.info("[Cross Dedup Applied]", {
    total: transactions.length,
    bankExpenseCandidates: bankExpenses.length,
    paymentExpenseCandidates: paymentExpenses.length,
    matched: matchedSamples.length,
    applied: matchedSamples.length,
    matchedSamples: matchedSamples.slice(0, 20),
  });

  return dedupedTransactions;
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
