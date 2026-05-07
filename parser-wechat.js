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

  return lines.slice(start + 1).map((line) => {
    const cells = splitDelimitedLine(line, delimiter);
    return headers.reduce((row, header, index) => {
      row[header || `列${index + 1}`] = cleanCell(cells[index] || "");
      return row;
    }, {});
  });
}

function rowsToObjects(rows) {
  const headerIndex = rows.findIndex((row) => isBillHeader(row.map(cleanCell)));
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map(cleanCell);
  return rows.slice(headerIndex + 1).map((row) => {
    return headers.reduce((record, header, index) => {
      record[header || `列${index + 1}`] = cleanCell(row[index] || "");
      return record;
    }, {});
  });
}

function isBillHeader(cells) {
  const text = cells.join("|");
  return /交易时间|支付时间|创建时间|记账日期|交易日期|时间/.test(text) && /金额|收\/支|收入|支出/.test(text);
}
