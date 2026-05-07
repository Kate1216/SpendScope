// Refund-to-expense pairing for SpendScope.
// Loaded after dedupe.js and before script.js.

const REFUND_MATCH_AMOUNT_TOLERANCE = 0.01;

function applyRefundPairing(transactions) {
  console.info("[Refund Match] entered", { total: Array.isArray(transactions) ? transactions.length : 0 });

  if (!Array.isArray(transactions) || !transactions.length) {
    console.info("[Refund Match Source Counts]", {
      total: 0,
      refundCandidates: 0,
      expenseCandidates: 0,
    });
    console.info("[Refund Match Applied]", {
      total: 0,
      refundCandidates: 0,
      expenseCandidates: 0,
      matched: 0,
      fullRefundGroups: 0,
      partialRefundGroups: 0,
      unmatchedRefunds: 0,
      matchedSamples: [],
    });
    return transactions || [];
  }

  const refundCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isRefundMatchCandidate(transaction))
    .sort((a, b) => a.transaction.date.getTime() - b.transaction.date.getTime());

  const expenseCandidates = transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => isRefundExpenseCandidate(transaction));

  console.info("[Refund Match Source Counts]", {
    total: transactions.length,
    refundCandidates: refundCandidates.length,
    expenseCandidates: expenseCandidates.length,
  });

  const matchedRefundIndexes = new Set();
  const matchedByExpenseIndex = new Map();
  const updatedByIndex = new Map();
  const matchedSamples = [];

  refundCandidates.forEach(({ transaction: refundTransaction, index: refundIndex }) => {
    const best = findBestRefundExpenseCandidate(refundTransaction, expenseCandidates, matchedByExpenseIndex);
    if (!best) return;

    const currentGroup = matchedByExpenseIndex.get(best.expenseIndex) || {
      groupKey: `refund-match-${best.expenseIndex}`,
      refundIndexes: [],
      refundedAmount: 0,
    };
    currentGroup.refundIndexes.push(refundIndex);
    currentGroup.refundedAmount += Number(refundTransaction.amount);
    matchedByExpenseIndex.set(best.expenseIndex, currentGroup);
    matchedRefundIndexes.add(refundIndex);

    const updatedRefundTransaction = {
      ...refundTransaction,
      category: "退款/抵扣",
      refundGroupKey: currentGroup.groupKey,
      refundPairRole: "refund",
      matchedOriginalMerchant: best.expenseTransaction.merchant || "",
      matchedOriginalDescription: best.expenseTransaction.description || "",
      matchedOriginalTime: best.expenseTransaction.time || "",
      matchedOriginalAmount: best.expenseTransaction.amount,
      matchedOriginalCategory: best.expenseTransaction.category || "",
    };

    updatedByIndex.set(refundIndex, updatedRefundTransaction);
    matchedSamples.push({
      originalTime: best.expenseTransaction.time,
      originalMerchant: best.expenseTransaction.merchant,
      originalDescription: best.expenseTransaction.description,
      originalAmount: best.expenseTransaction.amount,
      originalCategory: best.expenseTransaction.category,
      refundTime: refundTransaction.time,
      refundMerchant: refundTransaction.merchant,
      refundDescription: refundTransaction.description,
      refundAmount: refundTransaction.amount,
      refundStatus: getRefundGroupStatus(best.expenseTransaction.amount, currentGroup.refundedAmount),
      similarity: best.similarity,
    });
  });

  let fullRefundGroups = 0;
  let partialRefundGroups = 0;
  matchedByExpenseIndex.forEach((group, expenseIndex) => {
    const originalExpense = transactions[expenseIndex];
    const refundStatus = getRefundGroupStatus(originalExpense.amount, group.refundedAmount);
    if (refundStatus === "full") {
      fullRefundGroups += 1;
    } else {
      partialRefundGroups += 1;
    }

    updatedByIndex.set(expenseIndex, {
      ...originalExpense,
      refundGroupKey: group.groupKey,
      refundPairRole: "originalExpense",
      refundedAmount: roundRefundAmount(group.refundedAmount),
      refundStatus,
      refundMatchedCount: group.refundIndexes.length,
    });

    group.refundIndexes.forEach((refundIndex) => {
      const refundTransaction = updatedByIndex.get(refundIndex) || transactions[refundIndex];
      updatedByIndex.set(refundIndex, {
        ...refundTransaction,
        refundGroupKey: group.groupKey,
      });
    });
  });

  const pairedTransactions = applyFullRefundOffsetMarking(
    transactions.map((transaction, index) => updatedByIndex.get(index) || transaction)
  );

  console.info("[Refund Match Applied]", {
    total: transactions.length,
    refundCandidates: refundCandidates.length,
    expenseCandidates: expenseCandidates.length,
    matched: matchedRefundIndexes.size,
    fullRefundGroups,
    partialRefundGroups,
    unmatchedRefunds: refundCandidates.length - matchedRefundIndexes.size,
    matchedSamples: matchedSamples.slice(0, 20),
  });

  return pairedTransactions;
}

function applyFullRefundOffsetMarking(transactions) {
  const fullRefundGroupKeys = new Set(
    transactions
      .filter((transaction) => transaction?.refundPairRole === "originalExpense" && transaction.refundStatus === "full" && transaction.refundGroupKey)
      .map((transaction) => transaction.refundGroupKey)
  );

  if (!fullRefundGroupKeys.size) {
    console.log("[Full Refund Offset Applied]", {
      fullRefundGroups: 0,
      originalExpensesMarked: 0,
      refundsMarked: 0,
    });
    return transactions;
  }

  let originalExpensesMarked = 0;
  let refundsMarked = 0;

  const markedTransactions = transactions.map((transaction) => {
    if (!transaction?.refundGroupKey || !fullRefundGroupKeys.has(transaction.refundGroupKey)) return transaction;

    if (transaction.refundPairRole === "originalExpense") {
      originalExpensesMarked += 1;
      return markFullRefundOffsetTransaction(transaction, "全额退款抵消");
    }

    if (transaction.refundPairRole === "refund") {
      refundsMarked += 1;
      return markFullRefundOffsetTransaction(transaction, "已抵消原消费");
    }

    return transaction;
  });

  console.log("[Full Refund Offset Applied]", {
    fullRefundGroups: fullRefundGroupKeys.size,
    originalExpensesMarked,
    refundsMarked,
  });

  return markedTransactions;
}

function markFullRefundOffsetTransaction(transaction, excludeReason) {
  return {
    ...transaction,
    type: "排除",
    category: "抵消",
    excludeReason,
    originalTypeBeforeRefundOffset: transaction.originalTypeBeforeRefundOffset || transaction.type,
    originalCategoryBeforeRefundOffset: transaction.originalCategoryBeforeRefundOffset || transaction.category,
  };
}

function isRefundMatchCandidate(transaction) {
  return (
    transaction?.type === "退款" &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime())
  );
}

function isRefundExpenseCandidate(transaction) {
  return (
    transaction?.type === "支出" &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    transaction.date instanceof Date &&
    !Number.isNaN(transaction.date.getTime())
  );
}

function findBestRefundExpenseCandidate(refundTransaction, expenseCandidates, matchedByExpenseIndex) {
  const refundAmount = Number(refundTransaction.amount);
  const refundTime = refundTransaction.date.getTime();

  return expenseCandidates
    .filter(({ transaction: expenseTransaction, index: expenseIndex }) => {
      if (expenseTransaction.date.getTime() > refundTime) return false;

      const allocatedAmount = matchedByExpenseIndex.get(expenseIndex)?.refundedAmount || 0;
      const remainingAmount = Number(expenseTransaction.amount) - allocatedAmount;
      if (refundAmount > remainingAmount + REFUND_MATCH_AMOUNT_TOLERANCE) return false;

      return true;
    })
    .map(({ transaction: expenseTransaction, index: expenseIndex }) => {
      const sourcePriority = getRefundSourcePriority(refundTransaction, expenseTransaction);
      const allocatedAmount = matchedByExpenseIndex.get(expenseIndex)?.refundedAmount || 0;
      const amountAfterRefund = allocatedAmount + refundAmount;
      const remainingAfterRefund = Math.max(0, Number(expenseTransaction.amount) - amountAfterRefund);
      const amountDiff = Math.abs(Number(expenseTransaction.amount) - refundAmount);
      const timeDiffSeconds = Math.abs(refundTime - expenseTransaction.date.getTime()) / 1000;
      const orderMatch = hasRefundOrderMatch(refundTransaction, expenseTransaction);
      const similarity = getRefundTextSimilarity(refundTransaction, expenseTransaction);

      return {
        expenseTransaction,
        expenseIndex,
        sourcePriority,
        amountDiff,
        remainingAfterRefund,
        timeDiffSeconds,
        orderMatch,
        similarity,
      };
    })
    .filter((candidate) => isAcceptableRefundCandidate(candidate))
    .sort((a, b) => {
      if (a.orderMatch !== b.orderMatch) return a.orderMatch ? -1 : 1;
      if (a.sourcePriority !== b.sourcePriority) return b.sourcePriority - a.sourcePriority;
      if (a.remainingAfterRefund !== b.remainingAfterRefund) return a.remainingAfterRefund - b.remainingAfterRefund;
      if (a.amountDiff !== b.amountDiff) return a.amountDiff - b.amountDiff;
      if (a.similarity !== b.similarity) return b.similarity - a.similarity;
      return a.timeDiffSeconds - b.timeDiffSeconds;
    })[0];
}

function isAcceptableRefundCandidate(candidate) {
  if (candidate.orderMatch) return true;
  if (candidate.similarity >= 0.18) return true;
  if (candidate.sourcePriority >= 2 && candidate.amountDiff <= REFUND_MATCH_AMOUNT_TOLERANCE && candidate.similarity >= 0.08) return true;
  return false;
}

function getRefundSourcePriority(refundTransaction, expenseTransaction) {
  const refundSource = getTransactionSourcePlatform(refundTransaction);
  const expenseSource = getTransactionSourcePlatform(expenseTransaction);
  if (refundSource && expenseSource && refundSource === expenseSource) return 2;
  if (isUnknownRefundSource(refundSource) || isUnknownRefundSource(expenseSource)) return 1;
  return 0;
}

function isUnknownRefundSource(source) {
  return !source || source === "未知" || source === "未知来源";
}

function getRefundTextSimilarity(refundTransaction, expenseTransaction) {
  const refundText = normalizeRefundMatchText(
    `${refundTransaction.merchant || ""} ${refundTransaction.description || ""} ${refundTransaction.transactionType || ""}`
  );
  const expenseText = normalizeRefundMatchText(
    `${expenseTransaction.merchant || ""} ${expenseTransaction.description || ""} ${expenseTransaction.transactionType || ""}`
  );

  if (!refundText || !expenseText) return 0;
  if (refundText.includes(expenseText) || expenseText.includes(refundText)) return 1;

  const refundTokens = getRefundMatchTokens(refundText);
  const expenseTokens = getRefundMatchTokens(expenseText);
  if (!refundTokens.size || !expenseTokens.size) return 0;

  const intersection = Array.from(refundTokens).filter((token) => expenseTokens.has(token)).length;
  const union = new Set([...refundTokens, ...expenseTokens]).size;
  return union ? intersection / union : 0;
}

function normalizeRefundMatchText(value) {
  return String(value || "")
    .replace(/退款|退货|售后退款|退回|已退|返钱|返款|冲正|撤销|原路退回|运费险|退运费|运费赔付|赔付|补偿/g, " ")
    .replace(/中国银行|银行卡|储蓄卡|信用卡|支付宝支付科技有限公司|财付通支付科技有限公司|财付通|支付宝|微信支付|微信/g, " ")
    .replace(/交易|订单|商户|付款|收款|支出|收入|成功|业务|网上快捷支付|快捷支付|扫码支付|二维码支付/g, " ")
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getRefundMatchTokens(text) {
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

function hasRefundOrderMatch(refundTransaction, expenseTransaction) {
  const refundOrders = getRefundOrderTokens(refundTransaction);
  const expenseOrders = getRefundOrderTokens(expenseTransaction);
  if (!refundOrders.size || !expenseOrders.size) return false;
  return Array.from(refundOrders).some((order) => expenseOrders.has(order));
}

function getRefundOrderTokens(transaction) {
  const keys = [
    "transactionOrderId",
    "merchantOrderId",
    "orderId",
    "tradeNo",
    "outTradeNo",
    "交易订单号",
    "商家订单号",
    "订单号",
  ];
  const tokens = new Set();
  keys.forEach((key) => {
    const value = String(transaction?.[key] || "").replace(/\s+/g, "");
    if (value.length >= 8) tokens.add(value);
  });
  return tokens;
}

function getRefundGroupStatus(originalAmount, refundedAmount) {
  return Number(originalAmount) - Number(refundedAmount) <= REFUND_MATCH_AMOUNT_TOLERANCE ? "full" : "partial";
}

function roundRefundAmount(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
