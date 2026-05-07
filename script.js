const TYPE_OPTIONS = ["支出", "收入", "退款", "排除"];
const EXPENSE_CATEGORIES = ["交通", "学习", "正餐", "奶茶咖啡", "零食水果", "聚餐", "运动", "购物", "娱乐", "手工爱好", "宠物", "旅行", "日常开销", "化妆护肤", "群收款", "其他"];
const INCOME_CATEGORIES = ["生活费", "兼职", "工资", "群收款", "理财", "收益", "礼金", "其他"];
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
  ["收益", ["余额宝-收益发放", "余额宝收益", "收益发放"]],
  ["理财", ["余额宝收益", "收益发放", "理财", "基金收益", "利息"]],
  ["礼金", ["礼物", "礼金", "份子钱", "祝福"]],
];

const EXPENSE_INDUSTRY_KEYWORDS = [
  ["正餐", ["菜馆", "餐馆", "饭馆", "饭店", "餐厅", "小厨", "家常菜", "私房菜", "土菜馆", "农家菜", "面馆", "粉店", "米线", "粥铺", "粥店", "饺子馆", "馄饨店", "包子铺", "烧烤店", "烤肉店", "火锅店", "麻辣烫", "冒菜", "砂锅", "煲仔饭", "快餐", "便当", "食堂", "小吃店", "拉面", "盖饭", "炒饭", "黄焖鸡", "猪脚饭", "沙县", "兰州拉面", "川菜", "湘菜", "粤菜", "东北菜"]],
  ["正餐", ["水饺", "手工水饺", "煎饼", "烧饼", "鸡饭", "海南鸡饭", "猪脚饭", "外卖订单", "小馆", "街头小馆", "包子", "泰国菜", "泰餐", "小面故事", "小面故事松江大学城店", "快乐食间", "食间", "食堂", "小面", "面馆", "快餐", "餐厅", "饭店", "牛肉馆", "潮汕牛肉馆", "茶餐厅"]],
  ["奶茶咖啡", ["奶茶店", "咖啡店", "茶饮", "饮品店", "甜品饮品", "果茶", "柠檬茶", "拿铁", "咖啡", "奶茶", "瑞幸", "星巴克", "库迪", "茶百道", "古茗", "喜茶", "奈雪", "蜜雪冰城", "霸王茶姬", "沪上阿姨", "茉莉奶白", "果汁吧", "果汁", "鲜榨"]],
  ["零食水果", ["水果店", "鲜果店", "果切", "零食店", "甜品店", "蛋糕店", "面包店", "烘焙", "糕点", "坚果", "饼干", "便利蜂", "零食很忙", "良品铺子", "三只松鼠", "果酱", "米花", "软糖", "爆浆软糖"]],
  ["日常开销", ["便利店", "超市", "生鲜", "菜场", "农贸市场", "生活超市", "百货店", "药店", "药房", "洗衣店", "维修店", "五金店", "文具店", "快递", "菜鸟", "丰巢", "话费", "电费", "水费", "燃气费", "物业费", "生活用品", "日用品", "纸巾", "卫生巾", "LAWSON", "lawson", "罗森", "罗森便利店", "全家", "FamilyMart", "711", "7-11", "便利蜂", "盒马", "盒马鲜生", "盒马生鲜", "盒马超市", "永辉", "沃尔玛", "山姆"]],
  ["交通", ["地铁", "公交", "出租车", "网约车", "打车", "滴滴", "高德", "T3出行", "曹操出行", "铁路", "12306", "火车票", "车票", "机票", "机场", "高铁", "停车", "停车场", "加油站", "充电站", "ETC", "高速费", "上海公共交通", "公共交通", "交通卡", "轨道交通", "上海地铁", "上海公交", "乘车码", "公交乘车码", "地铁乘车码", "Metro", "大都会", "随申行", "交通出行"]],
  ["购物", ["淘宝", "天猫", "京东", "拼多多", "抖音电商", "快手小店", "小红书", "得物", "唯品会", "商场", "购物中心", "服饰", "服装店", "女装", "男装", "鞋店", "包包", "数码", "百货", "名创优品", "优衣库"]],
  ["学习", ["书店", "图书", "教材", "课程", "网课", "培训", "考试", "报名费", "资料", "打印", "复印", "文具", "学校", "学费", "教育", "知网", "论文", "文献"]],
  ["运动", ["健身房", "健身", "球馆", "羽毛球馆", "篮球馆", "网球馆", "游泳馆", "瑜伽馆", "运动场馆", "Keep", "跑步", "体育"]],
  ["宠物", ["宠物店", "宠物医院", "猫粮", "狗粮", "猫砂", "猫条", "猫罐头", "狗罐头", "宠物用品", "兽医", "猫咪", "狗狗", "顽皮", "Wanpy"]],
  ["化妆护肤", ["美妆店", "化妆品", "护肤品", "口红", "面膜", "洗面奶", "卸妆", "防晒", "精华", "乳液", "爽肤水", "香水", "粉底", "眉笔", "眼影"]],
  ["手工爱好", ["手工店", "手作", "DIY", "材料包", "文创", "盲盒", "手办", "模型", "拼图", "陶艺", "画室", "颜料", "画笔", "滴胶", "毛线", "布料", "串珠"]],
  ["旅行", ["酒店", "民宿", "住宿", "客栈", "携程", "飞猪", "去哪儿", "景区", "门票", "旅游", "旅行", "机票", "高铁票"]],
];

EXPENSE_INDUSTRY_KEYWORDS.forEach(([category, keywords]) => {
  const target = EXPENSE_CATEGORY_KEYWORDS.find(([name]) => name === category);
  if (target) target[1].push(...keywords.filter((keyword) => !target[1].includes(keyword)));
});

const GENERIC_MERCHANT_PATTERNS = /淘宝平台商户|淘宝商户|微信支付|支付宝|财付通|抖音支付|京东支付|美团支付|云闪付|银联|Apple Pay|商户消费|扫码支付|二维码付款/i;
const DINING_CONTEXT_PATTERN = /水饺|饺子|煎饼|烧饼|猪脚饭|鸡饭|外卖订单|快餐|小馆|牛肉馆|潮汕牛肉馆|茶餐厅|菜馆|饭店|餐厅|饭|面馆|粉店|粥铺|包子|馄饨|米线|麻辣烫|黄焖鸡|盖饭|炒饭|拉面|烧烤|火锅|烤肉|便当|小吃/;
const INSUFFICIENT_CONTEXT_PATTERN = /美团月付|美团月付还款|月付还款|拼多多先用后付|先用后付|微信转账|支付宝转账|转账|收付款|还款/;
const ALIPAY_TRANSFER_EXCLUDE_PATTERN = /余额宝-自动转入|余额宝自动转入|银行卡定时转入|转出到银行卡|自动转入|定时转入|账户转存|账户转移|基金转入|基金转出|提现|充值到余额|余额充值/;
const SHIPPING_COMPENSATION_PATTERN = /运费补偿|运费补贴|运费险|退运费|运费赔付|小额打款-?运费补偿/;
const PDFJS_WORKER_SRC = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const ALIPAY_BACKEND_PARSE_URL = "http://127.0.0.1:8000/api/parse/alipay";

const FIELD_ALIASES = {
  time: ["交易时间", "支付时间", "创建时间", "记账日期", "交易日期", "时间", "日期", "date", "time"],
  merchant: ["交易对方", "商户", "商家", "对方户名", "收/付款方", "交易对象", "对方", "merchant", "counterparty"],
  description: ["商品", "商品说明", "交易说明", "备注", "摘要", "交易摘要", "说明", "description", "memo"],
  type: ["收/支", "收支", "交易类型", "类型", "收入/支出", "借贷标志", "type"],
  amount: ["金额", "交易金额", "金额(元)", "交易金额(元)", "人民币金额", "支出", "收入", "amount"],
  platform: ["收/付款方式", "支付方式", "付款方式", "收款方式", "平台", "platform"],
  transactionType: ["交易类型", "业务类型", "账务类型", "transaction type"],
};

const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });
const charts = {};
const STORAGE_KEY = "spendscope.transactions.v1";
const CUSTOM_CATEGORY_KEY = "spendscope_custom_categories";
const BUDGET_STORAGE_KEY = "spendscope.monthlyBudgets.v1";
const MONTHLY_BILLS_KEY = "spendscope.monthlyBills.v1";
const ACTIVE_PAGE_KEY = "spendscope.activePage.v1";
const LOGIN_STATE_KEY = "spendscope.loginState.v1";
const TABLE_PAGE_KEY = "spendscope.tablePage.v1";
const VALID_PAGES = ["overview", "details", "trends"];
const PAGE_SIZE = 20;
let allTransactions = [];
let isSaved = false;
let hasUnsavedChanges = false;
let customCategories = { expense: [], income: [] };
let monthlyBudgets = {};
let monthlyBills = {};
let currentTableTransactions = [];
let currentTablePage = 1;
let isRestoringTablePage = true;

const billUploader = document.getElementById("billUploader");
const monthlyBillsUploader = document.getElementById("monthlyBillsUploader");
const uploadPanel = document.querySelector(".upload-panel");
const chooseBillFileButton = document.getElementById("chooseBillFile");
const chooseMonthlyBillFileButton = document.getElementById("chooseMonthlyBillFile");
const saveToMonthlyBillsButton = document.getElementById("saveToMonthlyBills");
const monthlyBillsList = document.getElementById("monthlyBillsList");
const uploadConfirm = document.getElementById("uploadConfirm");
const saveLocalButton = document.getElementById("saveLocal");
const clearStorageButton = document.getElementById("clearStorage");
const exportExcelButton = document.getElementById("exportExcel");
const exportPdfButton = document.getElementById("exportPdf");
const transactionTable = document.getElementById("transactionTable");
const tableSearch = document.getElementById("tableSearch");
const tablePagination = document.getElementById("tablePagination");
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
const monthlyBudgetInput = document.getElementById("monthlyBudgetInput");
const saveBudgetButton = document.getElementById("saveBudget");
const clearBudgetButton = document.getElementById("clearBudget");
const budgetMonthLabel = document.getElementById("budgetMonthLabel");
const budgetAmount = document.getElementById("budgetAmount");
const budgetUsed = document.getElementById("budgetUsed");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgress = document.getElementById("budgetProgress");
const budgetStatus = document.getElementById("budgetStatus");
const pageTabs = Array.from(document.querySelectorAll(".page-tab"));
const overviewPage = document.getElementById("overviewPage");
const detailsPage = document.getElementById("detailsPage");
const trendsPage = document.getElementById("trendsPage");
const comparePage = document.getElementById("comparePage");
const compareStatus = document.getElementById("compareStatus");
const currentMonthExpense = document.getElementById("currentMonthExpense");
const previousMonthExpense = document.getElementById("previousMonthExpense");
const monthExpenseDelta = document.getElementById("monthExpenseDelta");
const monthExpenseRate = document.getElementById("monthExpenseRate");
const increaseCategoryList = document.getElementById("increaseCategoryList");
const decreaseCategoryList = document.getElementById("decreaseCategoryList");
const compareSummary = document.getElementById("compareSummary");
let pendingFiles = [];
let activePage = "overview";
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

const appShell = document.querySelector(".app-shell");
const loginPage = document.getElementById("loginPage");
const loginAccountInput = document.getElementById("loginAccount");
const loginPasswordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const guestLoginButton = document.getElementById("guestLoginButton");
const logoutButton = document.getElementById("logoutButton");
const loginMessage = document.getElementById("loginMessage");
const loginTabs = Array.from(document.querySelectorAll(".login-tab"));

document.addEventListener("DOMContentLoaded", () => {
  try {
    const loginState = getLoginState();
    currentTablePage = loadSavedTablePage();
    loadMonthlyBudgets();
    loadMonthlyBills();
    loadCustomCategories();
    restoreDashboardFromStorage();
    updateFilterOptions();
    renderBudgetPanel();
    renderMonthlyBills();
    const savedPage = localStorage.getItem(ACTIVE_PAGE_KEY);
    switchPage(VALID_PAGES.includes(savedPage) ? savedPage : "overview");
    renderAuthState(Boolean(loginState?.loggedIn));
  } finally {
    isRestoringTablePage = false;
    document.body.classList.remove("app-initializing");
  }
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
tablePagination?.addEventListener("click", handleTablePaginationClick);
headerFilterButtons.forEach((button) => {
  button.addEventListener("click", (event) => openHeaderFilter(event.currentTarget));
});
headerFilterOptions.addEventListener("click", handleHeaderFilterOptionClick);
document.addEventListener("click", closeHeaderFilterOnOutsideClick);
manageCategoriesButton.addEventListener("click", openCategoryModal);
closeCategoryModalButton.addEventListener("click", closeCategoryModal);
cancelCategoryModalButton.addEventListener("click", closeCategoryModal);
addCategoryButton.addEventListener("click", addCustomCategory);
saveBudgetButton?.addEventListener("click", saveCurrentMonthBudget);
clearBudgetButton?.addEventListener("click", clearCurrentMonthBudget);
monthlyBudgetInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveCurrentMonthBudget();
});
pageTabs.forEach((tab) => {
  tab.addEventListener("click", () => switchPage(tab.dataset.page));
});
loginTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    loginTabs.forEach((item) => item.classList.toggle("active", item === tab));
  });
});
loginButton?.addEventListener("click", handleLocalLogin);
guestLoginButton?.addEventListener("click", handleGuestLogin);
logoutButton?.addEventListener("click", handleLogout);
loginAccountInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleLocalLogin();
});
loginPasswordInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleLocalLogin();
});
updateActionButtons();

billUploader.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  if (files.length > 0) {
    handleSelectedFiles(files);
  }
});

monthlyBillsUploader?.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  setLoading(true);
  try {
    await processFiles(files);
  } finally {
    setLoading(false);
    monthlyBillsUploader.value = "";
  }
});

chooseBillFileButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  billUploader.click();
});

chooseMonthlyBillFileButton?.addEventListener("click", () => {
  monthlyBillsUploader?.click();
});

saveToMonthlyBillsButton?.addEventListener("click", saveCurrentReportToMonthlyBills);
monthlyBillsList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-month-action]");
  if (!button) return;
  const month = button.dataset.month;
  if (!month) return;
  if (button.dataset.monthAction === "load") {
    loadMonthlyBill(month, button.dataset.platform);
  } else if (button.dataset.monthAction === "merge") {
    loadMergedMonthlyBill(month);
  } else if (button.dataset.monthAction === "delete") {
    deleteMonthlyBill(month, button.dataset.platform);
  }
});

uploadConfirm?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-upload-action]");
  if (!button) return;
  if (button.dataset.uploadAction === "confirm") {
    confirmUploadFiles();
  } else if (button.dataset.uploadAction === "cancel") {
    cancelUploadFiles();
  }
});

uploadPanel.addEventListener("click", (event) => {
  if (event.target === billUploader || event.target === chooseBillFileButton) return;
  billUploader.click();
});

uploadPanel.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  billUploader.click();
});

function handleSelectedFiles(files) {
  pendingFiles = files.slice();
  const fileNames = pendingFiles.map((file) => file.name);
  uploadConfirm.classList.remove("hidden");
  uploadConfirm.innerHTML = `
    <div class="upload-confirm-content">
      <p>已选择 ${pendingFiles.length} 个文件：</p>
      <ul>${fileNames.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul>
      <div class="upload-confirm-actions">
        <button class="action-button primary-action" type="button" data-upload-action="confirm">开始解析</button>
        <button class="action-button" type="button" data-upload-action="cancel">取消</button>
      </div>
    </div>
  `;
  setStatus(`已选择 ${pendingFiles.length} 个文件，确认后开始解析。`);
}

async function confirmUploadFiles() {
  console.info("[Upload Debug] confirmUploadFiles", {
    pendingNames: pendingFiles.map((file) => file.name),
  });

  const files = pendingFiles.slice();

  if (!files.length) {
    setStatus("没有找到待解析文件，请重新选择账单文件。");
    console.warn("[Upload Debug] No pending files when clicking confirm.");
    return;
  }

  pendingFiles = [];
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  setLoading(true);
  try {
    console.info("[Upload Debug] calling processFiles", {
      count: files.length,
      names: files.map((file) => file.name),
    });
    await processFiles(files);
    console.info("[Upload Debug] processFiles finished");
  } catch (error) {
    console.error("[Upload Debug] confirmUploadFiles error", error);
    setStatus(`解析失败：${error.message || "请检查文件格式"}`);
  } finally {
    setLoading(false);
    billUploader.value = "";
    if (monthlyBillsUploader) monthlyBillsUploader.value = "";
  }
}

function cancelUploadFiles() {
  pendingFiles = [];
  billUploader.value = "";
  if (monthlyBillsUploader) monthlyBillsUploader.value = "";
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  setStatus("等待上传账单文件");
}

async function processFiles(files) {
  console.info("[Upload Debug] processFiles entered", {
    count: files.length,
    names: files.map((file) => file.name),
  });
  console.info("[Analyze Flow] processFiles start", {
    count: files.length,
    names: files.map((file) => file.name),
  });

  if (!files.length) {
    setStatus("没有找到待解析文件，请重新选择账单文件。");
    return;
  }
  resetTablePage();
  setStatus(`正在解析 ${files.length} 个文件...`);
  try {
    const rowsByFile = await Promise.all(
      files.map(async (file) => {
        console.info("[Analyze Flow] readBillFile start", file.name);
        const rows = await readBillFile(file);
        console.info("[Analyze Flow] readBillFile done", {
          file: file.name,
          rows: rows.length,
          sample: rows.slice(0, 3).map(maskDebugRow),
        });
        return rows;
      })
    );

    const rows = rowsByFile.flat();

    console.info(`[Normalize Count] rawRows=${rows.length}`);
    console.info("[Analyze Flow] raw rows collected", {
      rows: rows.length,
      sample: rows.slice(0, 3).map(maskDebugRow),
    });

    if (!rows.length) {
      setStatus("文件已读取，但没有识别到账单交易行。请查看 Console 中 [PDF READ OK] 和 [BOC Inspect]。");
      renderDashboard([]);
      return;
    }

    const normalizedResults = rows.map((row, index) => {
      const result = normalizeRow(row);
      if (!result) {
        console.warn("[Analyze Flow] normalizeRow dropped", {
          index,
          row: maskDebugRow(row),
          reason: getNormalizeDropReason(row),
        });
        console.warn("[Normalize Dropped Row]", {
          index,
          "交易时间": maskBankSensitiveText(row?.["交易时间"]),
          "金额": maskBankSensitiveText(row?.["金额"]),
          "收/支": maskBankSensitiveText(row?.["收/支"]),
          "交易类型": maskBankSensitiveText(row?.["交易类型"]),
          "交易对方": maskBankSensitiveText(row?.["交易对方"]),
          "交易说明": maskBankSensitiveText(row?.["交易说明"]),
          reason: getNormalizeDropReason(row),
          row: maskDebugRow(row),
        });
      }
      return result;
    });

    const transactions = ensureTransactionIds(normalizedResults.filter(Boolean).sort((a, b) => a.date - b.date));

    console.info("[Normalize Count]", {
      rawRows: rows.length,
      transactions: transactions.length,
    });
    console.info("[Analyze Flow] normalize done", {
      inputRows: rows.length,
      transactions: transactions.length,
      sample: transactions.slice(0, 3),
    });

    if (!transactions.length) {
      setStatus(`识别到 ${rows.length} 条原始记录，但统一字段转换后为 0 条。可能是日期、金额或收支类型格式不兼容。请看 Console 的 normalizeRow dropped。`);
      renderDashboard([]);
      return;
    }
    console.info("[Cross Dedup] function called before render", {
      total: transactions.length,
    });
    findCrossPlatformDuplicateCandidates(transactions);
    allTransactions = transactions;
    resetTablePage();
    populateMonthFilter(transactions);
    const selectedMonth = document.getElementById("monthFilter").value;
    renderSelectedMonth(selectedMonth);
    markUnsaved();
    setStatus(`解析成功：识别到 ${transactions.length} 条账单记录。`);
  } catch (error) {
    console.error("[Analyze Flow] processFiles error", error);
    const message = error.message || "请检查文件格式";
    if (message.includes("PDF") || message.includes("pdf")) {
      setStatus(`PDF 文件读取失败，请检查 PDF.js 加载或文件格式。${message ? ` ${message}` : ""}`);
    } else {
      setStatus(`解析失败：${message}`);
    }
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

function loadMonthlyBudgets() {
  const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    monthlyBudgets = Object.fromEntries(
      Object.entries(parsed || {})
        .map(([month, value]) => [month, Number(value)])
        .filter(([, value]) => Number.isFinite(value) && value > 0)
    );
  } catch (error) {
    console.warn("[SpendScope Budget] Failed to load monthly budgets:", error);
    monthlyBudgets = {};
    localStorage.removeItem(BUDGET_STORAGE_KEY);
  }
}

function saveMonthlyBudgets() {
  localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(monthlyBudgets));
}

function saveCurrentTablePage() {
  if (isRestoringTablePage) return;
  localStorage.setItem(TABLE_PAGE_KEY, String(currentTablePage));
}

function loadSavedTablePage() {
  const page = Number(localStorage.getItem(TABLE_PAGE_KEY));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function resetTablePage() {
  if (isRestoringTablePage) return;
  currentTablePage = 1;
  saveCurrentTablePage();
}

function loadMonthlyBills() {
  const raw = localStorage.getItem(MONTHLY_BILLS_KEY);
  if (!raw) return;

  try {
    monthlyBills = migrateMonthlyBills(JSON.parse(raw) || {});
    saveMonthlyBills();
  } catch (error) {
    console.warn("[SpendScope Monthly Bills] Failed to load monthly bills:", error);
    monthlyBills = {};
    localStorage.removeItem(MONTHLY_BILLS_KEY);
  }
}

function saveMonthlyBills() {
  localStorage.setItem(MONTHLY_BILLS_KEY, JSON.stringify(monthlyBills));
}

function groupTransactionsByMonth(transactions) {
  return transactions.reduce((groups, item) => {
    const month = monthKey(item.date);
    if (!groups[month]) groups[month] = [];
    groups[month].push(item);
    return groups;
  }, {});
}

function normalizeBillPlatform(platform) {
  const value = String(platform || "").trim();
  if (!value || value.includes("未知")) return "其他";
  if (value.includes("支付宝")) return "支付宝";
  if (value.includes("微信")) return "微信";
  if (value.includes("银行")) return "银行";
  return value;
}

function groupTransactionsByMonthAndPlatform(transactions) {
  return transactions.reduce((groups, item) => {
    const month = monthKey(item.date);
    const platform = normalizeBillPlatform(item.platform);
    if (!groups[month]) groups[month] = {};
    if (!groups[month][platform]) groups[month][platform] = [];
    groups[month][platform].push(item);
    return groups;
  }, {});
}

function serializeTransactions(transactions) {
  return transactions.map((item) => ({
    ...item,
    date: item.date instanceof Date ? item.date.toISOString() : item.date,
  }));
}

function deserializeTransactions(transactions) {
  return ensureTransactionIds(
    transactions
      .map((item) => migrateStoredTransaction({ ...item, date: new Date(item.date) }))
      .filter((item) => item.date instanceof Date && !Number.isNaN(item.date.getTime()))
  );
}

function migrateMonthlyBills(storedBills) {
  return Object.entries(storedBills)
    .filter(([month]) => /^\d{4}-\d{2}$/.test(month))
    .reduce((result, [month, bill]) => {
      if (bill?.platforms && typeof bill.platforms === "object") {
        const platforms = Object.entries(bill.platforms).reduce((items, [platform, platformBill]) => {
          if (!Array.isArray(platformBill?.transactions)) return items;
          const name = normalizeBillPlatform(platformBill.platform || platform);
          items[name] = {
            platform: name,
            savedAt: platformBill.savedAt || bill.savedAt || "",
            transactions: platformBill.transactions,
          };
          return items;
        }, {});
        if (Object.keys(platforms).length) result[month] = { month, platforms };
        return result;
      }

      if (Array.isArray(bill?.transactions)) {
        const grouped = groupTransactionsByMonthAndPlatform(deserializeTransactions(bill.transactions));
        const platforms = Object.entries(grouped[month] || {}).reduce((items, [platform, transactions]) => {
          items[platform] = {
            platform,
            savedAt: bill.savedAt || "",
            transactions: serializeTransactions(transactions),
          };
          return items;
        }, {});
        if (!Object.keys(platforms).length) {
          platforms["综合"] = {
            platform: "综合",
            savedAt: bill.savedAt || "",
            transactions: bill.transactions,
          };
        }
        result[month] = { month, platforms };
      }
      return result;
    }, {});
}

function saveCurrentReportToMonthlyBills() {
  if (!allTransactions.length) {
    setStatus("请先上传账单，再保存为月度账单。");
    return;
  }


  const grouped = groupTransactionsByMonthAndPlatform(allTransactions);
  const savedAt = new Date().toISOString();
  let savedCount = 0;

  Object.entries(grouped).forEach(([month, platformGroups]) => {
    if (!monthlyBills[month]) monthlyBills[month] = { month, platforms: {} };
    if (!monthlyBills[month].platforms) monthlyBills[month].platforms = {};

    Object.entries(platformGroups).forEach(([platform, transactions]) => {
      if (
        monthlyBills[month].platforms[platform] &&
        !confirm(`${month} ${platform} 月度账单已存在，是否覆盖已保存的${platform}账单？`)
      ) {
        return;
      }
      monthlyBills[month].platforms[platform] = {
        platform,
        savedAt,
        transactions: serializeTransactions(transactions),
      };
      savedCount += 1;
    });
  });

  if (!savedCount) {
    setStatus("没有保存新的月度账单。");
    return;
  }

  saveMonthlyBills();
  renderMonthlyBills();
  setStatus(`已保存 ${savedCount} 个按平台分类的月度账单。`);
}

function renderMonthlyBills() {
  if (!monthlyBillsList) return;
  const bills = Object.values(monthlyBills)
    .filter((bill) => bill?.platforms && Object.keys(bill.platforms).length)
    .sort((a, b) => b.month.localeCompare(a.month));
  if (!bills.length) {
    monthlyBillsList.innerHTML = '<p class="monthly-bills-empty">还没有保存的月度账单。</p>';
    return;
  }

  monthlyBillsList.innerHTML = bills
    .map((bill) => {
      const platformBills = Object.values(bill.platforms || {}).sort((a, b) => a.platform.localeCompare(b.platform));
      const totalCount = platformBills.reduce((count, item) => count + (item.transactions?.length || 0), 0);
      const platformItems = platformBills
        .map((item) => {
          const savedDate = item.savedAt ? new Date(item.savedAt) : null;
          const savedAt = savedDate && !Number.isNaN(savedDate.getTime()) ? formatDateTime(savedDate) : "未知时间";
          return `
            <article class="monthly-bill-platform-item">
              <div>
                <strong>${escapeHtml(item.platform)}</strong>
                <span>${escapeHtml(bill.month)} · ${item.transactions.length} 笔交易 · 保存于 ${escapeHtml(savedAt)}</span>
              </div>
              <div class="monthly-bill-actions">
                <button class="action-button" type="button" data-month-action="load" data-month="${escapeHtml(bill.month)}" data-platform="${escapeHtml(item.platform)}">加载</button>
                <button class="action-button" type="button" data-month-action="delete" data-month="${escapeHtml(bill.month)}" data-platform="${escapeHtml(item.platform)}">删除</button>
              </div>
            </article>
          `;
        })
        .join("");
      return `
        <section class="monthly-bill-month-group">
          <div class="monthly-bill-month-heading">
            <div>
              <strong>${escapeHtml(bill.month)}</strong>
              <span>${platformBills.length} 个平台 · ${totalCount} 笔交易</span>
            </div>
            <button class="action-button merged-bill-button" type="button" data-month-action="merge" data-month="${escapeHtml(bill.month)}">加载本月总账单</button>
          </div>
          <div class="monthly-bill-platforms">${platformItems}</div>
        </section>
      `;
    })
    .join("");
}

function applyLoadedMonthlyTransactions(month, transactions, statusText) {
  if (!transactions.length) {
    setStatus(`${month} 的月度账单数据无法加载。`);
    return;
  }

  allTransactions = ensureTransactionIds(transactions);
  resetTablePage();
  populateMonthFilter(allTransactions);
  const monthFilter = document.getElementById("monthFilter");
  monthFilter.value = month;
  renderSelectedMonth(month);
  renderBudgetPanel();
  markSaved(statusText);
}

function loadMonthlyBill(month, platform) {
  const bill = monthlyBills[month];
  const platformBill = bill?.platforms?.[platform];
  if (!platformBill) {
    setStatus("没有找到该月份该平台的月度账单。");
    renderMonthlyBills();
    return;
  }

  applyLoadedMonthlyTransactions(month, deserializeTransactions(platformBill.transactions), `已加载 ${month} ${platform} 账单`);
}

function loadMergedMonthlyBill(month) {
  const bill = monthlyBills[month];
  const platformBills = Object.values(bill?.platforms || {});
  if (!platformBills.length) {
    setStatus("没有找到该月份的月度账单。");
    renderMonthlyBills();
    return;
  }

  const transactions = platformBills.flatMap((item) => deserializeTransactions(item.transactions));
  applyLoadedMonthlyTransactions(month, transactions, `已加载 ${month} 总账单`);
}

function deleteMonthlyBill(month, platform) {
  if (!monthlyBills[month]?.platforms?.[platform]) return;
  if (!confirm(`确定删除 ${month} ${platform} 月度账单吗？`)) return;
  delete monthlyBills[month].platforms[platform];
  if (!Object.keys(monthlyBills[month].platforms).length) {
    delete monthlyBills[month];
  }
  saveMonthlyBills();
  renderMonthlyBills();
  setStatus(`已删除 ${month} ${platform} 月度账单。`);
}
function getLoginState() {
  try {
    const raw = localStorage.getItem(LOGIN_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("[SpendScope Login] Failed to read login state:", error);
    localStorage.removeItem(LOGIN_STATE_KEY);
    return null;
  }
}

function saveLoginState(mode) {
  localStorage.setItem(
    LOGIN_STATE_KEY,
    JSON.stringify({
      loggedIn: true,
      mode,
      loginAt: new Date().toISOString(),
    })
  );
  renderAuthState(true);
}

function renderAuthState(isLoggedIn) {
  loginPage?.classList.toggle("is-hidden", isLoggedIn);
  appShell?.classList.toggle("is-hidden", !isLoggedIn);
  if (isLoggedIn && activePage === "trends") {
    requestAnimationFrame(() => {
      Object.values(charts).forEach((chart) => {
        chart?.resize?.();
        chart?.update?.();
      });
    });
  }
}

function showLoginMessage(message) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
}

function handleLocalLogin() {
  const account = loginAccountInput?.value.trim() || "";
  if (!account) {
    showLoginMessage("请输入手机号或邮箱");
    loginAccountInput?.focus();
    return;
  }
  showLoginMessage("");
  saveLoginState("local");
}

function handleGuestLogin() {
  showLoginMessage("");
  saveLoginState("guest");
}

function handleLogout() {
  localStorage.removeItem(LOGIN_STATE_KEY);
  if (loginPasswordInput) loginPasswordInput.value = "";
  showLoginMessage("");
  renderAuthState(false);
}

function switchPage(page) {
  activePage = VALID_PAGES.includes(page) ? page : "overview";
  pageTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.page === activePage));
  overviewPage?.classList.toggle("active", activePage === "overview");
  detailsPage?.classList.toggle("active", activePage === "details");
  trendsPage?.classList.toggle("active", activePage === "trends");
  comparePage?.classList.remove("active");
  localStorage.setItem(ACTIVE_PAGE_KEY, activePage);
  if (activePage === "details") {
    applyTableFilters();
  }
  if (activePage === "trends") {
    requestAnimationFrame(() => {
      Object.values(charts).forEach((chart) => {
        chart?.resize?.();
        chart?.update?.();
      });
    });
  }
}

function getPreviousMonthKey(month) {
  const match = /^(\d{4})-(\d{2})$/.exec(month || "");
  if (!match) return "";
  const date = new Date(Number(match[1]), Number(match[2]) - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getTransactionsByMonth(month) {
  if (!month) return [];
  return allTransactions.filter((item) => monthKey(item.date) === month);
}

function getMonthExpenseSummary(month) {
  const transactions = getTransactionsByMonth(month);
  const expenses = transactions.filter((item) => item.type === TYPE_OPTIONS[0]);
  const refunds = transactions.filter((item) => item.type === TYPE_OPTIONS[2]);
  const totalRefund = sum(refunds);
  const totalExpense = Math.max(0, sum(expenses) - totalRefund);
  return {
    month,
    transactions,
    expenses,
    refunds,
    totalExpense,
    category: aggregateNet(expenses, refunds, "category"),
  };
}

function getCategoryDeltas(currentCategory, previousCategory) {
  const previousMap = new Map(previousCategory.map((item) => [item.name, item.value]));
  const names = new Set([...currentCategory.map((item) => item.name), ...previousCategory.map((item) => item.name)]);
  return Array.from(names)
    .map((name) => {
      const current = currentCategory.find((item) => item.name === name)?.value || 0;
      const previous = previousMap.get(name) || 0;
      return { name, current, previous, delta: current - previous };
    })
    .filter((item) => item.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

function renderMonthComparison() {
  const currentMonth = document.getElementById("monthFilter").value;
  if (!currentMonth) {
    setCompareEmpty("请选择一个具体月份查看多月对比。");
    return;
  }

  const previousMonth = getPreviousMonthKey(currentMonth);
  const current = getMonthExpenseSummary(currentMonth);
  const previous = getMonthExpenseSummary(previousMonth);
  if (!previous.transactions.length) {
    setCompareEmpty("暂无上月数据，上传更多月份账单后可生成对比。");
    return;
  }

  const delta = current.totalExpense - previous.totalExpense;
  const rate = previous.totalExpense ? delta / previous.totalExpense : 0;
  const deltas = getCategoryDeltas(current.category, previous.category);
  const increased = deltas.filter((item) => item.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 3);
  const decreased = deltas.filter((item) => item.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 3);

  compareStatus.textContent = `${currentMonth} 对比 ${previousMonth}`;
  currentMonthExpense.textContent = money.format(current.totalExpense);
  previousMonthExpense.textContent = money.format(previous.totalExpense);
  monthExpenseDelta.textContent = formatSignedMoney(delta);
  monthExpenseDelta.className = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
  monthExpenseRate.textContent = formatSignedPercent(rate);
  monthExpenseRate.className = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
  increaseCategoryList.innerHTML = renderCategoryDeltaList(increased);
  decreaseCategoryList.innerHTML = renderCategoryDeltaList(decreased);
  compareSummary.textContent = generateComparisonSummary(currentMonth, previousMonth, current, previous, delta, rate, increased, decreased);
}

function setCompareEmpty(message) {
  compareStatus.textContent = message;
  currentMonthExpense.textContent = money.format(0);
  previousMonthExpense.textContent = money.format(0);
  monthExpenseDelta.textContent = formatSignedMoney(0);
  monthExpenseRate.textContent = formatSignedPercent(0);
  monthExpenseDelta.className = "neutral";
  monthExpenseRate.className = "neutral";
  increaseCategoryList.innerHTML = renderCategoryDeltaList([]);
  decreaseCategoryList.innerHTML = renderCategoryDeltaList([]);
  compareSummary.textContent = message;
}

function renderCategoryDeltaList(items) {
  if (!items.length) return '<p class="compare-empty">暂无明显变化</p>';
  return items
    .map(
      (item) => `
        <div class="compare-list-item">
          <span>${escapeHtml(item.name)}</span>
          <strong class="${item.delta > 0 ? "up" : "down"}">${formatSignedMoney(item.delta)}</strong>
        </div>
      `
    )
    .join("");
}

function formatSignedMoney(value) {
  if (value > 0) return `+${money.format(value)}`;
  if (value < 0) return `-${money.format(Math.abs(value))}`;
  return money.format(0);
}

function formatSignedPercent(value) {
  if (!Number.isFinite(value) || value === 0) return "0%";
  const text = `${Math.abs(value * 100).toFixed(1)}%`;
  return value > 0 ? `+${text}` : `-${text}`;
}

function generateComparisonSummary(currentMonth, previousMonth, current, previous, delta, rate, increased, decreased) {
  const direction = delta > 0 ? "增加" : delta < 0 ? "减少" : "持平";
  const lead = `${currentMonth} 总支出较 ${previousMonth} ${direction} ${money.format(Math.abs(delta))}，环比 ${formatSignedPercent(rate)}。`;
  const upText = increased.length ? `增加较多的类别是 ${increased.map((item) => `${item.name} ${formatSignedMoney(item.delta)}`).join("、")}。` : "没有明显增加的支出类别。";
  const downText = decreased.length ? `减少较多的类别是 ${decreased.map((item) => `${item.name} ${formatSignedMoney(item.delta)}`).join("、")}。` : "没有明显减少的支出类别。";
  return `${lead}\n\n${upText}\n${downText}`;
}

function isValidCustomCategory(name) {
  const value = cleanCell(name);
  return Boolean(value && value !== "人情往来");
}

function migrateStoredTransaction(item) {
  const type = item.type === "中性" ? "排除" : item.type;
  const sourcePlatform = getTransactionSourcePlatform(item);
  const categoryParts = {
    description: item.description || "",
    merchant: item.merchant || "",
    transactionType: item.transactionType || "",
        description: item.description || "",
    merchant: item.merchant || "",
    transactionType: item.transactionType || "",
  };
  return {
    ...item,
    sourcePlatform,
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
  resetTablePage();
  billUploader.value = "";
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  resetDashboard();
  markSaved("等待上传账单文件");
}

function resetDashboard() {
  const monthFilter = document.getElementById("monthFilter");
  currentTableTransactions = [];
  resetTablePage();
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
  if (saveToMonthlyBillsButton) saveToMonthlyBillsButton.disabled = !hasData;
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

function getActiveMonthKey() {
  return document.getElementById("monthFilter").value || "all";
}

function getActiveMonthLabel() {
  const key = getActiveMonthKey();
  return key === "all" ? "全部月份" : key;
}

function getCurrentMonthBudget() {
  const value = Number(monthlyBudgets[getActiveMonthKey()]);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function saveCurrentMonthBudget() {
  const value = Number(monthlyBudgetInput?.value);
  if (!Number.isFinite(value) || value <= 0) {
    setStatus("请输入大于 0 的本月预算。");
    return;
  }

  monthlyBudgets[getActiveMonthKey()] = value;
  saveMonthlyBudgets();
  renderBudgetPanel();
  setStatus(`已保存 ${getActiveMonthLabel()} 预算：${money.format(value)}。`);
}

function clearCurrentMonthBudget() {
  delete monthlyBudgets[getActiveMonthKey()];
  saveMonthlyBudgets();
  if (monthlyBudgetInput) monthlyBudgetInput.value = "";
  renderBudgetPanel();
  setStatus(`已清除 ${getActiveMonthLabel()} 的预算提醒。`);
}

function getBudgetStatus(totalExpense, budget) {
  const used = Math.max(0, Number(totalExpense) || 0);
  const limit = Number(budget) || 0;

  if (!limit) {
    return {
      level: "empty",
      percent: 0,
      remaining: 0,
      text: "未设置预算，保存后会显示本月使用进度。",
      pdfText: "未设置",
    };
  }

  const remaining = limit - used;
  const percent = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  if (used > limit) {
    return {
      level: "danger",
      percent,
      remaining,
      text: `本月已超出预算 ${money.format(Math.abs(remaining))}。`,
      pdfText: `已超出预算 ${money.format(Math.abs(remaining))}`,
    };
  }
  if (used / limit >= 0.8) {
    return {
      level: "warning",
      percent,
      remaining,
      text: `预算使用率已达到 ${percent}%，接下来可以稍微留意支出节奏。`,
      pdfText: `已使用 ${percent}%，接近预算上限`,
    };
  }
  return {
    level: "safe",
    percent,
    remaining,
    text: `预算使用率 ${percent}%，当前支出仍在安全范围内。`,
    pdfText: `已使用 ${percent}%，预算充足`,
  };
}

function renderBudgetPanel() {
  if (!budgetAmount || !budgetUsed || !budgetRemaining || !budgetProgress || !budgetStatus) return;

  const summary = getCurrentReportSummary();
  const budget = getCurrentMonthBudget();
  const status = getBudgetStatus(summary.totalExpense, budget);

  budgetMonthLabel.textContent = getActiveMonthLabel();
  if (monthlyBudgetInput) monthlyBudgetInput.value = budget ? String(budget) : "";
  budgetAmount.textContent = budget ? money.format(budget) : "未设置";
  budgetUsed.textContent = money.format(summary.totalExpense);
  budgetRemaining.textContent = budget ? money.format(status.remaining) : "未设置";
  budgetRemaining.className = status.level;
  budgetProgress.className = `budget-progress-bar ${status.level}`;
  budgetProgress.style.width = `${budget ? Math.min(status.percent, 100) : 0}%`;
  budgetStatus.className = `budget-status ${status.level}`;
  budgetStatus.textContent = status.text;
  clearBudgetButton.disabled = !budget;
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
  const budget = getCurrentMonthBudget();

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
    budget,
    budgetStatus: getBudgetStatus(totalExpense, budget),
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
    <p style="line-height:1.8;margin:0 0 22px;">本月预算：${report.budget ? money.format(report.budget) : "未设置"}；预算状态：${report.budgetStatus?.pdfText || "未设置"}</p>
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
  resetTablePage();
  renderSelectedMonth(event.target.value);
  renderBudgetPanel();
});

async function readBillFile(file) {
  console.info("[Upload Debug] readBillFile", {
    name: file.name,
    size: file.size,
    type: file.type,
  });
  const ext = file.name.split(".").pop().toLowerCase();
  const platform = detectPlatform(file.name);
  const sourcePlatform = detectBillSourcePlatform(file.name);

  if (ext === "csv") {
    const text = await readTextFile(file);
    const csvSourcePlatform = firstKnownSourcePlatform(sourcePlatform, detectBillSourcePlatform(text.slice(0, 2000)));
    return parseCsv(text).map((row) => addBillSourceMeta(row, platform, csvSourcePlatform));
  }

  if (["xlsx", "xls"].includes(ext)) {
    if (!window.XLSX) throw new Error("Excel 解析库未加载，请检查网络后刷新页面。");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    return workbook.SheetNames.flatMap((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
      const sheetPreview = matrix
        .slice(0, 20)
        .map((row) => row.map(cleanCell).join(" "))
        .join(" ");
      const sheetSourcePlatform = firstKnownSourcePlatform(sourcePlatform, detectBillSourcePlatform(`${sheetName} ${sheetPreview}`));
            return rowsToObjects(matrix).map((row) => addBillSourceMeta(row, platform, sheetSourcePlatform));
    });
  }

  if (ext === "pdf") {
    return readPdfFile(file).then((rows) => rows.map((row) => addBillSourceMeta(row, platform, sourcePlatform)));
  }

  throw new Error(`${file.name} 不是支持的账单格式`);
}

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
  console.info("[PDF Debug] readPdfFile entered", {
    name: file.name,
    type: file.type,
    size: file.size,
  });
  const pdfjsLib = window.pdfjsLib || globalThis.pdfjsLib;
  if (!pdfjsLib) throw new Error("PDF 解析库未加载，请检查网络后刷新页面。");
  configurePdfJsWorker(pdfjsLib);

  const buffer = await file.arrayBuffer();
  let pdf;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    pdf = await loadingTask.promise;
  } catch (error) {
    if (String(error?.message || error).includes("Setting up fake worker failed")) {
      throw new Error("PDF.js worker 加载失败：请检查网络/CDN 访问，或使用本地服务器运行项目。");
    }
    throw error;
  }
  const lines = [];
  const lineEntries = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageLines = textItemsToLines(content.items, pageNumber);
    lines.push(...pageLines);
    lineEntries.push(...pageLines.map((line) => ({ text: line, pageNumber })));
  }

  const text = lines.join("\n");
  console.info("[PDF READ OK]", {
    file: file.name,
    pages: pdf.numPages,
    lines: lines.length,
    sample: lines.slice(0, 20).map(maskBankSensitiveText),
  });
  inspectBankOfChinaPdfText(text, lines, file.name);

  const bankOfChinaRows = parseBankOfChinaPdfText(text, lineEntries, file.name);
  console.info("[PDF Parser] bank-of-china rows", bankOfChinaRows.length);
  if (bankOfChinaRows.length) {
    console.info("[SpendScope PDF] parser=bank-of-china rows=%d lines=%d", bankOfChinaRows.length, lines.length);
    return bankOfChinaRows.map((row) => ({ ...row, __sourcePlatform: "\u4e2d\u56fd\u94f6\u884c" }));
  }

  const textIncludesAlipay = /支付宝|余额宝|收\s*\/\s*支|交易对方|商品说明/.test(text);
  const likelyAlipay = isLikelyAlipayPdf(file, text);
  console.info("[Alipay Backend Decision]", {
    fileName: file.name,
    textIncludesAlipay,
    likelyAlipay,
    backendUrl: ALIPAY_BACKEND_PARSE_URL,
  });

  if (likelyAlipay) {
    try {
      console.info("[Alipay Backend Parse Try]", {
        fileName: file.name,
        backendUrl: ALIPAY_BACKEND_PARSE_URL,
      });
      const backendRows = await parseAlipayPdfWithBackend(file);
      console.info("[PDF Parser] alipay backend rows", backendRows.length);
      console.info("[SpendScope PDF] parser=alipay-backend rows=%d lines=%d", backendRows.length, lines.length);
      return backendRows.map((row) => ({
        ...row,
        "\u5e73\u53f0": row["\u5e73\u53f0"] || "\u652f\u4ed8\u5b9d",
        sourcePlatform: row.sourcePlatform || "\u652f\u4ed8\u5b9d",
        __sourcePlatform: row.__sourcePlatform || "\u652f\u4ed8\u5b9d",
      }));
    } catch (error) {
      console.warn("[Alipay Backend Parse Failed, fallback to frontend]", error);
    }
  }

  const alipayRows = parseAlipayPdfText(text);
  console.info("[PDF Parser] alipay rows", alipayRows.length);
  if (alipayRows.length) {
    console.info("[SpendScope PDF] parser=alipay rows=%d lines=%d", alipayRows.length, lines.length);
    return alipayRows.map((row) => ({ ...row, __sourcePlatform: "\u652f\u4ed8\u5b9d" }));
  }

  const fallbackRows = parsePdfLines(lines, file.name);
  console.info("[PDF Parser] fallback rows", fallbackRows.length);
  console.info("[SpendScope PDF] parser=fallback rows=%d lines=%d", fallbackRows.length, lines.length);
  if (!fallbackRows.length && isBankOfChinaPdfText(text, file.name)) {
    throw new Error("未识别到中国银行交易明细，请检查账单是否为文字型 PDF，或尝试导出 Excel/CSV 格式。");
  }
  return fallbackRows;
}

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

function configurePdfJsWorker(pdfjsLib) {
  if (!pdfjsLib?.GlobalWorkerOptions) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
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

function maskBankSensitiveText(text) {
  return String(text || "")
    .replace(/\d{8,}/g, (match) => `****${match.slice(-4)}`)
    .replace(/1[3-9]\d{9}/g, (match) => `****${match.slice(-4)}`);
}

function maskDebugRow(row) {
  if (!row || typeof row !== "object") return row;
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, maskBankSensitiveText(value)]));
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
  let type = normalizeAlipayTransactionTypeText(fields.type, row) || detectType(fields.type, amount, row);
  const absAmount = Math.abs(amount);
  const merchant = fields.merchant || fields.description || "未知交易对象";
  const description = fields.description || merchant;
  const platformFromFile = row.__platformFromFile && row.__platformFromFile !== "未知来源" ? row.__platformFromFile : "";
  const platform = fields.platform || platformFromFile || detectPlatform(`${merchant} ${description}`);
  const sourcePlatform = firstKnownSourcePlatform(
    getTransactionSourcePlatform({
      sourcePlatform: row.sourcePlatform || row.__sourcePlatform || row["账单来源"] || row["来源"],
    }),
    detectSourcePlatform(row)
  );
  if (sourcePlatform === "支付宝" && /不计收支|不计|收支/.test(String(fields.type || row["原始收支"] || ""))) {
    type = type === "退款" ? "退款" : "排除";
  }
  if (type === "中性") type = "排除";

  if (sourcePlatform === "支付宝" && type === "排除" && /不计收支|不计|收支/.test(String(fields.type || row["原始收支"] || row.rawType || row.originalType || ""))) {
    type = "排除";
  }

  if (!date || !Number.isFinite(absAmount) || absAmount === 0) return null;

  const transactionType = fields.transactionType || row["交易类型"] || row["业务类型"] || "-";
  const category = normalizeCategoryForType(type, row["消费类别"] || row.category || row["类别"], {
    merchant,
    description,
    transactionType,
  });
  const rawType = row.rawType || row.originalType || row["原始收支"] || fields.type || type;
  const result = {
    date,
    time: formatDateTime(date),
    platform,
    sourcePlatform,
    merchant,
    description,
    transactionType,
    type,
    amount: absAmount,
    category,
    excludeReason: row.excludeReason || (type === "排除" ? row.excludeReason || "排除" : ""),
    rawType,
    originalType: row.originalType || rawType,
  };

  return applyAlipayClassificationRules(result, row);
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

function getNormalizeDropReason(row) {
  const fields = mapFields(row);
  const amount = parseAmount(fields.amount, row);
  const date = parseDate(fields.time);
  const type = normalizeAlipayTransactionTypeText(fields.type, row) || detectType(fields.type, amount, row);

  if (!fields.time) return "missing time field";
  if (!date || Number.isNaN(date.getTime())) return `invalid date: ${fields.time}`;
  if (!fields.amount) return "missing amount field";
  if (!Number.isFinite(amount)) return `invalid amount: ${fields.amount}`;
  if (Math.abs(amount) === 0) return `zero amount: ${fields.amount}`;
  if (!fields.type) return "missing type field";
  if (!type) return `invalid type: ${fields.type}`;

  return "unknown normalizeRow drop reason";
}

function findCrossPlatformDuplicateCandidates(transactions) {
  console.info("[Cross Dedup] entered", { total: transactions.length });
  return [];
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
  if (/中性|不计收支|^\/$/.test(typeText)) return "排除";
  if (/退款|退货|售后退款|运费补偿|运费补贴|运费险|退运费|运费赔付/.test(text)) return "退款";
  if (/余额宝-自动转入|银行卡定时转入|转出到银行卡|自动转入|定时转入|账户转存|账户转移|基金转入|基金转出|提现|充值到余额|余额充值/.test(text)) return "排除";
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
  if (isInsufficientContextTransaction(parts)) return "其他";

  if (hasDiningContext(parts.description)) return "正餐";

  const descriptionMatch = matchExpenseCategory(parts.description);
  if (descriptionMatch) return descriptionMatch[0];

  const transactionTypeMatch = matchExpenseCategory(parts.transactionType);
  const merchantMatch = isGenericMerchant(parts.merchant) ? null : matchExpenseCategory(parts.merchant);
  if (merchantMatch) return merchantMatch[0];
  if (isTaobaoPlatformMerchant(parts.merchant)) return "购物";
  return (merchantMatch || transactionTypeMatch)?.[0] || "其他";
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

function hasDiningContext(text) {
  return DINING_CONTEXT_PATTERN.test(String(text || ""));
}

function isGenericMerchant(merchant) {
  return GENERIC_MERCHANT_PATTERNS.test(String(merchant || "").trim());
}

function isTaobaoPlatformMerchant(merchant) {
  return /淘宝平台商户/.test(String(merchant || ""));
}

function isInsufficientContextTransaction(parts) {
  const text = `${parts.description} ${parts.merchant} ${parts.transactionType}`;
  if (!INSUFFICIENT_CONTEXT_PATTERN.test(text)) return false;
  return !matchExpenseCategory(parts.description) && !hasDiningContext(parts.description);
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
  renderBudgetPanel();
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
  const budget = getCurrentMonthBudget();
  const budgetStatus = getBudgetStatus(stats.totalExpense, budget);
  const netText = stats.net >= 0 ? `结余 ${money.format(stats.net)}` : `净支出 ${money.format(Math.abs(stats.net))}`;

  const lines = [
    `本月共识别 ${stats.transactions.length} 笔交易，其中支出 ${stats.expenses.length} 笔、收入 ${stats.incomes.length} 笔、退款 ${stats.refunds.length} 笔。总收入为 ${money.format(stats.totalIncome)}，抵扣后总支出为 ${money.format(stats.totalExpense)}，整体为${netText}。`,
    stats.refunds.length ? `本月存在部分退款记录，已在真实支出中抵扣，合计抵扣 ${money.format(stats.totalRefund)}。` : "",
    topCategory ? `主要支出集中在「${topCategory.name}」，金额约 ${money.format(topCategory.value)}，占本月支出的 ${percent(topCategory.value, stats.totalExpense)}。` : "目前还没有可用于分类统计的支出数据。",
    topPlatform ? `从支付平台看，「${topPlatform.name}」支出最多，约 ${money.format(topPlatform.value)}；高频交易对象是「${topMerchant?.name || "暂无"}」。` : "平台支出还不明显，上传更多账单后会更完整。",
    largeItems.length ? `值得留意的大额消费包括：${largeItems.map((item) => `${item.merchant} ${money.format(item.amount)}`).join("、")}。` : "",
    "下月可以优先关注占比最高的类别和大额消费，给固定开销留出预算，再为弹性消费设置一个舒服的上限。这里的建议只用于日常消费管理，不涉及投资理财判断。",
    budget ? `预算提醒：${budgetStatus.text}` : "预算提醒：本月还没有设置预算，设置后可以看到支出进度和剩余额度。",
  ].filter(Boolean);

  document.getElementById("aiSummary").textContent = lines.join("\n\n");
}

function renderTable(rows, total, filteredCount = rows.length, totalPages = 0) {
  const tbody = document.getElementById("transactionTable");
  const hint = document.getElementById("tableHint");
  const displayPage = filteredCount ? currentTablePage : 0;
  hint.textContent = `共 ${filteredCount} 条明细，当前显示第 ${displayPage} / ${totalPages} 页`;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-row">${total ? "没有符合条件的明细" : "还没有账单数据，上传账单后将在这里显示整理后的明细。"}</td></tr>`;
    return;
  }

  tbody.innerHTML = rows
    .map(
      (item) => {
        const displayTime = formatTableTime(item.time);
        const transactionType = item.transactionType || "-";
        return `
          <tr data-id="${escapeHtml(item.id)}">
            <td data-label="时间" class="time-cell">
              <div class="time-date">${escapeHtml(displayTime.date)}</div>
              ${displayTime.clock ? `<div class="time-clock">${escapeHtml(displayTime.clock)}</div>` : ""}
            </td>
            <td data-label="账单来源" class="source-cell">${escapeHtml(getTransactionSourcePlatform(item))}</td>
            <td data-label="收/付款方式" class="payment-cell">${escapeHtml(item.platform || "-")}</td>
            <td data-label="交易对方" class="merchant-cell">${escapeHtml(item.merchant || "-")}</td>
            <td data-label="交易说明" class="description-cell">
              <div class="description-main">${escapeHtml(getTransactionDescriptionSummary(item))}</div>
              ${transactionType !== "-" ? `<div class="description-sub">${escapeHtml(transactionType)}</div>` : ""}
            </td>
            <td data-label="类别">${renderCategorySelect(item)}</td>
            <td data-label="收支类型">${renderTypeSelect(item)}</td>
            <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
          </tr>
        `;
      }
    )
    .join("");
}

function updateFilterOptions() {
  tableFilterOptions = {
    platform: uniqueSorted(currentTableTransactions.map((item) => getTransactionSourcePlatform(item))),
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
    platform: "全部账单来源",
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
  resetTablePage();
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
      item.sourcePlatform,
      item.__sourcePlatform,
      item.billSource,
      item.platform,
      item.merchant,
      item.description,
      item.memo,
      item.summary,
      item.transactionType,
      item.category,
      item.type,
      String(item.amount),
      money.format(item.amount),
    ];
    const matchesSearch = !keyword || fields.some((value) => String(value || "").toLowerCase().includes(keyword));
    const matchesPlatform = !tableFilters.platform || getTransactionSourcePlatform(item) === tableFilters.platform;
    const matchesType = !tableFilters.type || item.type === tableFilters.type;
    const matchesCategory = !tableFilters.category || item.category === tableFilters.category;
    const matchesMerchant = !tableFilters.merchant || item.merchant === tableFilters.merchant;
    const matchesTransactionType = !tableFilters.transactionType || (item.transactionType || "-") === tableFilters.transactionType;

    return matchesSearch && matchesPlatform && matchesType && matchesCategory && matchesMerchant && matchesTransactionType;
  });
}

function getTransactionDescriptionSummary(item) {
  return item?.description || item?.memo || item?.summary || "-";
}

function formatTableTime(value) {
  const text = String(value || "-").trim();
  const match = text.match(/^(\d{4}[-/]\d{1,2}[-/]\d{1,2})\s+(\d{1,2}:\d{2})(?::\d{2})?/);
  if (!match) return { date: text, clock: "" };

  return {
    date: match[1].replace(/\//g, "-"),
    clock: match[2],
  };
}

function applyTableFilters() {
  const filtered = getFilteredTransactions();
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (totalPages && currentTablePage > totalPages) {
    currentTablePage = totalPages;
  }
  if (currentTablePage < 1) {
    currentTablePage = 1;
  }
  if (totalPages > 0) saveCurrentTablePage();
  const sortedTransactions = [...filtered].sort((a, b) => {
    const timeA = a.date instanceof Date ? a.date.getTime() : new Date(a.date).getTime();
    const timeB = b.date instanceof Date ? b.date.getTime() : new Date(b.date).getTime();
    return timeB - timeA;
  });
  const start = (currentTablePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageTransactions = sortedTransactions.slice(start, end);
  renderTable(pageTransactions, currentTableTransactions.length, filtered.length, totalPages);
  renderTablePagination(filtered.length);
}

function renderTablePagination(totalItems) {
  if (!tablePagination) return;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (!totalItems) {
    tablePagination.innerHTML = "";
    return;
  }

  const pages = getPaginationPages(currentTablePage, totalPages);
  const pageButtons = pages
    .map((page) => {
      if (page === "...") {
        return '<span class="pagination-ellipsis">...</span>';
      }
      return `<button class="pagination-button ${page === currentTablePage ? "active" : ""}" type="button" data-page="${page}" aria-label="第 ${page} 页">${page}</button>`;
    })
    .join("");

  tablePagination.innerHTML = `
    <button class="pagination-button" type="button" data-page="${currentTablePage - 1}" ${currentTablePage === 1 ? "disabled" : ""}>上一页</button>
    ${pageButtons}
    <button class="pagination-button" type="button" data-page="${currentTablePage + 1}" ${currentTablePage === totalPages ? "disabled" : ""}>下一页</button>
  `;
}

function getPaginationPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("...");
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  if (end < totalPages - 1) pages.push("...");
  pages.push(totalPages);
  return pages;
}

function handleTablePaginationClick(event) {
  const button = event.target.closest("[data-page]");
  if (!button || button.disabled) return;
  const page = Number(button.dataset.page);
  if (!Number.isInteger(page) || page === currentTablePage) return;
  currentTablePage = page;
  saveCurrentTablePage();
  applyTableFilters();
}

function handleSearchInput() {
  resetTablePage();
  applyTableFilters();
}

function resetTableFilters() {
  tableSearch.value = "";
  Object.keys(tableFilters).forEach((key) => {
    tableFilters[key] = "";
  });
  resetTablePage();
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

  const tableTransaction = currentTableTransactions.find((item) => item.id === id);
  if (tableTransaction && tableTransaction !== transaction) {
    tableTransaction.type = transaction.type;
    tableTransaction.category = transaction.category;
  }

  renderSelectedMonth(document.getElementById("monthFilter").value);
  saveTransactionsToStorage();
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
  console.info("[Upload Debug] setLoading", isLoading);
  if (!loadingOverlay) return;
  loadingOverlay.classList.toggle("hidden", !isLoading);
  uploadPanel.classList.toggle("is-loading", isLoading);
  billUploader.disabled = isLoading;
  if (monthlyBillsUploader) monthlyBillsUploader.disabled = isLoading;
  if (chooseMonthlyBillFileButton) chooseMonthlyBillFileButton.disabled = isLoading;
}
