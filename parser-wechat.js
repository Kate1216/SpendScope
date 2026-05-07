// WeChat, CSV, and spreadsheet parser helpers for SpendScope.

function parseCsv(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const lines = cleanText.split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];

  const headerIndex = lines.findIndex((line) => {
    const cells = splitDelimitedLine(line, detectDelimiter(line));
    return cells.some((cell) => /时间|日期|金额|收\/支|交易/.test(cell));
  });
  const start = Math.max(headerIndex, 0);
  const delimiter = detectDelimiter(lines[start]);
  const headers = splitDelimitedLine(lines[start], delimiter).map(cleanCell);

  const records = lines.slice(start + 1).map((line) => {
    const cells = splitDelimitedLine(line, delimiter);
    return headers.reduce((row, header, index) => {
      row[header || `列${index + 1}`] = cleanCell(cells[index] || "");
      return row;
    }, {});
  });
  return normalizeWechatRows(records);
}

function rowsToObjects(rows) {
  const headerIndex = rows.findIndex((row) => isBillHeader(row.map(cleanCell)));
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map(cleanCell);
  const records = rows.slice(headerIndex + 1).map((row) => {
    return headers.reduce((record, header, index) => {
      record[header || `列${index + 1}`] = cleanCell(row[index] || "");
      return record;
    }, {});
  });
  return normalizeWechatRows(records);
}

function isBillHeader(cells) {
  const text = cells.join("|");
  return /交易时间|支付时间|创建时间|记账日期|交易日期|时间/.test(text) && /金额|收\/支|收入|支出/.test(text);
}

function normalizeWechatRows(rows) {
  if (!looksLikeWechatRows(rows)) return rows;

  const normalizedRows = rows.map((row) => {
    const typeResult = normalizeWechatType(row);
    if (!typeResult.type) return row;

    return {
      ...row,
      __wechatTypeResult: typeResult,
      __wechatNormalizedType: typeResult.type,
      needsReview: Boolean(typeResult.needsReview),
      category: typeResult.category || row.category,
      excludeReason: typeResult.excludeReason || row.excludeReason || "",
    };
  });

  logWechatTypeDebug(normalizedRows);
  return normalizedRows;
}

function looksLikeWechatRows(rows) {
  const headers = Array.from(
    rows.reduce((names, row) => {
      Object.keys(row || {}).forEach((name) => names.add(cleanCell(name)));
      return names;
    }, new Set())
  );
  const text = headers.join("|");
  return /收\/支|收支|收\/支状态/.test(text) && /交易类型/.test(text) && /交易对方|商品|商户|当前状态|交易状态/.test(text);
}

function normalizeWechatType(row) {
  const direction = cleanCell(row["收/支"] || row["收支"] || row["收/支状态"] || "");
  const tradeType = cleanCell(row["交易类型"] || "");
  const status = cleanCell(row["当前状态"] || row["交易状态"] || "");
  const fallbackText = `${tradeType} ${status}`;

  if (/不计\s*收支|不计入收支|不计/.test(direction)) {
    return { type: "排除", category: "排除", excludeReason: "不计收支" };
  }
  if (/支出/.test(direction)) return { type: "支出" };
  if (/收入/.test(direction)) return { type: "收入" };

  if (/不计\s*收支|不计入收支|不计/.test(fallbackText)) {
    return { type: "排除", category: "排除", excludeReason: "不计收支" };
  }
  if (/退款|退货|售后退款/.test(fallbackText)) return { type: "退款", category: "退款/抵扣" };
  if (/转账收款|收款|红包收入|收红包|已收钱|入账/.test(fallbackText)) return { type: "收入" };
  if (/商户消费|扫二维码付款|二维码付款|微信支付|群收款付款|付款给商户|消费/.test(fallbackText)) return { type: "支出" };
  if (/^转账$|转账/.test(tradeType)) {
    return { type: "排除", category: "排除", excludeReason: "转账待确认", needsReview: true };
  }

  return {};
}

function logWechatTypeDebug(rows) {
  const stats = rows.reduce(
    (summary, row) => {
      const type = row.__wechatNormalizedType || "";
      const tradeType = cleanCell(row["交易类型"] || "");
      summary.total += 1;
      if (type === "支出") summary.expenseCount += 1;
      if (type === "收入") summary.incomeCount += 1;
      if (type === "排除") summary.excludedCount += 1;
      if (/转账/.test(tradeType) && type === "支出") summary.transferExpenseCount += 1;
      if (/转账/.test(tradeType) && type === "收入") summary.transferIncomeCount += 1;
      if (/转账/.test(tradeType) && row.needsReview) summary.transferReviewCount += 1;
      return summary;
    },
    {
      total: 0,
      expenseCount: 0,
      incomeCount: 0,
      excludedCount: 0,
      transferExpenseCount: 0,
      transferIncomeCount: 0,
      transferReviewCount: 0,
    }
  );

  console.log("[Wechat Type Debug]", stats);
}
