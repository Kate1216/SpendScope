// Alipay PDF parser helpers for SpendScope.
const ALIPAY_BACKEND_PARSE_URL = "http://127.0.0.1:8000/api/parse/alipay";
const ALIPAY_TRANSFER_EXCLUDE_PATTERN = /余额宝-自动转入|余额宝自动转入|银行卡定时转入|转出到银行卡|自动转入|定时转入|账户转存|账户转移|基金转入|基金转出|提现|充值到余额|余额充值/;
const SHIPPING_COMPENSATION_PATTERN = /运费补偿|运费补贴|运费险|退运费|运费赔付|小额打款-?运费补偿/;
async function parseAlipayPdfWithBackend(file) {
  const formData = new FormData();
  formData.append("file", file);

  console.info("[Alipay Backend Fetch Start]", {
    url: ALIPAY_BACKEND_PARSE_URL,
    fileName: file.name,
  });
  const response = await fetch(ALIPAY_BACKEND_PARSE_URL, {
    method: "POST",
    body: formData,
  });
  console.info("[Alipay Backend Fetch Response]", {
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new Error(`Alipay backend parse failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  console.info("[Alipay Backend Fetch Data]", {
    ok: data.ok,
    parser: data.parser,
    rows: Array.isArray(data.rows) ? data.rows.length : null,
    debug: data.debug,
  });
  if (data?.ok !== true || !Array.isArray(data.rows) || data.rows.length === 0) {
    throw new Error(data?.error || "Alipay backend returned no rows");
  }

  console.info("[Alipay Backend Parse]", {
    parser: data.parser,
    rows: data.rows.length,
    debug: data.debug,
  });

  return data.rows;
}

function isLikelyAlipayPdf(file, text) {
  return /支付宝|alipay/i.test(file?.name || "") || /支付宝|余额宝|收\s*\/\s*支|交易对方|商品说明/.test(text || "");
}

function parseAlipayPdfText(text) {
  const lines = text
    .split(/\r?\n/)
    .map(cleanCell)
    .filter(Boolean);
  const alipayStartCandidates = lines
    .map((line, index) => ({ index, line }))
    .filter((item) => isAlipayStartCandidateLine(item.line));
  const startIndexes = lines
    .map((line, index) => (isAlipayTransactionStartLine(line, lines[index + 1]) ? index : -1))
    .filter((index) => index >= 0);
  const blocks = startIndexes.map((start, index) => {
    const end = startIndexes[index + 1] ?? lines.length;
    const rawLines = lines.slice(start, end);
    const normalizedLines = normalizeAlipayBlockLines(rawLines);
    return {
      rawLines,
      lines: normalizedLines,
      text: normalizedLines.join(" ").replace(/\s+/g, " ").trim(),
    };
  });
  const rows = [];
  let droppedBlocks = 0;

  console.info("[Alipay Raw Lines]", {
    lines: lines.length,
    sample: lines.slice(0, 80),
  });
  console.table(
    alipayStartCandidates.slice(0, 120).map((item) => ({
      index: item.index,
      line: item.line,
      nextLine: lines[item.index + 1],
      next2Line: lines[item.index + 2],
    }))
  );

  blocks.forEach((block, index) => {
    const parsed = parseAlipayBlockWithReason(block);
    if (parsed.row) {
      rows.push(parsed.row);
    } else {
      droppedBlocks += 1;
      console.warn("[Alipay Dropped Block]", {
        index,
        firstLine: block.rawLines?.[0],
        text: block.text,
        rawLines: block.rawLines,
        reason: parsed.reason,
      });
    }
  });

  console.info("[Alipay Keep All]", {
    startCandidates: startIndexes.length,
    blocks: blocks.length,
    rows: rows.length,
    droppedBlocks,
  });
  console.table(
    rows.slice(0, 30).map((row) => ({
      time: row["交易时间"],
      type: row["收/支"],
      merchant: row["交易对方"],
      description: row["交易说明"],
      platform: row["平台"],
      amount: row["金额"],
      sourcePlatform: row.__sourcePlatform || row.sourcePlatform,
    }))
  );

  logAlipayParseDetail(rows, blocks.length);
  return rows;
}

function isAlipayStartCandidateLine(line) {
  const value = String(line || "").trim();
  return /^(支出|收入|收支|不计\s*收支|不计收支|不计)/.test(value);
}

function isAlipayTransactionStartLine(line, nextLine = "") {
  const value = String(line || "").trim();
  const next = String(nextLine || "").trim();
  return /^(支出|收入|收支|不计\s*收支|不计收支|不计)/.test(value) || (value === "不计" && /^收\s*支/.test(next));
}

function normalizeAlipayBlockLines(block) {
  if (block[0] === "不计" && /^收\s*支/.test(block[1] || "")) {
    return [`不计收支${String(block[1] || "").replace(/^收\s*支/, "")}`.trim(), ...block.slice(2)];
  }
  if (block[0] === "不计 收支") {
    return ["不计收支", ...block.slice(1)];
  }
  return block;
}

function logAlipayParseDetail(rows, blocksLength = rows.length) {
  const expenseRows = rows.filter((row) => row["收/支"] === "支出").length;
  const incomeRows = rows.filter((row) => row["收/支"] === "收入").length;
  const pendingRows = rows.filter((row) => !["支出", "收入"].includes(row["收/支"])).length;

  console.info("[Alipay Parse Detail]", {
    rows: rows.length,
    expenseRows,
    incomeRows,
    pendingRows,
  });
}

function extractAlipayRefundRowsFromText(text) {
  const lines = text
    .split(/\r?\n/)
    .map(cleanCell)
    .filter(Boolean);

  return lines
    .map((line, index) => {
      if (!/退款/.test(line)) return null;
      const start = Math.max(0, index - 1);
      const end = Math.min(lines.length, index + 11);
      return parseAlipayRefundBlock(lines.slice(start, end), line);
    })
    .filter(Boolean);
}

function parseAlipayRefundBlock(block, refundLine) {
  const refundBlock = block.join(" ").replace(/\s+/g, " ").trim();
  const time = extractAlipayTime(refundBlock, block);
  const amount = extractAlipayRefundAmount(refundBlock);
  if (!time || !Number.isFinite(amount) || amount <= 0) return null;

  const merchant = extractAlipayRefundMerchant(refundBlock);
  const description = extractAlipayRefundDescription(refundBlock, refundLine);
  const paymentMethod = extractAlipayPaymentMethod(refundBlock);

  return {
    "收/支": "退款",
    原始收支: "退款",
    交易对方: merchant,
    商品说明: description,
    交易说明: description,
    "收/付款方式": paymentMethod || "",
    金额: amount,
    交易时间: time,
    平台: "支付宝",
    __sourcePlatform: "支付宝",
    sourcePlatform: "支付宝",
    消费类别: categorizeRefund(`${merchant} ${description}`),
  };
}

function extractAlipayRefundMerchant(refundBlock) {
  const betweenNeutralAndRefund = refundBlock.match(/不计\s+(.{1,80}?)\s*退款/)?.[1];
  const candidate = betweenNeutralAndRefund || refundBlock.match(/([一-龥A-Za-z0-9*·（）()_-]{2,40})\s*退款/)?.[1] || "";
  return cleanupAlipayRefundText(candidate) || "支付宝退款";
}

function extractAlipayRefundDescription(refundBlock, refundLine) {
  const fromRefund = refundBlock.match(/退款[-—]?.{0,160}/)?.[0] || refundLine;
  return cleanupAlipayRefundText(fromRefund) || "退款";
}

function extractAlipayRefundAmount(refundBlock) {
  const refundIndex = refundBlock.indexOf("退款");
  const dateIndex = refundBlock.search(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/);
  const preferredText = refundBlock.slice(Math.max(0, refundIndex), dateIndex > refundIndex ? dateIndex : refundBlock.length);
  const matches = Array.from((preferredText || refundBlock).matchAll(/(?:¥|￥)?\s*(\d{1,6}(?:,\d{3})*\.\d{2})/g))
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value >= 0.01 && value <= 100000);
  if (matches.length) return matches[0];

  const fallbackMatches = Array.from(refundBlock.matchAll(/(?:¥|￥)?\s*(\d{1,6}(?:,\d{3})*\.\d{2})/g))
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value >= 0.01 && value <= 100000);
  return fallbackMatches[0] || 0;
}

function cleanupAlipayRefundText(text) {
  return String(text || "")
    .replace(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g, " ")
    .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, " ")
    .replace(/(?:¥|￥)?\s*\d{1,6}(?:,\d{3})*\.\d{2}/g, " ")
    .replace(/\b\d{10,}\b/g, " ")
    .replace(/不计|收支|余额宝|银行卡|信用卡|储蓄卡|中国银行储蓄卡\(\d+\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeDedupAlipayRows(normalRows, refundRows) {
  const map = new Map();

  [...normalRows, ...refundRows].forEach((row) => {
    const key = [row["交易时间"], Number(row["金额"]).toFixed(2), row["交易对方"], row["收/支"]].join("|");
    if (!map.has(key)) map.set(key, row);
  });

  return Array.from(map.values());
}

function mergeAlipayLines(lines) {
  const merged = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    const next = lines[index + 1] || "";
    if (/^不计\s*$/.test(current) && /^收\s*支/.test(next)) {
      merged.push(`不计收支${next.replace(/^收\s*支/, "")}`.trim());
      index += 1;
    } else if (/^不计\s+收支/.test(current)) {
      merged.push(current.replace(/^不计\s+收支/, "不计收支"));
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function parseAlipayBlock(block) {
  return parseAlipayBlockWithReason(block).row;
}

function parseAlipayBlockWithReason(block) {
  const lines = Array.isArray(block) ? block : block?.lines || [];
  const text = Array.isArray(block) ? block.join(" ") : block?.text || lines.join(" ");
  if (!lines.length) return { row: null, reason: "empty block" };

  const firstLine = lines[0];
  const rawType = normalizeAlipayRawType(firstLine.match(/^(支出|收入|收支|不计\s*收支|不计收支|不计)/)?.[1]);
  const type = normalizeAlipayDisplayType(rawType);
  if (!rawType) {
    return { row: null, reason: "missing alipay type" };
  }

  const firstPayload = firstLine.replace(/^(支出|收入|收支|不计\s*收支|不计收支|不计)\s*/, "").trim();
  const parts = [firstPayload, ...lines.slice(1)].map(cleanCell).filter(Boolean);
  const blockText = (text || parts.join(" ")).replace(/\s+/g, " ").trim();
  const transactionTime = extractAlipayTime(blockText, lines);
  const amount = extractAlipayAmount(blockText, transactionTime);
  if (!transactionTime) {
    return { row: null, reason: "missing transaction time" };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { row: null, reason: "missing transaction amount" };
  }

  const merchant = extractAlipayMerchant(parts) || "支付宝";
  const description = extractAlipayDescription(parts, merchant, transactionTime, amount) || merchant || "支付宝";
  const paymentMethod = extractAlipayPaymentMethod(blockText);
  const row = {
    "收/支": type,
    原始收支: rawType,
    交易对方: merchant,
    商品说明: description,
    交易说明: description || blockText || "支付宝",
    "收/付款方式": paymentMethod,
    金额: amount,
    交易时间: transactionTime,
    平台: "支付宝",
    __sourcePlatform: "支付宝",
    sourcePlatform: "支付宝",
    __rawBlockText: blockText,
    __rawLines: block.rawLines || lines,
    __normalizedLines: lines,
    原始文本: blockText,
  };

  return { row: normalizeAlipayTransactionType(row), reason: "" };
}

function normalizeAlipayRawType(type) {
  const value = String(type || "").replace(/\s+/g, "");
  if (value === "不计收支") return "不计收支";
  return value;
}

function normalizeAlipayDisplayType(rawType) {
  if (rawType === "支出" || rawType === "收入") return rawType;
  return "排除";
}

function normalizeAlipayTransactionType(row) {
  const type = row["收/支"];
  if (type === "支出" || type === "收入") return row;

  const rawType = row["原始收支"] || row.rawType || row.originalType || type || "未知";
  return {
    ...row,
    "收/支": "排除",
    消费类别: "排除",
    excludeReason: "支付宝待分类",
    rawType,
    originalType: rawType,
  };
}

function extractAlipayTime(blockText, block) {
  const date = blockText.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/)?.[0];
  const time = blockText.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/)?.[0];
  if (date && time) return `${normalizeDateText(date)} ${normalizeTimeText(time)}`;
  if (date) return `${normalizeDateText(date)} 00:00:00`;

  for (let index = 0; index < block.length - 1; index += 1) {
    const dateLine = block[index].match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/)?.[0];
    const timeLine = block[index + 1].match(/^\d{1,2}:\d{2}(?::\d{2})?$/)?.[0];
    if (dateLine && timeLine) return `${normalizeDateText(dateLine)} ${normalizeTimeText(timeLine)}`;
  }

  const dateLine = block.find((line) => /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(line));
  if (dateLine) return `${normalizeDateText(dateLine)} 00:00:00`;

  return "";
}

function extractAlipayAmount(blockText, transactionTime) {
  const searchText = (transactionTime ? blockText.replace(transactionTime, " ") : blockText)
    .replace(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g, " ")
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, " ");
  const candidates = Array.from(searchText.matchAll(/(?:¥|￥)?\s*(\d{1,6}(?:,\d{3})*\.\d{2})/g))
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!candidates.length) return 0;
  return candidates[0];
}

function extractAlipayMerchant(parts) {
  const ignored = /^(交易成功|支付成功|退款成功|已退款|付款|收款|余额|余额宝|花呗|银行卡|支付宝|订单号|商家订单号)$/;
  for (const part of parts) {
    const tokens = part
      .replace(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g, " ")
      .replace(/\d{1,2}:\d{2}(?::\d{2})?/g, " ")
      .replace(/(?:¥|￥)?\s*\d{1,6}(?:,\d{3})*\.\d{2}/g, " ")
      .replace(/\b\d{12,}\b/g, " ")
      .split(/\s+/)
      .map(cleanCell)
      .filter(Boolean);
    const merchant = tokens.find((token) => !ignored.test(token));
    if (merchant) return merchant;
  }

  return "支付宝交易";
}

function extractAlipayDescription(parts, merchant, transactionTime, amount) {
  const amountText = amount.toFixed(2);
  const description = parts
    .filter((part) => part !== merchant)
    .filter((part) => !transactionTime.includes(part))
    .filter((part) => !part.includes(amountText))
    .filter((part) => !/^\d{12,}$/.test(part))
    .filter((part) => !/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(part))
    .filter((part) => !/^\d{1,2}:\d{2}(?::\d{2})?$/.test(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return description || merchant;
}

function extractAlipayPaymentMethod(blockText) {
  return blockText.match(/亲情卡|余额宝|余额|花呗|银行卡|信用卡|储蓄卡|网商银行|支付宝/)?.[0] || "";
}

function applyAlipayClassificationRules(transaction, row = {}) {
  if (transaction.sourcePlatform !== "支付宝") return transaction;

  const descriptionText = [
    row.__rawBlockText,
    row["原始文本"],
    Array.isArray(row.__rawLines) ? row.__rawLines.join(" ") : "",
    Array.isArray(row.__normalizedLines) ? row.__normalizedLines.join(" ") : "",
    row["商品说明"],
    row["交易说明"],
    row.description,
    transaction.description,
  ].join(" ");
  const paymentText = [
    row.__rawBlockText,
    row["原始文本"],
    Array.isArray(row.__rawLines) ? row.__rawLines.join(" ") : "",
    Array.isArray(row.__normalizedLines) ? row.__normalizedLines.join(" ") : "",
    row["收/付款方式"],
    row["付款方式"],
    row["支付方式"],
    row.platform,
    transaction.platform,
  ].join(" ");
  const normalizedDescription = normalizeAlipayRuleText(descriptionText);
  const normalizedPlatform = normalizeAlipayRuleText(paymentText);

  if (normalizedDescription.includes("收益发放") && normalizedPlatform.includes("余额宝")) {
    console.info("[Alipay Income Override Hit]", {
      merchant: transaction.merchant,
      description: transaction.description,
      platform: transaction.platform,
      rawText: row.__rawBlockText || row["原始文本"],
      type: "收入",
      category: "收益",
    });
    return {
      ...transaction,
      type: "收入",
      category: "收益",
      excludeReason: "",
    };
  }

  if (/亲情卡/.test(normalizedPlatform)) {
    return {
      ...transaction,
      type: "排除",
      category: "排除",
      excludeReason: "亲情卡",
    };
  }

  if (normalizedDescription.includes("余额宝自动转入")) {
    return {
      ...transaction,
      type: "排除",
      category: "排除",
      excludeReason: "余额宝自动转入",
    };
  }

  return transaction;
}

function normalizeAlipayRuleText(value) {
  return String(value || "")
    .replace(/[\s\uFEFF\uFFFE\u200B-\u200D\u2060]/g, "")
    .replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "");
}

function normalizeAlipayTransactionTypeText(typeText, row) {
  const raw = String(typeText || row["原始收支"] || row.rawType || row.originalType || "").replace(/\s+/g, "");
  const text = `${raw} ${row["交易对方"] || ""} ${row["商品说明"] || ""} ${row["交易说明"] || ""}`;
  if (/退款|退货|售后退款|运费补偿|运费补贴|运费险|退运费|运费赔付/.test(text)) return "退款";
  if (/排除|不计收支|不计|中性|收支/.test(raw)) return "排除";
  if (/支出|付款|借|消费/.test(raw)) return "支出";
  if (/收入|收款|贷|入账/.test(raw)) return "收入";
  return "";
}
