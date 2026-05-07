// Bank of China PDF parser helpers for SpendScope.

function parseBankOfChinaPdfText(text, lines, fileName) {
  const isBoc = isBankOfChinaPdfText(text, fileName);
  if (!isBoc) return [];

  const normalizedLines = lines
    .map((line) => ({
      text: maskBankSensitiveText(cleanCell(typeof line === "object" ? line.text : line)),
      pageNumber: typeof line === "object" ? line.pageNumber : undefined,
    }))
    .filter((line) => line.text);
  const blocks = buildBankOfChinaTransactionBlocks(normalizedLines);
  const validBlocks = blocks.filter((block) => block.length && isBankOfChinaTransactionStart(block[0].text));
  const rows = validBlocks
    .map((block, index) => {
      const row = parseBankOfChinaBlock(block, fileName);
      if (!row) {
        console.warn("[BOC Block Dropped]", {
          index,
          page: block[0]?.pageNumber,
          firstLine: maskBankSensitiveText(block[0]?.text),
          blockText: maskBankSensitiveText(block.map((line) => line.text).join(" ")),
          reason: getBankOfChinaBlockDropReason(block),
        });
      }
      return row;
    })
    .filter(Boolean);
  const pageCounts = validBlocks.reduce((counts, block) => {
    const page = block[0]?.pageNumber || "unknown";
    counts[page] = (counts[page] || 0) + 1;
    return counts;
  }, {});
  const transactionStartLines = normalizedLines.filter((line) => isBankOfChinaTransactionStart(line.text));
  const rejectedCandidateLines = normalizedLines
    .filter((line) => isBankOfChinaRejectedCandidateLine(line.text))
    .map((line) => ({
      ...line,
      reason: getBankOfChinaStartRejectReason(line.text),
    }));

  console.info("[BOC Blocks]", {
    inputLines: lines.length,
    blocks: blocks.length,
    validBlocks: validBlocks.length,
  });
  console.info("[BOC Page Count]", pageCounts);

  console.table(
    transactionStartLines.map((item) => ({
      page: item.pageNumber,
      line: maskBankSensitiveText(item.text),
    }))
  );
  console.table(
    rejectedCandidateLines.map((item) => ({
      page: item.pageNumber,
      line: maskBankSensitiveText(item.text),
      reason: item.reason,
    }))
  );
  console.info("[BOC Parse]", { rows: rows.length });
  console.info(`[BOC Parse Result] blocks=${blocks.length} rows=${rows.length}`);
  console.table(rows.slice(0, 10).map(maskDebugRow));

  return rows;
}

function buildBankOfChinaTransactionBlocks(lines) {
  const blocks = [];
  let currentBlock = null;

  lines.forEach((line) => {
    if (isBankOfChinaTransactionStart(line.text)) {
      if (currentBlock?.length) blocks.push(currentBlock);
      currentBlock = [line];
      return;
    }

    if (isBankOfChinaStatementNoiseLine(line.text)) {
      return;
    }

    if (currentBlock) {
      currentBlock.push(line);
    }
  });

  if (currentBlock?.length) blocks.push(currentBlock);
  return blocks;
}

function isBankOfChinaTransactionStart(line) {
  const value = String(line || "").trim();
  return /^20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\s+\d{1,2}:\d{2}:\d{2}\s+人民币\s+[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})\s+[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})/.test(value);
}

function isBankOfChinaRejectedCandidateLine(line) {
  const value = String(line || "").trim();
  if (!value || isBankOfChinaTransactionStart(value)) return false;
  return /^20\d{2}-04/.test(value) || /人民币/.test(value) || /[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})/.test(value);
}

function getBankOfChinaStartRejectReason(line) {
  const value = String(line || "").trim();
  if (!/^20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}/.test(value)) return "not line-start date";
  if (!/^20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\s+\d{1,2}:\d{2}:\d{2}/.test(value)) return "missing time after date";
  if (!/人民币/.test(value)) return "missing currency";
  if (!/人民币\s+[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})\s+[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})/.test(value)) return "missing transaction amount and balance after currency";
  return "unknown";
}

function isBankOfChinaStatementNoiseLine(line) {
  const value = String(line || "").trim();
  return /中国银行交易流水明细清单|交易区间|客户姓名|页数:|借记卡号|借方发生数|贷方发生数|行数:|账号：|按收支筛选|按币种筛选|打印时间|记账日期.*记账时间|对方卡号\/账号|对方开户行|-{5,}END-{5,}|温馨提示|第\s*\d+\s*页\/共\s*\d+\s*页/.test(value);
}

function inspectBankOfChinaPdfText(text, lines, fileName) {
  const joined = String(text || "");
  const isBOC =    /中国银行|Bank of China|中行/.test(joined) ||
    /记账日期|记账时间|交易名称|对方账户名|人民币|余额/.test(joined);

  const dateLikeLines = lines.filter((line) => /(\d{4}[-/年]?\d{1,2}[-/月]?\d{1,2}|\d{8})/.test(line));
  const amountLikeLines = lines.filter((line) => /[+-]?\d{1,3}(,\d{3})*(\.\d{2})|[+-]?\d+\.\d{2}/.test(line));

  const result = {
    isBOC,
    dateLikeLines,
    amountLikeLines,
  };

  console.info("[BOC Inspect]", {
    file: fileName,
    isBOC,
    linesCount: lines.length,
    dateLikeLineCount: dateLikeLines.length,
    amountLikeLineCount: amountLikeLines.length,
    firstLines: lines.slice(0, 30).map(maskBankSensitiveText),
    sampleDateLines: dateLikeLines.slice(0, 10).map(maskBankSensitiveText),
    sampleAmountLines: amountLikeLines.slice(0, 10).map(maskBankSensitiveText),
  });

  return result;
}

function isBankOfChinaPdfText(text, fileName = "") {
  const value = `${fileName} ${text}`;
  return /中国银行|Bank of China|BANK OF CHINA|账户交易明细|中国银行交易明细|交易流水明细清单|电子回单|记账日期|交易日期|对方户名|对方账号|收入金额|支出金额|借方|贷方/.test(value);
}

function parseBankOfChinaBlock(block, fileName = "") {
  const lines = Array.isArray(block) ? block : [block];
  const source = lines
    .map((line) => String(typeof line === "object" ? line.text : line || "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return parseBankOfChinaLine(source, fileName);
}

function getBankOfChinaBlockDropReason(block) {
  const lines = Array.isArray(block) ? block : [block];
  const source = lines
    .map((line) => String(typeof line === "object" ? line.text : line || "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!source) return "empty block";
  if (/记账日期.*记账时间|交易日期|摘要|收入金额|支出金额|对方户名|对方账号|账户交易明细|中国银行交易流水明细|交易区间|借记卡号/.test(source)) return "block contains statement header/footer text";
  if (!isBankOfChinaTransactionStart(source)) return "first line no longer matches transaction start";
  if (!source.match(/(?:20\d{2}[年\-/.]\d{1,2}[月\-/.]\d{1,2}日?|\b20\d{6}\b)(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?/)) return "missing transaction time";
  if (!extractBankOfChinaAmounts(source)) return "missing transaction amount after currency";
  return "unknown block parse reason";
}

function parseBankOfChinaLine(line, fileName = "") {
  const source = maskBankSensitiveText(String(line || "").replace(/\s+/g, " ").trim());
  if (!source || /记账日期.*记账时间|交易日期|摘要|收入金额|支出金额|对方户名|对方账号|账户交易明细|中国银行交易流水明细|交易区间|借记卡号/.test(source)) {
    return null;
  }

  if (!isBankOfChinaTransactionStart(source)) {
    return null;
  }

  const dateMatch = source.match(/(?:20\d{2}[年\-/.]\d{1,2}[月\-/.]\d{1,2}日?|\b20\d{6}\b)(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?/);
  if (!dateMatch) {
    return null;
  }

  const bocTableInfo = extractBankOfChinaTableInfo(source);
  const amountInfo = bocTableInfo?.amountInfo || extractBankOfChinaAmounts(source);
  if (!amountInfo || !Number.isFinite(amountInfo.amount) || amountInfo.amount <= 0) {
    return null;
  }

  const type = detectBankTransactionType(source, amountInfo);
  const description = bocTableInfo?.description || cleanBankDescription(source, dateMatch[0], amountInfo.raw);
  const merchant = bocTableInfo?.merchant || extractBankCounterparty(source, description);

  return {
    "交易时间": normalizeBankDateTime(dateMatch[0]),
    "交易对方": merchant,
    "交易说明": description || merchant,
    "交易类型": bocTableInfo?.transactionName || inferBankTransactionName(source, type),
    "收/支": type,
    "金额": amountInfo.amount.toFixed(2),
    "平台": "中国银行",
  };
}

function extractBankOfChinaTableInfo(line) {
  const match = line.match(
    /^(?<date>20\d{2}-\d{1,2}-\d{1,2})\s+(?<time>\d{1,2}:\d{2}:\d{2})\s+人民币\s+(?<amount>[+-]?\s*(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})\s+(?<balance>[+-]?\s*(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})\s+(?<rest>.+)$/
  );
  if (!match?.groups) return null;

  const amountInfo = extractBankOfChinaAmounts(line);
  if (!amountInfo) return null;

  const rest = match.groups.rest.replace(/\s+/g, " ").trim();
  const transactionMatch = rest.match(/^(?<name>.+?)\s+(?<channel>银企对接|网上银行|手机银行|柜台|ATM|自助终端|其他)\s+(?<tail>.+)$/);
  const transactionName = cleanCell(transactionMatch?.groups?.name || inferBankTransactionName(rest, amountInfo.signedValue < 0 ? "支出" : "收入"));
  const channel = cleanCell(transactionMatch?.groups?.channel || "");
  const tail = cleanCell(transactionMatch?.groups?.tail || rest);
  const merchant = extractBankOfChinaMerchant(tail, transactionName);
  const description = cleanBankDescription(
    [transactionName, channel, tail].filter(Boolean).join(" "),
    "",
    match.groups.amount
  );

  return {
    amountInfo,
    transactionName,
    merchant,
    description: description || merchant,
  };
}

function extractBankOfChinaAmounts(line) {
  const match = String(line || "").match(/人民币\s+(?<amount>[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2}))\s+(?<balance>[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2}))/);
  if (!match?.groups) return null;

  const signedValue = Number(match.groups.amount.replace(/[,\s]/g, ""));
  const balance = Number(match.groups.balance.replace(/[,\s]/g, ""));
  if (!Number.isFinite(signedValue) || signedValue === 0 || !Number.isFinite(balance)) return null;

  return {
    raw: match.groups.amount,
    balanceRaw: match.groups.balance,
    signedValue,
    balance,
    amount: Math.abs(signedValue),
  };
}

function extractBankOfChinaMerchant(text, transactionName = "") {
  let value = maskBankSensitiveText(text)
    .replace(/-[-\s]{5,}/g, " ")
    .replace(/\bZ\d+[A-Z]?\b/gi, " ")
    .replace(/\b\d{6,}(?:\s+N)?\b/g, " ")
    .replace(/\bN\b/g, " ")
    .replace(/中国银行[^ ]*|中国工商银行|中国农业银行|中国建设银行|交通银行|招商银行|支付宝支付科技有限公司/g, " ")
    .replace(/\d{6,}[:：][^ ]*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!value || value === "----------") return transactionName || "中国银行交易";

  const platformMerchant = value.match(/((?:财付通|支付宝|抖音支付)-[^\s]{2,60}(?:\s+[^\s\d-]{1,20})?)/)?.[1];
  if (platformMerchant) return collapseRepeatedBankMerchant(platformMerchant);

  const namedParty = value.match(/(?:^|\s)([\u4e00-\u9fa5A-Za-z·（）()]{2,30})(?:\s|$)/)?.[1];
  return cleanCell(collapseRepeatedBankMerchant(namedParty || value)) || transactionName || "中国银行交易";
}

function collapseRepeatedBankMerchant(value) {
  const parts = String(value || "")
    .split(/\s+/)
    .map(cleanCell)
    .filter(Boolean);
  if (parts.length >= 2 && parts[0] === parts[1]) return parts[0];
  if (parts.length >= 2 && parts[1].startsWith(parts[0])) return parts[1];
  return parts.join(" ").replace(/(.{2,40})\s+\1/g, "$1").trim();
}

function normalizeBankAmount(line) {
  const afterCurrency = String(line || "").match(/人民币\s*([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})/);
  if (afterCurrency) {
    const value = Number(afterCurrency[1].replace(/,/g, ""));
    if (Number.isFinite(value) && value !== 0) {
      return {
        raw: afterCurrency[1],
        signedValue: value,
        amount: Math.abs(value),
      };
    }
  }

  const moneyPattern = /(?:CNY|RMB|人民币|￥|¥)?\s*[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{1,2}/gi;
  const tokens = Array.from(line.matchAll(moneyPattern))
    .map((match) => ({
      raw: match[0],
      index: match.index || 0,
      value: Number(String(match[0]).replace(/CNY|RMB|人民币|￥|¥|,/gi, "").replace(/\s+/g, "")),
    }))
    .filter((item) => Number.isFinite(item.value) && Math.abs(item.value) > 0)
    .filter((item) => !/^20\d{6}$/.test(String(item.raw).replace(/\D/g, "")))
    .filter((item) => !isLikelyDateNumber(line, item));

  if (!tokens.length) return null;

  const signed = tokens.find((item) => /^[\sA-Z￥¥人民币]*[+-]/i.test(item.raw));
  const selected = signed || (tokens.length > 1 && /余额|账户余额|可用余额/.test(line) ? tokens[0] : tokens[0]);
  return {
    raw: selected.raw,
    signedValue: selected.value,
    amount: Math.abs(selected.value),
  };
}

function isLikelyDateNumber(line, amountToken) {
  const before = line.slice(Math.max(0, amountToken.index - 2), amountToken.index);
  const after = line.slice(amountToken.index + amountToken.raw.length, amountToken.index + amountToken.raw.length + 2);
  return /[年\-/.]/.test(before) || /[月\-/.日]/.test(after);
}

function detectBankTransactionType(line, amountInfo) {
  if (/网上快捷退款|退款|退货|退回|冲回|冲正/.test(line)) return "退款";
  if (/网上快捷提现|余额宝提现|本人|本户|本账户|本人账户|账户互转|账户转移|互转|还款|信用卡还款|理财|基金|申购|赎回|定投|余额转存|定期|账户调整|结息调整/.test(line)) return "排除";
  if (/收入金额|贷方|入账|转入|工资|薪资|利息|结息|收款|存入|来账/.test(line)) return "收入";
  if (/支出金额|借方|出账|消费|支付|转出|手续费|取现|扣款|缴费|付款/.test(line)) return "支出";
  if (amountInfo.signedValue < 0) return "支出";
  if (amountInfo.signedValue > 0) return "收入";
  return "支出";
}

function normalizeBankDateTime(value) {
  const compact = String(value || "").match(/^20\d{6}$/)?.[0];
  if (compact) return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)} 00:00:00`;

  const date = String(value || "")
    .replace(/[年月/.]/g, "-")
    .replace(/日/g, "")
    .trim();
  const [datePart, timePart = "00:00:00"] = date.split(/\s+/);
  const [year, month, day] = datePart.split("-");
  return `${year}-${String(month || "1").padStart(2, "0")}-${String(day || "1").padStart(2, "0")} ${normalizeTimeText(timePart)}`;
}

function cleanBankDescription(line, dateText, amountText) {
  return maskBankSensitiveText(line)
    .replace(dateText, " ")
    .replace(amountText, " ")
    .replace(/(?:CNY|RMB|人民币|￥|¥)?\s*[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?/gi, " ")
    .replace(/中国银行|Bank of China|BANK OF CHINA|账户余额|可用余额|借方|贷方|收入金额|支出金额/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBankCounterparty(line, fallback) {
  const match = line.match(/(?:对方户名|户名|收款人|付款人|对方名称)[:：]?\s*([^，,;；\s]{2,40})/);
  return cleanCell(maskBankSensitiveText(match?.[1] || fallback || "中国银行交易"));
}

function inferBankTransactionName(line, type) {
  if (/手续费/.test(line)) return "手续费";
  if (/工资|薪资/.test(line)) return "工资";
  if (/利息|结息/.test(line)) return "利息";
  if (/转账|转入|转出|汇款|来账/.test(line)) return "转账";
  if (/消费|支付|扣款|缴费/.test(line)) return "消费";
  if (type === "排除") return "账户调整";
  return "银行交易";
}
