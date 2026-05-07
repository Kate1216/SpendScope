// Shared parser utilities for SpendScope. Loaded before script.js.

function addBillSourceMeta(row, platformFromFile, sourceFromFile) {
  const unknownSource = "\u672a\u77e5\u6765\u6e90";
  const existingSource = getTransactionSourcePlatform(row);
  const explicitSource = detectBillSourcePlatform(`${row["\u8d26\u5355\u6765\u6e90"] || ""} ${row["\u6765\u6e90"] || ""}`);
  const parserSource = normalizeStatementSourcePlatform(row["\u5e73\u53f0"]);
  const detectedSource = detectBillSourcePlatform(Object.keys(row).join(" "));
  const sourcePlatform = [sourceFromFile, existingSource, explicitSource, parserSource, detectedSource].find(
    (source) => source && source !== unknownSource && source !== "\u672a\u77e5"
  );

  return {
    ...row,
    __platformFromFile: platformFromFile,
    __sourcePlatform: sourcePlatform || unknownSource,
  };
}

function detectBillSourcePlatform(text) {
  const value = String(text || "");
  if (/\u4ea4\u6613\u6d41\u6c34\u660e\u7ec6|\u8bb0\u8d26\u65e5\u671f|\u8bb0\u8d26\u65f6\u95f4|\u5bf9\u65b9\u8d26\u6237\u540d|Bank of China|BANK OF CHINA/.test(value)) {
    return "\u4e2d\u56fd\u94f6\u884c";
  }
  if (/\u5fae\u4fe1|wechat|\u8d22\u4ed8\u901a|\u96f6\u94b1/.test(value)) return "\u5fae\u4fe1";
  if (/\u652f\u4ed8\u5b9d|alipay|\u4f59\u989d\u5b9d|\u82b1\u5457/.test(value)) return "\u652f\u4ed8\u5b9d";
  if (/\u4e2d\u56fd\u94f6\u884c|\u4e2d\u884c/.test(value)) return "\u4e2d\u56fd\u94f6\u884c";
  return "\u672a\u77e5\u6765\u6e90";
}

function normalizeStatementSourcePlatform(value) {
  const text = cleanCell(value || "");
  if (/^(微信|支付宝|中国银行)$/.test(text)) return text;
  if (/^wechat$/i.test(text)) return "微信";
  if (/^alipay$/i.test(text)) return "支付宝";
  return "\u672a\u77e5\u6765\u6e90";
}

function firstKnownSourcePlatform(...sources) {
  return sources.find((source) => source && source !== "\u672a\u77e5\u6765\u6e90" && source !== "\u672a\u77e5") || "\u672a\u77e5\u6765\u6e90";
}

function getTransactionSourcePlatform(item) {
  const value = String(item?.sourcePlatform || item?.__sourcePlatform || item?.billSource || item?.fileSource || "");

  if (value.includes("\u5fae\u4fe1")) return "\u5fae\u4fe1";
  if (value.includes("\u652f\u4ed8\u5b9d")) return "\u652f\u4ed8\u5b9d";
  if (value.includes("\u4e2d\u56fd\u94f6\u884c")) return "\u4e2d\u56fd\u94f6\u884c";

  const platform = String(item?.platform || "");
  if (platform === "\u4e2d\u56fd\u94f6\u884c") return "\u4e2d\u56fd\u94f6\u884c";

  return "\u672a\u77e5";
}

function detectSourcePlatform(row) {
  const explicitSource = getTransactionSourcePlatform({
    sourcePlatform: row?.sourcePlatform || row?.__sourcePlatform || row?.["\u8d26\u5355\u6765\u6e90"] || row?.["\u6765\u6e90"],
  });
  if (explicitSource !== "\u672a\u77e5") return explicitSource;

  const parserSource = normalizeStatementSourcePlatform(row?.["\u5e73\u53f0"]);
  if (parserSource !== "\u672a\u77e5\u6765\u6e90") return parserSource;

  const headerSource = detectBillSourcePlatform(Object.keys(row || {}).join(" "));
  if (headerSource !== "\u672a\u77e5\u6765\u6e90") return headerSource;

  return "\u672a\u77e5";
}

function textItemsToLines(items, pageNumber) {
  const buckets = new Map();

  items.forEach((item) => {
    const y = Math.round(item.transform[5]);
    const key = `${pageNumber}:${y}`;
    const current = buckets.get(key) || [];
    current.push({ x: item.transform[4], text: item.str });
    buckets.set(key, current);
  });

  return Array.from(buckets.entries())
    .sort((a, b) => {
      const [pageA, yA] = a[0].split(":").map(Number);
      const [pageB, yB] = b[0].split(":").map(Number);
      return pageA === pageB ? yB - yA : pageA - pageB;
    })
    .map(([, lineItems]) =>
      lineItems
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);
}

function splitPdfLine(line) {
  return line.split(/\s{2,}|\t+/).map(cleanCell).filter(Boolean);
}

function parseTransactionLine(line, nextLine, platform) {
  const text = `${line} ${nextLine}`.replace(/\s+/g, " ").trim();
  const dates = text.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?/g);
  if (!dates) return null;

  const typeMatch = text.match(/收入|支出|不计收支|中性/);
  const amountMatches = Array.from(text.matchAll(/[¥￥]?\s*-?\d+(?:,\d{3})*(?:\.\d{1,2})/g)).map((match) => match[0]);
  const amountText = amountMatches.find((value) => Math.abs(toNumber(value)) > 0);
  if (!amountText) return null;

  const merchant = guessMerchantFromPdfLine(text, dates);
  return {
    交易时间: dates[0],
    平台: platform,
    交易对方: merchant,
    商品: merchant,
    "收/支": typeMatch ? typeMatch[0].replace("不计收支", "中性") : "",
    "金额(元)": Math.abs(toNumber(amountText)),
  };
}

function guessMerchantFromPdfLine(text, dates) {
  let cleaned = text;
  dates.forEach((date) => {
    cleaned = cleaned.replace(date, " ");
  });
  cleaned = cleaned
    .replace(/[¥￥]?\s*-?\d+(?:,\d{3})*(?:\.\d{1,2})/g, " ")
    .replace(/收入|支出|不计收支|中性|交易成功|支付成功|已退款|退款成功/g, " ")
    .replace(/\b\d{12,}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(" ").filter((part) => part.length > 1);
  return parts.slice(-2).join(" ") || "支付宝交易";
}

async function readTextFile(file) {
  const buffer = await file.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  if (looksReadableBill(utf8)) return utf8;

  try {
    const gbText = new TextDecoder("gb18030").decode(buffer);
    return looksReadableBill(gbText) ? gbText : utf8;
  } catch {
    return utf8;
  }
}

function looksReadableBill(text) {
  return /交易|时间|日期|金额|收入|支出|收\/支|支付宝|微信|银行/.test(text) && !text.includes("�");
}

function detectDelimiter(line) {
    const commaCount = (line.match(/,/g) || []).length;
  const tabCount = (line.match(/\t/g) || []).length;
  return tabCount > commaCount ? "\t" : ",";
}

function splitDelimitedLine(line, delimiter) {
  const cells = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  cells.push(value);
  return cells;
}

function parseAmount(value, row) {
  const direct = toNumber(value);
  if (Number.isFinite(direct) && direct !== 0) return direct;

  const expenseKey = Object.keys(row).find((key) => /支出/.test(key));
  const incomeKey = Object.keys(row).find((key) => /收入/.test(key));
  const expense = expenseKey ? toNumber(row[expenseKey]) : 0;
  const income = incomeKey ? toNumber(row[incomeKey]) : 0;

  if (expense) return -Math.abs(expense);
  if (income) return Math.abs(income);
  return 0;
}

function toNumber(value) {
  const text = String(value ?? "").replace(/[¥￥,\s]/g, "").replace(/[()]/g, "-");
  const match = text.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }
  const text = String(value || "").trim().replace(/\//g, "-");
  const normalized = /^\d{4}-\d{1,2}-\d{1,2}/.test(text) ? text : text.replace(/^(\d{1,2})-(\d{1,2})/, `${new Date().getFullYear()}-$1-$2`);
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function detectPlatform(text) {
  const value = String(text).toLowerCase();
  if (/微信|wechat/.test(value)) return "微信";
  if (/支付宝|alipay/.test(value)) return "支付宝";
  if (/银行|银行卡|信用卡|储蓄卡|bank|cmb|icbc|ccb|abc|boc/.test(value)) return "银行";
  return "未知来源";
}

function cleanCell(value) {
  return String(value ?? "").trim().replace(/^"|"$/g, "");
}

function normalizeDateText(date) {
  const [year, month, day] = date.replace(/\//g, "-").split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizeTimeText(time) {
  const parts = time.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${(parts[2] || "00").padStart(2, "0")}`;
}

function maskBankSensitiveText(text) {
  return String(text || "")
    .replace(/\d{8,}/g, (match) => `****${match.slice(-4)}`)
    .replace(/1[3-9]\d{9}/g, (match) => `****${match.slice(-4)}`);
}

function maskDebugRow(row) {
  if (!row || typeof row !== "object") return row;
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, maskBankSensitiveText(value)]));
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    addBillSourceMeta,
    cleanCell,
    detectBillSourcePlatform,
    detectDelimiter,
    detectPlatform,
    detectSourcePlatform,
    firstKnownSourcePlatform,
    getTransactionSourcePlatform,
    guessMerchantFromPdfLine,
    looksReadableBill,
    maskBankSensitiveText,
    maskDebugRow,
    normalizeDateText,
    normalizeStatementSourcePlatform,
    normalizeTimeText,
    parseAmount,
    parseDate,
    parseTransactionLine,
    readTextFile,
    splitDelimitedLine,
    splitPdfLine,
    textItemsToLines,
    toNumber,
  });
}
