const TYPE_OPTIONS = ["支出", "收入", "退款", "排除"];
const EXPENSE_CATEGORIES = ["交通", "学习", "正餐", "奶茶咖啡", "零食水果", "聚餐", "运动", "购物", "娱乐", "手工爱好", "宠物", "旅行", "日常开销", "化妆护肤", "群收款", "其他"];
const INCOME_CATEGORIES = ["生活费", "兼职", "工资", "群收款", "理财", "礼金", "其他"];
const REFUND_CATEGORIES = ["退款/抵扣"];
const EXCLUDED_CATEGORIES = ["排除"];

const EXPENSE_CATEGORY_KEYWORDS = [
  ["交通", ["地铁", "公交", "高德打车", "滴滴", "铁路", "12306", "机票", "打车", "停车", "出租车", "网约车"]],
  ["学习", ["课程", "书", "图书", "学校", "学费", "考试", "培训", "知网", "文献", "论文", "教材", "教育"]],
  ["正餐", ["面馆", "菜馆", "饭店", "餐厅", "猪脚饭", "瘦肉丸", "茶餐厅", "食堂", "外卖", "米饭", "盖饭", "炒饭", "火锅", "烧烤", "麻辣烫", "拌饭", "拉面", "饺子", "馄饨", "沙县", "黄焖鸡", "汉堡", "肯德基", "麦当劳"]],
  ["奶茶咖啡", ["奶茶", "咖啡", "瑞幸", "星巴克", "茉莉奶白", "霸王茶姬", "茶百道", "沪上阿姨", "蜜雪冰城", "古茗", "一点点", "喜茶", "奈雪", "饮品", "果茶"]],
  ["零食水果", ["零食", "水果", "果切", "鲜果", "草莓", "香蕉", "苹果", "橙子", "榴莲", "葡萄", "面包", "甜品", "蛋糕", "饼干", "坚果", "零食很忙"]],
  ["聚餐", ["火锅", "烧烤", "餐厅", "酒馆", "聚餐", "AA", "多人", "烤肉", "海底捞", "饭店"]],
  ["运动", ["健身", "羽毛球", "运动", "场馆", "游泳", "瑜伽", "篮球", "网球", "跑步", "健身房"]],
  ["购物", ["淘宝", "天猫", "京东", "拼多多", "抖音电商", "淘宝平台商户", "商场", "服饰", "衣服", "鞋", "包", "数码", "得物", "优衣库", "百货"]],
  ["娱乐", ["电影", "影院", "游戏", "会员", "音乐", "演出", "KTV", "剧本杀", "密室", "视频会员", "腾讯视频", "爱奇艺", "网易云"]],
  ["手工爱好", ["手作", "DIY", "diy", "娃娃", "手工", "陶艺", "画室", "绘画", "盲盒", "模型", "文创", "手办", "拼图"]],
  ["宠物", ["宠物", "猫粮", "猫砂", "猫", "狗", "Wanpy", "顽皮", "猫罐头", "猫条", "宠物医院", "兽医", "猫咪", "狗粮"]],
  ["旅行", ["酒店", "景区", "门票", "旅行", "旅游", "民宿", "携程", "飞猪", "去哪儿", "住宿"]],
  ["日常开销", ["超市", "便利店", "水费", "电费", "燃气", "物业", "话费", "宽带", "充值", "洗衣", "维修", "生活用品", "日用品", "永辉", "罗森", "全家", "711"]],
  ["化妆护肤", ["化妆", "美妆", "护肤", "口红", "粉底", "面膜", "眉笔", "眼影", "香水", "卸妆", "洗面奶"]],
  ["群收款", ["群收款"]],
];

const INCOME_CATEGORY_KEYWORDS = [
  ["生活费", ["生活费", "妈妈", "爸爸", "父母", "家人", "转生活费"]],
  ["兼职", ["兼职", "劳务", "小额打款", "补偿", "稿费", "报酬"]],
  ["工资", ["工资", "薪资", "工资发放", "薪水", "公司"]],
  ["群收款", ["群收款"]],
  ["理财", ["余额宝收益", "收益发放", "理财", "基金收益", "利息"]],
  ["礼金", ["礼物", "礼金", "份子钱", "祝福"]],
];

const FIELD_ALIASES = {
  time: ["交易时间", "支付时间", "创建时间", "记账日期", "交易日期", "时间", "日期", "date", "time"],
  merchant: ["交易对方", "商户", "商家", "对方户名", "收/付款方", "交易对象", "对方", "merchant", "counterparty"],
  description: ["商品", "商品说明", "交易说明", "备注", "摘要", "交易摘要", "说明", "description", "memo"],
  type: ["收/支", "收支", "交易类型", "类型", "收入/支出", "借贷标志", "type"],
  amount: ["金额", "交易金额", "金额(元)", "交易金额(元)", "人民币金额", "支出", "收入", "amount"],
  platform: ["平台", "来源", "账单来源", "支付方式", "付款方式", "收款方式", "platform"],
  transactionType: ["交易类型", "业务类型", "账务类型", "transaction type"],
};

const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });
const charts = {};
const STORAGE_KEY = "spendscope.transactions.v1";
const CUSTOM_CATEGORY_KEY = "spendscope_custom_categories";
let allTransactions = [];
let isSaved = false;
let hasUnsavedChanges = false;
let customCategories = { expense: [], income: [] };
let currentTableTransactions = [];

const billUploader = document.getElementById("billUploader");
const uploadPanel = document.querySelector(".upload-panel");
const uploadConfirm = document.getElementById("uploadConfirm");
const saveLocalButton = document.getElementById("saveLocal");
const clearStorageButton = document.getElementById("clearStorage");
const exportExcelButton = document.getElementById("exportExcel");
const exportPdfButton = document.getElementById("exportPdf");
const transactionTable = document.getElementById("transactionTable");
const tableSearch = document.getElementById("tableSearch");
const headerFilterMenu = document.getElementById("headerFilterMenu");
const headerFilterOptions = document.getElementById("headerFilterOptions");
const headerFilterButtons = Array.from(document.querySelectorAll(".th-filter"));
const manageCategoriesButton = document.getElementById("manageCategories");
const categoryModal = document.getElementById("categoryModal");
const closeCategoryModalButton = document.getElementById("closeCategoryModal");
const cancelCategoryModalButton = document.getElementById("cancelCategoryModal");
const addCategoryButton = document.getElementById("addCategory");
const customCategoryType = document.getElementById("customCategoryType");
const customCategoryName = document.getElementById("customCategoryName");
const categoryMessage = document.getElementById("categoryMessage");
const loadingOverlay = document.getElementById("loadingOverlay");
let pendingFiles = [];
let activeHeaderFilter = "";
const tableFilters = {
  platform: "",
  type: "",
  category: "",
  merchant: "",
  transactionType: "",
};
let tableFilterOptions = {
  platform: [],
  type: [],
  category: [],
  merchant: [],
  transactionType: [],
};

document.addEventListener("DOMContentLoaded", () => {
  loadCustomCategories();
  restoreDashboardFromStorage();
  updateFilterOptions();
});

window.addEventListener("beforeunload", handleBeforeUnload);
saveLocalButton.addEventListener("click", () => {
  if (saveTransactionsToStorage()) {
    markSaved("当前报告已保存到本浏览器，刷新页面后可自动恢复。");
  }
});
clearStorageButton.addEventListener("click", clearStoredTransactions);
exportExcelButton.addEventListener("click", exportTransactionsToExcel);
exportPdfButton.addEventListener("click", exportReportToPdf);
transactionTable.addEventListener("change", handleTransactionEdit);
tableSearch.addEventListener("input", handleSearchInput);
headerFilterButtons.forEach((button) => {
  button.addEventListener("click", (event) => openHeaderFilter(event.currentTarget));
});
headerFilterOptions.addEventListener("click", handleHeaderFilterOptionClick);
document.addEventListener("click", closeHeaderFilterOnOutsideClick);
manageCategoriesButton.addEventListener("click", openCategoryModal);
closeCategoryModalButton.addEventListener("click", closeCategoryModal);
cancelCategoryModalButton.addEventListener("click", closeCategoryModal);
addCategoryButton.addEventListener("click", addCustomCategory);
updateActionButtons();

billUploader.addEventListener("change", async (event) => {
  handleSelectedFiles(Array.from(event.target.files || []));
});

["dragenter", "dragover"].forEach((eventName) => {
  uploadPanel.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadPanel.classList.add("is-dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  uploadPanel.addEventListener(eventName, (event) => {
    event.preventDefault();
    uploadPanel.classList.remove("is-dragover");
  });
});

uploadPanel.addEventListener("drop", async (event) => {
  const files = Array.from(event.dataTransfer?.files || []);
  handleSelectedFiles(files);
});

function handleSelectedFiles(files) {
  if (!files.length) return;
  pendingFiles = files;
  const count = pendingFiles.length;
  uploadConfirm.innerHTML = `
    <p>已选择 ${count} 个文件，是否开始上传并生成月度账单报告？</p>
    <div class="upload-actions">
      <button class="primary" type="button" id="confirmUpload">确认上传</button>
      <button class="secondary" type="button" id="cancelUpload">取消</button>
    </div>
  `;
  uploadConfirm.classList.remove("hidden");
  setStatus(`已选择 ${count} 个文件，等待确认上传。`);
  document.getElementById("confirmUpload").addEventListener("click", confirmUploadFiles);
  document.getElementById("cancelUpload").addEventListener("click", cancelUploadFiles);
}

async function confirmUploadFiles() {
  const files = pendingFiles.slice();
  pendingFiles = [];
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  setLoading(true);
  try {
    await processFiles(files);
  } finally {
    setLoading(false);
  }
}

function cancelUploadFiles() {
  pendingFiles = [];
  billUploader.value = "";
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  setStatus("等待上传账单文件");
}

async function processFiles(files) {
  if (!files.length) return;
  setStatus(`正在解析 ${files.length} 个文件...`);
  try {
    const rows = (await Promise.all(files.map(readBillFile))).flat();
    const transactions = ensureTransactionIds(rows.map(normalizeRow).filter(Boolean).sort((a, b) => a.date - b.date));
    if (!transactions.length) {
      setStatus("没有识别到可用交易，请确认账单中包含时间、金额等字段。");
      renderDashboard([]);
      return;
    }
    allTransactions = transactions;
    populateMonthFilter(transactions);
    const selectedMonth = document.getElementById("monthFilter").value;
    renderSelectedMonth(selectedMonth);
    markUnsaved();
  } catch (error) {
    console.error(error);
    setStatus(`解析失败：${error.message || "请检查文件格式"}`);
  }
}

function saveTransactionsToStorage() {
  try {
    const payload = allTransactions.map((item) => ({
      ...item,
      date: item.date instanceof Date ? item.date.toISOString() : item.date,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.warn("[SpendScope Storage] 保存本地报告失败:", error);
    setStatus("保存失败，请检查浏览器本地存储权限。");
    return false;
  }
}

function loadTransactionsFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Stored transactions must be an array");
    const restored = parsed
      .map((item) => migrateStoredTransaction({ ...item, date: new Date(item.date) }))
      .filter((item) => item.date instanceof Date && !Number.isNaN(item.date.getTime()));
    if (parsed.length && restored.length !== parsed.length) throw new Error("Stored transactions contain invalid dates");
    return ensureTransactionIds(restored);
  } catch (error) {
    console.warn("[SpendScope Storage] 本地报告数据损坏，已清除:", error);
    localStorage.removeItem(STORAGE_KEY);
    setStatus("本地保存的数据无法恢复，请重新上传账单文件。");
    return [];
  }
}

function loadCustomCategories() {
  const raw = localStorage.getItem(CUSTOM_CATEGORY_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    customCategories = {
      expense: Array.isArray(parsed.expense) ? parsed.expense.filter(isValidCustomCategory) : [],
      income: Array.isArray(parsed.income) ? parsed.income.filter(isValidCustomCategory) : [],
    };
  } catch (error) {
    console.warn("[SpendScope Storage] 自定义分类数据损坏，已清除:", error);
    localStorage.removeItem(CUSTOM_CATEGORY_KEY);
    customCategories = { expense: [], income: [] };
  }
}

function saveCustomCategories() {
  localStorage.setItem(CUSTOM_CATEGORY_KEY, JSON.stringify(customCategories));
}

function isValidCustomCategory(name) {
  const value = cleanCell(name);
  return Boolean(value && value !== "人情往来");
}

function migrateStoredTransaction(item) {
  const type = item.type === "中性" ? "排除" : item.type;
  const categoryParts = {
    description: item.description || "",
    merchant: item.merchant || "",
    transactionType: item.transactionType || "",
  };
  return {
    ...item,
    transactionType: item.transactionType || "-",
    type,
    category: normalizeCategoryForType(type, item.category, categoryParts),
  };
}

function ensureTransactionIds(transactions) {
  return transactions.map((item, index) => ({
    ...item,
    id: item.id || `${item.time || "time"}-${item.platform || "platform"}-${item.merchant || "merchant"}-${item.amount || 0}-${index}-${Date.now()}`,
  }));
}

function restoreDashboardFromStorage() {
  const restored = loadTransactionsFromStorage();
  if (!restored.length) return;

  allTransactions = restored;
  populateMonthFilter(allTransactions);
  renderSelectedMonth(document.getElementById("monthFilter").value);
  markSaved(`已从本地恢复 ${allTransactions.length} 笔交易。`);
}

function clearStoredTransactions() {
  localStorage.removeItem(STORAGE_KEY);
  allTransactions = [];
  pendingFiles = [];
  billUploader.value = "";
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  resetDashboard();
  markSaved("等待上传账单文件");
}

function resetDashboard() {
  const monthFilter = document.getElementById("monthFilter");
  currentTableTransactions = [];
  monthFilter.innerHTML = '<option value="">暂无数据</option>';
  monthFilter.disabled = true;
  Object.values(charts).forEach((chart) => chart.destroy());
  Object.keys(charts).forEach((key) => delete charts[key]);
  renderDashboard([]);
  monthFilter.innerHTML = '<option value="">暂无数据</option>';
  monthFilter.disabled = true;
  document.getElementById("aiSummary").textContent = "上传账单后，这里会生成本月总体情况、主要支出类别、值得注意的消费和下月建议。";
  resetTableFilters();
  updateFilterOptions();
  setStatus("等待上传账单文件");
  updateActionButtons();
}

function updateActionButtons() {
  const hasData = allTransactions.length > 0;
  saveLocalButton.disabled = !hasData || !hasUnsavedChanges;
  clearStorageButton.disabled = !hasData && !localStorage.getItem(STORAGE_KEY);
  exportExcelButton.disabled = !hasData;
  exportPdfButton.disabled = !hasData;
}

function markUnsaved() {
  hasUnsavedChanges = true;
  isSaved = false;
  setStatus("当前报告尚未保存，关闭页面前请保存或导出。");
  updateActionButtons();
}

function markSaved(message = "当前报告已保存到本浏览器，刷新页面后可自动恢复。") {
  hasUnsavedChanges = false;
  isSaved = true;
  setStatus(message);
  updateActionButtons();
}

function handleBeforeUnload(event) {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = "";
}

function getCurrentMonthTransactions() {
  const month = document.getElementById("monthFilter").value;
  return month ? allTransactions.filter((item) => monthKey(item.date) === month) : allTransactions.slice();
}

function getCurrentReportSummary() {
  const transactions = getCurrentMonthTransactions();
  const expenses = transactions.filter((item) => item.type === "支出");
  const incomes = transactions.filter((item) => item.type === "收入");
  const refunds = transactions.filter((item) => item.type === "退款");
  const totalIncome = sum(incomes);
  const totalRefund = sum(refunds);
  const totalExpense = Math.max(0, sum(expenses) - totalRefund);

  return {
    month: document.getElementById("monthFilter").value || "全部月份",
    transactions,
    expenses,
    incomes,
    refunds,
    totalIncome,
    totalExpense,
    totalRefund,
    net: totalIncome - totalExpense,
    category: aggregateNet(expenses, refunds, "category"),
    platform: aggregateNet(expenses, refunds, "platform"),
    summaryText: document.getElementById("aiSummary").textContent.trim(),
  };
}

function exportTransactionsToExcel() {
  if (!window.XLSX) {
    setStatus("Excel 导出库未加载，请检查网络后刷新页面。");
    return;
  }

  const rows = getCurrentMonthTransactions().map((item) => ({
    时间: item.time,
    平台: item.platform,
    交易对象: item.merchant,
    交易类型: item.transactionType || "-",
    商品说明: item.description,
    类别: item.category,
    收支类型: item.type,
    金额: item.amount,
  }));
  if (!rows.length) return;

  const month = document.getElementById("monthFilter").value || "全部月份";
  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "账单明细");
  XLSX.writeFile(workbook, `SpendScope-账单明细-${month}.xlsx`);
  setStatus(`已导出 ${month} 账单明细 Excel。`);
}

function exportReportToPdf() {
  if (!window.html2pdf) {
    setStatus("PDF 导出库未加载，请检查网络后刷新页面。");
    return;
  }

  const report = getCurrentReportSummary();
  if (!report.transactions.length) return;

  const element = document.createElement("div");
  element.style.cssText = "width: 760px; padding: 30px; color: #1F2A24; font-family: Microsoft YaHei, sans-serif; background: #fff;";
  element.innerHTML = `
    <h1 style="margin:0 0 8px;font-size:30px;">SpendScope</h1>
    <p style="margin:0 0 22px;color:#6D766F;">月度报告：${escapeHtml(report.month)}</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;">
      ${renderPdfMetric("总收入", money.format(report.totalIncome))}
      ${renderPdfMetric("总支出", money.format(report.totalExpense))}
      ${renderPdfMetric("净收入 / 净支出", money.format(report.net))}
      ${renderPdfMetric("消费笔数", String(report.expenses.length))}
    </div>
    <h2 style="font-size:18px;margin:0 0 10px;">AI 月度总结</h2>
    <p style="white-space:pre-line;line-height:1.8;margin:0 0 22px;">${escapeHtml(report.summaryText)}</p>
    <h2 style="font-size:18px;margin:0 0 10px;">分类支出摘要</h2>
    ${renderPdfList(report.category)}
    <h2 style="font-size:18px;margin:22px 0 10px;">平台支出摘要</h2>
    ${renderPdfList(report.platform)}
  `;

  html2pdf()
    .set({
      margin: 10,
      filename: `SpendScope-月度报告-${report.month}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
  setStatus(`正在导出 ${report.month} 月度报告 PDF。`);
}

function renderPdfMetric(label, value) {
  return `
    <div style="border:1px solid #DDE3DC;border-radius:8px;padding:12px;">
      <div style="color:#6D766F;font-size:12px;">${escapeHtml(label)}</div>
      <div style="font-size:18px;font-weight:700;margin-top:6px;">${escapeHtml(value)}</div>
    </div>
  `;
}

function renderPdfList(items) {
  if (!items.length) return '<p style="color:#6D766F;">暂无数据</p>';
  return `
    <table style="width:100%;border-collapse:collapse;">
      ${items
        .slice(0, 10)
        .map(
          (item) => `
            <tr>
              <td style="border-bottom:1px solid #DDE3DC;padding:8px 0;">${escapeHtml(item.name)}</td>
              <td style="border-bottom:1px solid #DDE3DC;padding:8px 0;text-align:right;">${money.format(item.value)}</td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

document.getElementById("monthFilter").addEventListener("change", (event) => {
  renderSelectedMonth(event.target.value);
});

async function readBillFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const platform = detectPlatform(file.name);

  if (ext === "csv") {
    const text = await readTextFile(file);
    return parseCsv(text).map((row) => ({ ...row, __platformFromFile: platform }));
  }

  if (["xlsx", "xls"].includes(ext)) {
    if (!window.XLSX) throw new Error("Excel 解析库未加载，请检查网络后刷新页面。");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    return workbook.SheetNames.flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
      return rowsToObjects(matrix).map((row) => ({
        ...row,
        __platformFromFile: platform,
      }));
    });
  }

  if (ext === "pdf") {
    return readPdfFile(file).then((rows) => rows.map((row) => ({ ...row, __platformFromFile: platform })));
  }

  throw new Error(`${file.name} 不是支持的账单格式`);
}

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

async function readPdfFile(file) {
  const pdfjsLib = window.pdfjsLib || globalThis.pdfjsLib;
  if (!pdfjsLib) throw new Error("PDF 解析库未加载，请检查网络后刷新页面。");

  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  }

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const lines = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    lines.push(...textItemsToLines(content.items, pageNumber));
  }

  const text = lines.join("\n");

  const normalRows = parseAlipayPdfText(text);
  const refundRows = extractAlipayRefundRowsFromText(text);
  const alipayRows = mergeDedupAlipayRows(normalRows, refundRows);
  if (alipayRows.length) return alipayRows;

  return parsePdfLines(lines, file.name);
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

function parsePdfLines(lines, fileName) {
  const rowsFromTable = rowsToObjects(lines.map((line) => splitPdfLine(line)));
  if (rowsFromTable.length) {
    return rowsFromTable;
  }

  const platform = detectPlatform(fileName);
  const transactions = lines
    .map((line, index) => parseTransactionLine(line, lines[index + 1] || "", platform))
    .filter(Boolean);
  return transactions;
}

function parseAlipayPdfText(text) {
  const lines = mergeAlipayLines(
    text
      .split(/\r?\n/)
      .map(cleanCell)
      .filter(Boolean)
  );
  const starts = [];

  lines.forEach((line, index) => {
    if (/^(支出|收入|不计收支)/.test(line)) starts.push(index);
  });

  return starts
    .map((start, index) => {
      const end = starts[index + 1] ?? lines.length;
      return parseAlipayBlock(lines.slice(start, end));
    })
    .filter(Boolean);
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
    交易对方: merchant,
    商品说明: description,
    "收/付款方式": paymentMethod || "",
    金额: amount,
    交易时间: time,
    平台: "支付宝",
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
    if (current === "不计" && /^收支/.test(next)) {
      merged.push(`不计收支${next.replace(/^收支/, "")}`.trim());
      index += 1;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

function parseAlipayBlock(block) {
  if (!block.length) return null;

  const firstLine = block[0];
  const type = firstLine.match(/^(支出|收入|不计收支)/)?.[1];
  if (!["支出", "收入", "不计收支"].includes(type)) return null;

  const firstPayload = firstLine.replace(/^(支出|收入|不计收支)\s*/, "").trim();
  const parts = [firstPayload, ...block.slice(1)].map(cleanCell).filter(Boolean);
  const blockText = parts.join(" ").replace(/\s+/g, " ").trim();
  const transactionTime = extractAlipayTime(blockText, block);
  const amount = extractAlipayAmount(blockText, transactionTime);
  if (!transactionTime || !Number.isFinite(amount) || amount <= 0) return null;

  const merchant = extractAlipayMerchant(parts);
  const description = extractAlipayDescription(parts, merchant, transactionTime, amount);
  const paymentMethod = extractAlipayPaymentMethod(blockText);
  const row = {
    "收/支": type,
    交易对方: merchant,
    商品说明: description,
    "收/付款方式": paymentMethod,
    金额: amount,
    交易时间: transactionTime,
    平台: "支付宝",
  };

  return normalizeAlipayTransactionType(row);
}

function normalizeAlipayTransactionType(row) {
  const text = `${row.交易对方 || ""} ${row.商品说明 || ""} ${row["收/付款方式"] || ""}`;
  if (/亲情卡/.test(text)) return { ...row, "收/支": "排除", 消费类别: "排除" };

  const type = row["收/支"];
  if (type === "支出" || type === "收入") return row;

  if (/退款|退货|退回|售后退款|订单退款/.test(text)) {
    const refundRow = { ...row, "收/支": "退款", 消费类别: categorizeRefund(text) };
    return refundRow;
  }

  if (/余额宝-自动转入|银行卡定时转入|转出到银行卡|自动转入|定时转入|账户转存|充值|提现/.test(text)) {
    return { ...row, "收/支": "排除", 消费类别: "排除" };
  }

  if (/余额宝-收益发放|收益发放|收益/.test(text)) {
    return { ...row, "收/支": "收入", 消费类别: "理财" };
  }

  if (/运费补偿|小额打款|补偿/.test(text)) {
    return { ...row, "收/支": "收入", 消费类别: "兼职" };
  }

  return { ...row, "收/支": "排除", 消费类别: "排除" };
}

function extractAlipayTime(blockText, block) {
  const date = blockText.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/)?.[0];
  const time = blockText.match(/\b\d{1,2}:\d{2}(?::\d{2})?\b/)?.[0];
  if (date && time) return `${normalizeDateText(date)} ${normalizeTimeText(time)}`;

  for (let index = 0; index < block.length - 1; index += 1) {
    const dateLine = block[index].match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/)?.[0];
    const timeLine = block[index + 1].match(/^\d{1,2}:\d{2}(?::\d{2})?$/)?.[0];
    if (dateLine && timeLine) return `${normalizeDateText(dateLine)} ${normalizeTimeText(timeLine)}`;
  }

  return "";
}

function extractAlipayAmount(blockText, transactionTime) {
  const searchText = transactionTime ? blockText.replace(transactionTime, " ") : blockText;
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

function normalizeDateText(date) {
  const [year, month, day] = date.replace(/\//g, "-").split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizeTimeText(time) {
  const parts = time.split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${(parts[2] || "00").padStart(2, "0")}`;
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

function normalizeRow(row) {
  const fields = mapFields(row);
  const amount = parseAmount(fields.amount, row);
  const date = parseDate(fields.time);
  const type = normalizeTransactionType(row, fields.type, amount);
  const absAmount = Math.abs(amount);
  const merchant = fields.merchant || fields.description || "未知交易对象";
  const description = fields.description || merchant;
  const transactionType = fields.transactionType || "-";
  const platformFromFile = row.__platformFromFile && row.__platformFromFile !== "未知来源" ? row.__platformFromFile : "";
  const platform = platformFromFile || fields.platform || detectPlatform(`${merchant} ${description}`);

  if (type === "中性" || !date || !Number.isFinite(absAmount) || absAmount === 0) {
    return null;
  }

  const explicitCategory = cleanCell(row["消费类别"] || row["类别"] || "");
  const categoryParts = { description, merchant, transactionType };

  const result = {
    date,
    time: formatDateTime(date),
    platform,
    merchant,
    description,
    transactionType,
    type,
    amount: absAmount,
    category: normalizeCategoryForType(type, explicitCategory, categoryParts),
  };

  return result;
}

function normalizeTransactionType(row, typeText, amount) {
  const status = cleanCell(row["当前状态"] || row["交易状态"] || row["状态"] || "");
  const explicitType = cleanCell(row["收/支"] || row["收支"] || row["收入/支出"] || "");

  if (status === "支付成功") return "支出";
  if (status === "已存入零钱") return "收入";
  if (explicitType) {
    const detected = detectType(explicitType, amount, { "收/支": explicitType });
    return detected === "中性" ? "排除" : detected;
  }

  const detected = detectType(typeText, amount, row);
  return detected === "中性" ? "排除" : detected;
}

function mapFields(row) {
  return Object.fromEntries(
    Object.entries(FIELD_ALIASES).map(([key, aliases]) => {
      const header = Object.keys(row).find((name) => aliases.some((alias) => sameHeader(name, alias)));
      return [key, header ? cleanCell(row[header]) : ""];
    })
  );
}

function sameHeader(name, alias) {
  return String(name).trim().toLowerCase().replace(/\s/g, "") === alias.toLowerCase().replace(/\s/g, "");
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

function detectType(typeText, amount, row) {
  const text = `${typeText} ${Object.values(row).join(" ")}`;
  if (/排除/.test(typeText)) return "排除";
  if (/退款/.test(typeText)) return "退款";
  if (/中性|不计收支|^\/$/.test(typeText)) return "中性";
  if (/支出|付款|借|消费|-/.test(typeText)) return "支出";
  if (/收入|收款|贷|入账|\+/.test(typeText)) return "收入";
  if (amount < 0) return "支出";
  if (/支出|付款|借|消费|-/.test(text)) return "支出";
  if (/收入|收款|贷|入账|\+/.test(text)) return "收入";
  return amount < 0 ? "支出" : "收入";
}

function detectPlatform(text) {
  const value = String(text).toLowerCase();
  if (/微信|wechat/.test(value)) return "微信";
  if (/支付宝|alipay/.test(value)) return "支付宝";
  if (/银行|银行卡|信用卡|储蓄卡|bank|cmb|icbc|ccb|abc|boc/.test(value)) return "银行";
  return "未知来源";
}

function categorize(input) {
  const parts = normalizeCategoryInput(input);
  if (/群收款/.test(parts.transactionType)) return "群收款";
  if (/红包|转账/.test(parts.transactionType) && !hasMeaningfulMemo(parts.description)) return "其他";

  const matched =
    matchExpenseCategory(parts.description) ||
    matchExpenseCategory(parts.merchant) ||
    matchExpenseCategory(parts.transactionType);
  return matched ? matched[0] : "其他";
}

function categorizeRefund(text) {
  return "退款/抵扣";
}

function inferCategory(type, input) {
  const parts = normalizeCategoryInput(input);
  const fullText = `${parts.description} ${parts.merchant} ${parts.transactionType}`;
  if (type === "退款") return categorizeRefund(fullText);
  if (type === "排除") return "排除";
  if (/群收款/.test(parts.transactionType)) return "群收款";
  if (type === "支出") return categorize(parts);
  if (type === "收入") return categorizeIncome(fullText);
  return "其他";
}

function matchExpenseCategory(text) {
  const value = String(text || "");
  if (!value) return null;
  return EXPENSE_CATEGORY_KEYWORDS.find(([, keywords]) => keywords.some((keyword) => value.includes(keyword))) || null;
}

function normalizeCategoryInput(input) {
  if (typeof input === "object" && input !== null) {
    return {
      description: String(input.description || ""),
      merchant: String(input.merchant || ""),
      transactionType: String(input.transactionType || ""),
    };
  }

  return {
    description: String(input || ""),
    merchant: "",
    transactionType: "",
  };
}

function hasMeaningfulMemo(description) {
  const text = String(description || "").trim();
  return Boolean(text && !["/", "-", "'-", "无", "转账", "红包"].includes(text));
}

function categorizeIncome(text) {
  const value = String(text);
  const matched = INCOME_CATEGORY_KEYWORDS.find(([, keywords]) => keywords.some((keyword) => value.includes(keyword)));
  return matched ? matched[0] : "其他";
}

function getCategoryOptions(type) {
  if (type === "支出") return getAllExpenseCategories();
  if (type === "收入") return getAllIncomeCategories();
  if (type === "退款") return REFUND_CATEGORIES;
  if (type === "排除") return EXCLUDED_CATEGORIES;
  return getAllExpenseCategories();
}

function getAllExpenseCategories() {
  return mergeUnique(EXPENSE_CATEGORIES, customCategories.expense);
}

function getAllIncomeCategories() {
  return mergeUnique(INCOME_CATEGORIES, customCategories.income);
}

function mergeUnique(base, extra = []) {
  return Array.from(new Set([...base, ...extra].filter(Boolean)));
}

function normalizeCategoryForType(type, category, input = "") {
  const options = getCategoryOptions(type);
  if (options.includes(category)) return category;
  return inferCategory(type, input);
}

function renderDashboard(transactions) {
  const expenses = transactions.filter((item) => item.type === "支出");
  const incomes = transactions.filter((item) => item.type === "收入");
  const refunds = transactions.filter((item) => item.type === "退款");
  const totalIncome = sum(incomes);
  const totalRefund = sum(refunds);
  const totalExpense = Math.max(0, sum(expenses) - totalRefund);
  const net = totalIncome - totalExpense;

  document.getElementById("totalIncome").textContent = money.format(totalIncome);
  document.getElementById("totalExpense").textContent = money.format(totalExpense);
  document.getElementById("netAmount").textContent = money.format(net);
  document.getElementById("expenseCount").textContent = expenses.length;

  renderChart("categoryChart", "pie", aggregateNet(expenses, refunds, "category"), "分类支出");
  renderChart("platformChart", "bar", aggregateNet(expenses, refunds, "platform"), "平台支出");
  renderDailyChart(expenses, refunds);
  document.getElementById("aiSummary").textContent = "正在整理你的月度消费洞察…";
  renderSummary({ transactions, expenses, incomes, refunds, totalIncome, totalExpense, totalRefund, net });
  currentTableTransactions = sortTransactionsForTable(transactions);
  updateFilterOptions();
  applyTableFilters();
}

function sortTransactionsForTable(transactions) {
  return transactions.slice().sort((a, b) => {
    if (a.type === "退款" && b.type !== "退款") return -1;
    if (a.type !== "退款" && b.type === "退款") return 1;
    return b.date - a.date;
  });
}

function populateMonthFilter(transactions) {
  const monthFilter = document.getElementById("monthFilter");
  const months = Array.from(new Set(transactions.map((item) => monthKey(item.date)))).sort().reverse();

  monthFilter.innerHTML = months.map((month) => `<option value="${month}">${month}</option>`).join("");
  monthFilter.disabled = months.length === 0;
}

function renderSelectedMonth(month) {
  const scoped = month ? allTransactions.filter((item) => monthKey(item.date) === month) : allTransactions;
  setStatus(`已成功整理 ${allTransactions.length} 笔交易，当前分析 ${month || "全部月份"} 的 ${scoped.length} 笔。`);
  renderDashboard(scoped);
}

function renderChart(id, type, data, label) {
  const ctx = document.getElementById(id);
  if (!window.Chart) {
    drawCanvasMessage(ctx, "图表库未加载，统计数据已在卡片和明细中展示");
    return;
  }
  if (charts[id]) charts[id].destroy();

  charts[id] = new Chart(ctx, {
    type,
    data: {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label,
          data: data.map((item) => item.value),
          backgroundColor: ["#7F9B82", "#A8B99E", "#E8BFA8", "#CDA58D", "#B8AA8D", "#D8C7A8", "#9CA88F", "#E3D8C8"],
          borderWidth: type === "pie" ? 2 : 0,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: type === "pie" ? "bottom" : "top" } },
      scales: type === "bar" ? { y: { beginAtZero: true } } : {},
    },
  });
}

function renderDailyChart(expenses, refunds = []) {
  const data = aggregateNetByDay(expenses, refunds);
  const id = "dailyChart";
  if (!window.Chart) {
    drawCanvasMessage(document.getElementById(id), "图表库未加载，趋势图暂不可用");
    return;
  }
  if (charts[id]) charts[id].destroy();

  charts[id] = new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "每日支出",
          data: data.map((item) => item.value),
          borderColor: "#7F9B82",
          backgroundColor: "rgba(232, 191, 168, 0.18)",
          fill: true,
          tension: 0.32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

function drawCanvasMessage(canvas, message) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(rect.width, 320) * ratio;
  canvas.height = 260 * ratio;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6D766F";
  context.font = "14px Microsoft YaHei, sans-serif";
  context.textAlign = "center";
  context.fillText(message, canvas.width / ratio / 2, 130);
}

function renderSummary(stats) {
  const category = aggregateNet(stats.expenses, stats.refunds, "category");
  const platform = aggregateNet(stats.expenses, stats.refunds, "platform");
  const merchants = aggregate(stats.expenses, "merchant");
  const largeItems = stats.expenses.slice().sort((a, b) => b.amount - a.amount).slice(0, 3);
  const topCategory = category[0];
  const topPlatform = platform[0];
  const topMerchant = merchants[0];
  const netText = stats.net >= 0 ? `结余 ${money.format(stats.net)}` : `净支出 ${money.format(Math.abs(stats.net))}`;

  const lines = [
    `本月共识别 ${stats.transactions.length} 笔交易，其中支出 ${stats.expenses.length} 笔、收入 ${stats.incomes.length} 笔、退款 ${stats.refunds.length} 笔。总收入为 ${money.format(stats.totalIncome)}，抵扣后总支出为 ${money.format(stats.totalExpense)}，整体为${netText}。`,
    stats.refunds.length ? `本月存在部分退款记录，已在真实支出中抵扣，合计抵扣 ${money.format(stats.totalRefund)}。` : "",
    topCategory ? `主要支出集中在「${topCategory.name}」，金额约 ${money.format(topCategory.value)}，占本月支出的 ${percent(topCategory.value, stats.totalExpense)}。` : "目前还没有可用于分类统计的支出数据。",
    topPlatform ? `从支付平台看，「${topPlatform.name}」支出最多，约 ${money.format(topPlatform.value)}；高频交易对象是「${topMerchant?.name || "暂无"}」。` : "平台支出还不明显，上传更多账单后会更完整。",
    largeItems.length ? `值得留意的大额消费包括：${largeItems.map((item) => `${item.merchant} ${money.format(item.amount)}`).join("、")}。` : "",
    "下月可以优先关注占比最高的类别和大额消费，给固定开销留出预算，再为弹性消费设置一个舒服的上限。这里的建议只用于日常消费管理，不涉及投资理财判断。",
  ].filter(Boolean);

  document.getElementById("aiSummary").textContent = lines.join("\n\n");
}

function renderTable(rows, total, filteredCount = rows.length) {
  const tbody = document.getElementById("transactionTable");
  const hint = document.getElementById("tableHint");
  hint.textContent = total ? `共 ${total} 条，当前筛选显示 ${filteredCount} 条。` : "展示前 100 条整理后的交易";

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row">${total ? "没有符合条件的明细" : "还没有账单数据，上传账单后将在这里显示整理后的明细。"}</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (item) => `
        <tr data-id="${escapeHtml(item.id)}">
          <td data-label="时间">${escapeHtml(item.time)}</td>
          <td data-label="平台">${escapeHtml(item.platform)}</td>
          <td data-label="交易对象">${escapeHtml(item.merchant)}</td>
          <td data-label="交易类型">${escapeHtml(item.transactionType || "-")}</td>
          <td data-label="类别">${renderCategorySelect(item)}</td>
          <td data-label="收支类型">${renderTypeSelect(item)}</td>
          <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
        </tr>
      `
    )
    .join("");
}

function updateFilterOptions() {
  tableFilterOptions = {
    platform: uniqueSorted(["微信", "支付宝", "银行", "未知来源"]),
    type: uniqueSorted(TYPE_OPTIONS),
    category: uniqueSorted(getAllCategoriesForFilter()),
    merchant: uniqueSorted(currentTableTransactions.map((item) => item.merchant)),
    transactionType: uniqueSorted(currentTableTransactions.map((item) => item.transactionType || "-")),
  };

  Object.keys(tableFilters).forEach((key) => {
    if (tableFilters[key] && !tableFilterOptions[key].includes(tableFilters[key])) {
      tableFilters[key] = "";
    }
  });
  updateHeaderFilterButtons();
}

function openHeaderFilter(button) {
  if (!headerFilterMenu.classList.contains("hidden") && activeHeaderFilter === button.dataset.filter) {
    headerFilterMenu.classList.add("hidden");
    return;
  }

  activeHeaderFilter = button.dataset.filter;
  const labels = {
    platform: "全部平台",
    type: "全部类型",
    category: "全部类别",
    merchant: "全部交易对象",
    transactionType: "全部交易类型",
  };
  const options = tableFilterOptions[activeHeaderFilter] || [];
  const selectedValue = tableFilters[activeHeaderFilter] || "";
  headerFilterOptions.innerHTML = [{ label: labels[activeHeaderFilter], value: "" }]
    .concat(options.map((option) => ({ label: option, value: option })))
    .map((option) =>
      `<button class="header-filter-option ${option.value === selectedValue ? "is-selected" : ""}" type="button" data-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>`
    )
    .join("");

  const rect = button.getBoundingClientRect();
  headerFilterMenu.style.left = `${Math.min(rect.left, window.innerWidth - 240)}px`;
  headerFilterMenu.style.top = `${rect.bottom + 6}px`;
  headerFilterMenu.classList.remove("hidden");
}

function handleHeaderFilterOptionClick(event) {
  const option = event.target.closest(".header-filter-option");
  if (!option) return;
  if (!activeHeaderFilter) return;
  tableFilters[activeHeaderFilter] = option.dataset.value || "";
  updateHeaderFilterButtons();
  applyTableFilters();
  headerFilterMenu.classList.add("hidden");
}

function closeHeaderFilterOnOutsideClick(event) {
  if (headerFilterMenu.classList.contains("hidden")) return;
  if (headerFilterMenu.contains(event.target) || event.target.closest(".th-filter")) return;
  headerFilterMenu.classList.add("hidden");
}

function updateHeaderFilterButtons() {
  headerFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", Boolean(tableFilters[button.dataset.filter]));
  });
}

function getAllCategoriesForFilter() {
  return mergeUnique(getAllExpenseCategories(), getAllIncomeCategories()).concat(REFUND_CATEGORIES, EXCLUDED_CATEGORIES);
}

function uniqueSorted(values) {
  return Array.from(new Set(values.map((value) => cleanCell(value || "-")))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function getFilteredTransactions() {
  const keyword = tableSearch.value.trim().toLowerCase();
  return currentTableTransactions.filter((item) => {
    const fields = [
      item.time,
      item.platform,
      item.merchant,
      item.transactionType || "-",
      item.description,
      item.category,
      item.type,
      String(item.amount),
      money.format(item.amount),
    ];
    const matchesSearch = !keyword || fields.some((value) => String(value || "").toLowerCase().includes(keyword));
    const matchesPlatform = !tableFilters.platform || item.platform === tableFilters.platform;
    const matchesType = !tableFilters.type || item.type === tableFilters.type;
    const matchesCategory = !tableFilters.category || item.category === tableFilters.category;
    const matchesMerchant = !tableFilters.merchant || item.merchant === tableFilters.merchant;
    const matchesTransactionType = !tableFilters.transactionType || (item.transactionType || "-") === tableFilters.transactionType;

    return matchesSearch && matchesPlatform && matchesType && matchesCategory && matchesMerchant && matchesTransactionType;
  });
}

function applyTableFilters() {
  const filtered = getFilteredTransactions();
  renderTable(filtered.slice(0, 100), currentTableTransactions.length, filtered.length);
}

function handleSearchInput() {
  applyTableFilters();
}

function resetTableFilters() {
  tableSearch.value = "";
  Object.keys(tableFilters).forEach((key) => {
    tableFilters[key] = "";
  });
  updateHeaderFilterButtons();
  applyTableFilters();
}

function openCategoryModal() {
  categoryMessage.textContent = "";
  customCategoryName.value = "";
  categoryModal.classList.remove("hidden");
  customCategoryName.focus();
}

function closeCategoryModal() {
  categoryModal.classList.add("hidden");
  categoryMessage.textContent = "";
  customCategoryName.value = "";
}

function addCustomCategory() {
  const name = cleanCell(customCategoryName.value);
  const type = customCategoryType.value;
  const target = type === "income" ? "income" : "expense";
  const existing = target === "income" ? getAllIncomeCategories() : getAllExpenseCategories();

  if (!name) {
    categoryMessage.textContent = "分类名称不能为空。";
    return;
  }
  if (name === "人情往来") {
    categoryMessage.textContent = "不能添加“人情往来”这个类别。";
    return;
  }
  if (existing.includes(name)) {
    categoryMessage.textContent = "这个分类已经存在。";
    return;
  }

  customCategories[target].push(name);
  saveCustomCategories();
  categoryMessage.textContent = `已添加分类：${name}`;
  customCategoryName.value = "";
  updateFilterOptions();
  applyTableFilters();
}

function renderTypeSelect(item) {
  return `
    <select class="table-select type-select type-${getAmountClass(item.type)}" data-field="type">
      ${TYPE_OPTIONS.map((type) => `<option value="${escapeHtml(type)}" ${item.type === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}
    </select>
  `;
}

function renderCategorySelect(item) {
  const category = normalizeCategoryForType(item.type, item.category, {
    description: item.description,
    merchant: item.merchant,
    transactionType: item.transactionType,
  });
  return `
    <select class="table-select category-select category-${getCategoryTone(category)}" data-field="category">
      ${getCategoryOptions(item.type).map((option) => `<option value="${escapeHtml(option)}" ${category === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  `;
}

function handleTransactionEdit(event) {
  const field = event.target.dataset.field;
  if (!field) return;

  const id = event.target.closest("tr")?.dataset.id;
  const transaction = allTransactions.find((item) => item.id === id);
  if (!transaction) return;

  if (field === "type") {
    transaction.type = event.target.value;
    transaction.category = normalizeCategoryForType(transaction.type, transaction.category, {
      description: transaction.description,
      merchant: transaction.merchant,
      transactionType: transaction.transactionType,
    });
  } else if (field === "category") {
    transaction.category = event.target.value;
  }

  renderSelectedMonth(document.getElementById("monthFilter").value);
  markUnsaved();
}

function getAmountClass(type) {
  if (type === TYPE_OPTIONS[0]) return "expense";
  if (type === TYPE_OPTIONS[1]) return "income";
  if (type === TYPE_OPTIONS[2]) return "refund";
  if (type === TYPE_OPTIONS[3]) return "excluded";
  return "neutral";
}

function formatDisplayAmount(item) {
  const amountText = money.format(item.amount);
  if (item.type === TYPE_OPTIONS[0]) return `-${amountText}`;
  if (item.type === TYPE_OPTIONS[1]) return `+${amountText}`;
  if (item.type === TYPE_OPTIONS[2]) return `退款 ${amountText}`;
  if (item.type === TYPE_OPTIONS[3]) return amountText;
  return amountText;
}

function getCategoryTone(category) {
  const tones = ["sage", "peach", "beige", "olive"];
  let total = 0;
  String(category || "").split("").forEach((char) => {
    total += char.charCodeAt(0);
  });
  return tones[total % tones.length];
}

function aggregate(items, key) {
  const map = new Map();
  items.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + item.amount));
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function aggregateNet(expenses, refunds, key) {
  const map = new Map();
  expenses.forEach((item) => map.set(item[key], (map.get(item[key]) || 0) + item.amount));
  refunds.forEach((item) => {
    const refundKey = key === "category" ? categorize({ description: item.description, merchant: item.merchant, transactionType: item.transactionType }) : item[key];
    map.set(refundKey, (map.get(refundKey) || 0) - item.amount);
  });

  return Array.from(map, ([name, value]) => ({ name, value: Math.max(0, value) }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function aggregateByDay(items) {
  const map = new Map();
  items.forEach((item) => {
    const name = item.date.toISOString().slice(0, 10);
    map.set(name, (map.get(name) || 0) + item.amount);
  });
  return Array.from(map, ([name, value]) => ({ name, value })).sort((a, b) => a.name.localeCompare(b.name));
}

function aggregateNetByDay(expenses, refunds) {
  const map = new Map();
  expenses.forEach((item) => {
    const name = item.date.toISOString().slice(0, 10);
    map.set(name, (map.get(name) || 0) + item.amount);
  });
  refunds.forEach((item) => {
    const name = item.date.toISOString().slice(0, 10);
    map.set(name, (map.get(name) || 0) - item.amount);
  });

  return Array.from(map, ([name, value]) => ({ name, value: Math.max(0, value) })).sort((a, b) => a.name.localeCompare(b.name));
}

function sum(items) {
  return items.reduce((total, item) => total + item.amount, 0);
}

function percent(value, total) {
  return total ? `${Math.round((value / total) * 100)}%` : "0%";
}

function cleanCell(value) {
  return String(value ?? "").trim().replace(/^"|"$/g, "");
}

function formatDateTime(date) {
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function monthKey(date) {
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function setStatus(message) {
  document.getElementById("statusBar").firstElementChild.textContent = message;
}

function setLoading(isLoading) {
  if (!loadingOverlay) return;
  loadingOverlay.classList.toggle("hidden", !isLoading);
  uploadPanel.classList.toggle("is-loading", isLoading);
  billUploader.disabled = isLoading;
}
