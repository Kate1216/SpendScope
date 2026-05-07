const TYPE_OPTIONS = ["支出", "收入", "退款", "排除"];
const EXPENSE_CATEGORIES = ["交通", "学习", "正餐", "奶茶咖啡", "零食水果", "聚餐", "运动", "购物", "娱乐", "手工爱好", "宠物", "旅行", "日常开销", "化妆护肤", "群收款", "其他"];
const INCOME_CATEGORIES = ["生活费", "兼职", "工资", "群收款", "理财", "收益", "礼金", "其他"];
const REFUND_CATEGORIES = ["退款/抵扣"];
const EXCLUDED_CATEGORIES = ["排除", "重复扣款", "重复退款", "重复记录", "账户转移", "已合并", "抵消"];

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
const PDFJS_WORKER_SRC = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

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
const expandedDuplicateGroups = new Set();
const expandedRefundOffsetGroups = new Set();
const expandedMergeGroups = new Set();
const selectedTransactionIds = new Set();
let pendingMergeItems = [];

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
const startManualMergeButton = document.getElementById("startManualMerge");
const confirmManualMergeButton = document.getElementById("confirmManualMerge");
const cancelManualMergeButton = document.getElementById("cancelManualMerge");
const categoryModal = document.getElementById("categoryModal");
const closeCategoryModalButton = document.getElementById("closeCategoryModal");
const cancelCategoryModalButton = document.getElementById("cancelCategoryModal");
const addCategoryButton = document.getElementById("addCategory");
const customCategoryType = document.getElementById("customCategoryType");
const customCategoryName = document.getElementById("customCategoryName");
const categoryMessage = document.getElementById("categoryMessage");
const mergeModal = document.getElementById("mergeModal");
const closeMergeModalButton = document.getElementById("closeMergeModal");
const cancelMergeModalButton = document.getElementById("cancelMergeModal");
const createManualMergeButton = document.getElementById("createManualMerge");
const mergePreview = document.getElementById("mergePreview");
const mergeTimeInput = document.getElementById("mergeTime");
const mergeSourcePlatformInput = document.getElementById("mergeSourcePlatform");
const mergePlatformInput = document.getElementById("mergePlatform");
const mergeMerchantInput = document.getElementById("mergeMerchant");
const mergeMerchantOptions = document.getElementById("mergeMerchantOptions");
const mergeDescriptionInput = document.getElementById("mergeDescription");
const mergeDescriptionOptions = document.getElementById("mergeDescriptionOptions");
const mergeCategorySelect = document.getElementById("mergeCategory");
const mergeTypeSelect = document.getElementById("mergeType");
const mergeAmountInput = document.getElementById("mergeAmount");
const mergeAmountBreakdown = document.getElementById("mergeAmountBreakdown");
const mergeMemoInput = document.getElementById("mergeMemo");
const mergeMessage = document.getElementById("mergeMessage");
let lastAutoMergeAmount = "";
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
    ensureTransactionTableSelectionHeader();
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
transactionTable.addEventListener("click", handleTransactionTableClick);
transactionTable.addEventListener("focusin", handleDescriptionEditFocus);
transactionTable.addEventListener("focusout", handleDescriptionEditBlur);
transactionTable.addEventListener("keydown", handleDescriptionEditKeydown);
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
startManualMergeButton?.addEventListener("click", openManualMergeModal);
confirmManualMergeButton?.addEventListener("click", splitSelectedMergedBill);
closeMergeModalButton?.addEventListener("click", closeManualMergeModal);
cancelMergeModalButton?.addEventListener("click", closeManualMergeModal);
createManualMergeButton?.addEventListener("click", createManualMergeTransaction);
mergeTypeSelect?.addEventListener("change", handleMergeTypeChange);
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

    const normalizedTransactions = ensureTransactionIds(normalizedResults.filter(Boolean).sort((a, b) => a.date - b.date));

    console.info("[Normalize Count]", {
      rawRows: rows.length,
      transactions: normalizedTransactions.length,
    });
    console.info("[Analyze Flow] normalize done", {
      inputRows: rows.length,
      transactions: normalizedTransactions.length,
      sample: normalizedTransactions.slice(0, 3),
    });

    if (!normalizedTransactions.length) {
      setStatus(`识别到 ${rows.length} 条原始记录，但统一字段转换后为 0 条。可能是日期、金额或收支类型格式不兼容。请看 Console 的 normalizeRow dropped。`);
      renderDashboard([]);
      return;
    }
    console.info("[Cross Dedup] function called before render", {
      total: normalizedTransactions.length,
    });
    const dedupedTransactions = applyCrossPlatformDedup(normalizedTransactions);
    const transactions = applyRefundPairing(dedupedTransactions);
    clearTransactionSelection();
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
    if (message.includes("支付宝 PDF 需要启动后端解析服务")) {
      setStatus(message);
    } else if (message.includes("PDF") || message.includes("pdf")) {
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
  clearTransactionSelection();
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
  const netSummary = getNetExpenseSummary(transactions);
  return {
    month,
    transactions,
    expenses: netSummary.netExpenses,
    refunds: netSummary.refunds,
    totalExpense: netSummary.totalExpense,
    category: aggregateNet(netSummary.netExpenses, netSummary.unpairedRefunds, "category"),
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
  const sourcePlatform = item.sourcePlatform === "合并账单" ? "合并账单" : getTransactionSourcePlatform(item);
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
  clearTransactionSelection();
  populateMonthFilter(allTransactions);
  renderSelectedMonth(document.getElementById("monthFilter").value);
  markSaved(`已从本地恢复 ${allTransactions.length} 笔交易。`);
}

function clearStoredTransactions() {
  localStorage.removeItem(STORAGE_KEY);
  allTransactions = [];
  pendingFiles = [];
  clearTransactionSelection();
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
  const netSummary = getNetExpenseSummary(transactions);
  const expenses = netSummary.netExpenses;
  const incomes = netSummary.incomes;
  const refunds = netSummary.refunds;
  const totalIncome = sum(incomes);
  const totalRefund = netSummary.totalRefund;
  const totalExpense = netSummary.totalExpense;
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
    category: aggregateNet(expenses, netSummary.unpairedRefunds, "category"),
    platform: aggregateNet(expenses, netSummary.unpairedRefunds, "platform"),
    unpairedRefunds: netSummary.unpairedRefunds,
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
      console.error("[Alipay Backend Parse Required Failed]", error);
      throw new Error("支付宝 PDF 需要启动后端解析服务。请先启动 backend：uvicorn main:app --reload --host 127.0.0.1 --port 8000，然后重新上传支付宝账单。");
    }
  }

  const fallbackRows = parsePdfLines(lines, file.name);
  console.info("[PDF Parser] fallback rows", fallbackRows.length);
  console.info("[SpendScope PDF] parser=fallback rows=%d lines=%d", fallbackRows.length, lines.length);
  if (!fallbackRows.length && isBankOfChinaPdfText(text, file.name)) {
    throw new Error("未识别到中国银行交易明细，请检查账单是否为文字型 PDF，或尝试导出 Excel/CSV 格式。");
  }
  return fallbackRows;
}

function configurePdfJsWorker(pdfjsLib) {
  if (!pdfjsLib?.GlobalWorkerOptions) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
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

function normalizeRow(row) {
  const fields = mapFields(row);
  const amount = parseAmount(fields.amount, row);
  const date = parseDate(fields.time);
  const wechatTypeResult = row.__wechatTypeResult || {};
  let type = wechatTypeResult.type || normalizeAlipayTransactionTypeText(fields.type, row) || detectType(fields.type, amount, row);
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
    needsReview: Boolean(row.needsReview),
  };

  const finalResult = applyAlipayClassificationRules(result, row);
  if (isBankOfChinaFinalDebugTarget(finalResult)) {
    console.log("[BOC Final Tx Debug]", finalResult);
  }
  return finalResult;
}

function isBankOfChinaFinalDebugTarget(transaction) {
  return (
    transaction?.sourcePlatform === "中国银行" &&
    (Math.abs(Number(transaction.amount || 0)) === 3000 || /王伟/.test(`${transaction.merchant || ""} ${transaction.description || ""}`))
  );
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
  return applyCrossPlatformDedup(transactions);
}

function mapFields(row) {
  return Object.fromEntries(
    Object.entries(FIELD_ALIASES).map(([key, aliases]) => {
      const header = aliases.map((alias) => Object.keys(row).find((name) => sameHeader(name, alias))).find(Boolean);
      return [key, header ? cleanCell(row[header]) : ""];
    })
  );
}

function sameHeader(name, alias) {
  return String(name).trim().toLowerCase().replace(/\s/g, "") === alias.toLowerCase().replace(/\s/g, "");
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
  if (["待确认", "已合并"].includes(category)) return category;
  const options = getCategoryOptions(type);
  if (options.includes(category)) return category;
  return inferCategory(type, input);
}

function getNetExpenseSummary(transactions) {
  const expenses = transactions.filter((item) => item.type === "支出");
  const incomes = transactions.filter((item) => item.type === "收入");
  const refunds = transactions.filter((item) => item.type === "退款");
  const pairedRefunds = refunds.filter((item) => item.refundGroupKey);
  const unpairedRefunds = refunds.filter((item) => !item.refundGroupKey);
  const pairedRefundAmount = sum(pairedRefunds);
  const unpairedRefundAmount = sum(unpairedRefunds);
  const totalRefund = pairedRefundAmount + unpairedRefundAmount;
  const refundAmountByGroup = pairedRefunds.reduce((groups, refund) => {
    groups.set(refund.refundGroupKey, (groups.get(refund.refundGroupKey) || 0) + Number(refund.amount || 0));
    return groups;
  }, new Map());

  const grossExpense = sum(expenses);
  const pairedOriginalExpenses = expenses.filter((item) => item.refundPairRole === "originalExpense" && item.refundGroupKey);
  const netExpenses = expenses.reduce((items, item) => {
    if (item.refundPairRole !== "originalExpense" || !item.refundGroupKey) {
      items.push(item);
      return items;
    }

    const explicitRefundedAmount = Number(item.refundedAmount);
    const matchedRefundAmount = Number.isFinite(explicitRefundedAmount) ? explicitRefundedAmount : refundAmountByGroup.get(item.refundGroupKey) || 0;
    const netAmount = Math.max(0, Number(item.amount || 0) - matchedRefundAmount);
    if (netAmount > 0) {
      items.push({
        ...item,
        amount: roundMoneyAmount(netAmount),
        originalAmount: item.amount,
        refundedAmount: roundMoneyAmount(matchedRefundAmount),
      });
    }
    return items;
  }, []);
  const totalExpense = Math.max(0, sum(netExpenses) - unpairedRefundAmount);

  console.info("[Refund Net Summary]", {
    transactions: transactions.length,
    grossExpense,
    pairedRefundAmount,
    unpairedRefundAmount,
    totalRefund,
    totalExpense,
    pairedOriginalExpenses: pairedOriginalExpenses.length,
    pairedRefunds: pairedRefunds.length,
    unpairedRefunds: unpairedRefunds.length,
  });
  console.info("[Refund Net Stats Applied]", {
    transactions: transactions.length,
    netExpenses: netExpenses.length,
    grossExpense,
    pairedRefundAmount,
    unpairedRefundAmount,
    totalRefund,
    totalExpense,
  });

  return {
    expenses,
    netExpenses,
    incomes,
    refunds,
    pairedRefunds,
    unpairedRefunds,
    grossExpense,
    pairedRefundAmount,
    unpairedRefundAmount,
    totalRefund,
    totalExpense,
  };
}

function renderDashboard(transactions) {
  const netExpenseSummary = getNetExpenseSummary(transactions);
  const expenses = netExpenseSummary.netExpenses;
  const incomes = netExpenseSummary.incomes;
  const refunds = netExpenseSummary.refunds;
  const unpairedRefunds = netExpenseSummary.unpairedRefunds;
  const totalIncome = sum(incomes);
  const totalRefund = netExpenseSummary.totalRefund;
  const totalExpense = netExpenseSummary.totalExpense;
  const net = totalIncome - totalExpense;

  document.getElementById("totalIncome").textContent = money.format(totalIncome);
  document.getElementById("totalExpense").textContent = money.format(totalExpense);
  document.getElementById("netAmount").textContent = money.format(net);
  document.getElementById("expenseCount").textContent = expenses.length;

  renderChart("categoryChart", "pie", aggregateNet(expenses, unpairedRefunds, "category"), "分类支出");
  renderChart("platformChart", "bar", aggregateNet(expenses, unpairedRefunds, "platform"), "平台支出");
  renderDailyChart(expenses, unpairedRefunds);
  document.getElementById("aiSummary").textContent = "正在整理你的月度消费洞察…";
  renderSummary({ transactions, expenses, incomes, refunds, unpairedRefunds, totalIncome, totalExpense, totalRefund, net });
  currentTableTransactions = sortTransactionsForTable(transactions);
  updateFilterOptions();
  applyTableFilters();
  renderBudgetPanel();
}

function sortTransactionsForTable(transactions) {
  return sortTransactionsForDisplay(transactions);
}

function sortTransactionsForDisplay(transactions) {
  const duplicateGroupMap = buildDuplicateGroupMap(transactions);
  const refundGroupMap = buildRefundGroupMap(transactions);

  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((a, b) => {
      const groupA = getDisplaySortInfo(a.transaction, duplicateGroupMap, refundGroupMap);
      const groupB = getDisplaySortInfo(b.transaction, duplicateGroupMap, refundGroupMap);

      if (groupA.type && groupA.type === groupB.type && groupA.key && groupA.key === groupB.key) {
        const roleOrderA = getDisplayPairRoleOrder(a.transaction, groupA.type);
        const roleOrderB = getDisplayPairRoleOrder(b.transaction, groupB.type);
        if (roleOrderA !== roleOrderB) return roleOrderA - roleOrderB;
        const timeDiff = getTransactionTimeValue(b.transaction) - getTransactionTimeValue(a.transaction);
        if (timeDiff !== 0) return timeDiff;
        return a.index - b.index;
      }

      if (groupA.time !== groupB.time) return groupB.time - groupA.time;

      const timeDiff = getTransactionTimeValue(b.transaction) - getTransactionTimeValue(a.transaction);
      if (timeDiff !== 0) return timeDiff;
      return a.index - b.index;
    })
    .map(({ transaction }) => transaction);
}

function buildDuplicateGroupMap(transactions) {
  return transactions.reduce((groups, transaction) => {
    if (!transaction.duplicateGroupKey) return groups;
    const group = groups.get(transaction.duplicateGroupKey) || { primaryTime: null };
    if (["primaryPayment", "primaryPlatformRecord", "primaryTransfer"].includes(transaction.duplicatePairRole)) {
      group.primaryTime = getTransactionTimeValue(transaction);
    }
    groups.set(transaction.duplicateGroupKey, group);
    return groups;
  }, new Map());
}

function getDuplicateSortInfo(transaction, duplicateGroupMap) {
  const key = transaction.duplicateGroupKey || "";
  const group = key ? duplicateGroupMap.get(key) : null;
  const fallbackTime = getTransactionTimeValue(transaction);
  return {
    key,
    time: Number.isFinite(group?.primaryTime) ? group.primaryTime : fallbackTime,
  };
}

function buildRefundGroupMap(transactions) {
  return transactions.reduce((groups, transaction) => {
    if (!transaction.refundGroupKey) return groups;
    const group = groups.get(transaction.refundGroupKey) || { originalTime: null };
    if (transaction.refundPairRole === "originalExpense") {
      group.originalTime = getTransactionTimeValue(transaction);
    }
    groups.set(transaction.refundGroupKey, group);
    return groups;
  }, new Map());
}

function getRefundSortInfo(transaction, refundGroupMap) {
  const key = transaction.refundGroupKey || "";
  const group = key ? refundGroupMap.get(key) : null;
  const fallbackTime = getTransactionTimeValue(transaction);
  return {
    key,
    time: Number.isFinite(group?.originalTime) ? group.originalTime : fallbackTime,
  };
}

function getDisplaySortInfo(transaction, duplicateGroupMap, refundGroupMap) {
  const duplicateInfo = getDuplicateSortInfo(transaction, duplicateGroupMap);
  if (duplicateInfo.key) {
    return { ...duplicateInfo, type: "duplicate" };
  }

  const refundInfo = getRefundSortInfo(transaction, refundGroupMap);
  if (refundInfo.key) {
    return { ...refundInfo, type: "refund" };
  }

  return {
    key: "",
    type: "",
    time: getTransactionTimeValue(transaction),
  };
}

function getDisplayPairRoleOrder(transaction, groupType) {
  if (groupType === "duplicate") return getDuplicatePairRoleOrder(transaction);
  if (groupType === "refund") return getRefundPairRoleOrder(transaction);
  return 2;
}

function getDuplicatePairRoleOrder(transaction) {
  if (["primaryPayment", "primaryPlatformRecord", "primaryTransfer"].includes(transaction.duplicatePairRole)) return 0;
  if (["bankDuplicate", "bankTransferDuplicate"].includes(transaction.duplicatePairRole)) return 1;
  return 2;
}

function getRefundPairRoleOrder(transaction) {
  if (transaction.refundPairRole === "originalExpense") return 0;
  if (transaction.refundPairRole === "refund") return 1;
  return 2;
}

function getTransactionTimeValue(transaction) {
  const value = transaction?.date instanceof Date ? transaction.date.getTime() : new Date(transaction?.date).getTime();
  return Number.isFinite(value) ? value : 0;
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
  const refundAdjustments = stats.unpairedRefunds || stats.refunds;
  const category = aggregateNet(stats.expenses, refundAdjustments, "category");
  const platform = aggregateNet(stats.expenses, refundAdjustments, "platform");
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
  ensureTransactionTableSelectionHeader();
  const tbody = document.getElementById("transactionTable");
  const hint = document.getElementById("tableHint");
  const displayPage = filteredCount ? currentTablePage : 0;
  hint.textContent = `共 ${filteredCount} 条明细，当前显示第 ${displayPage} / ${totalPages} 页`;
  updateTransactionSelectionControls();

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row">${total ? "没有符合条件的明细" : "还没有账单数据，上传账单后将在这里显示整理后的明细。"}</td></tr>`;
    return;
  }

  const displayRows = buildTableDisplayRows(rows);
  tbody.innerHTML = displayRows
    .map(
      (entry) => {
        if (entry.kind === "duplicateExpanded") return renderDuplicateExpandedRow(entry.item);
        if (entry.kind === "refundOffsetParent") return renderRefundOffsetParentRow(entry.item, entry.children);
        if (entry.kind === "refundOffsetExpanded") return renderRefundOffsetExpandedRow(entry.item);
        if (entry.kind === "mergeExpanded") return renderMergeExpandedRow(entry.item);
        return renderTransactionTableRow(entry.item, entry.duplicateChildren, entry.mergeChildren);
      }
    )
    .join("");
}

function buildTableDisplayRows(rows) {
  if (isDuplicateOnlyFilterActive()) {
    return rows.map((item) => ({ kind: "transaction", item, duplicateChildren: [], mergeChildren: [] }));
  }

  const duplicatesByGroup = rows.reduce((groups, item) => {
    if (!["bankDuplicate", "bankTransferDuplicate"].includes(item.duplicatePairRole) || !item.duplicateGroupKey) return groups;
    const children = groups.get(item.duplicateGroupKey) || [];
    children.push(item);
    groups.set(item.duplicateGroupKey, children);
    return groups;
  }, new Map());
  const mergeChildrenByGroup = rows.reduce((groups, item) => {
    if (item.mergePairRole !== "mergedChild" || !item.mergeGroupKey) return groups;
    const children = groups.get(item.mergeGroupKey) || [];
    children.push(item);
    groups.set(item.mergeGroupKey, children);
    return groups;
  }, new Map());
  const refundOffsetChildrenByGroup = rows.reduce((groups, item) => {
    if (!isFullRefundOffsetDisplayItem(item)) return groups;
    const children = groups.get(item.refundGroupKey) || [];
    children.push(item);
    groups.set(item.refundGroupKey, children);
    return groups;
  }, new Map());
  refundOffsetChildrenByGroup.forEach((children) => {
    children.sort((a, b) => getRefundPairRoleOrder(a) - getRefundPairRoleOrder(b) || getTransactionTimeValue(a) - getTransactionTimeValue(b));
  });

  return rows.flatMap((item) => {
    if (["bankDuplicate", "bankTransferDuplicate"].includes(item.duplicatePairRole) && item.duplicateGroupKey) return [];
    if (isFullRefundOffsetDisplayItem(item)) {
      if (item.refundPairRole !== "originalExpense") return [];
      const children = refundOffsetChildrenByGroup.get(item.refundGroupKey) || [];
      const parent = createRefundOffsetDisplayParent(item, children);
      const expandedChildren = expandedRefundOffsetGroups.has(item.refundGroupKey)
        ? children.map((child) => ({ kind: "refundOffsetExpanded", item: child }))
        : [];
      return [{ kind: "refundOffsetParent", item: parent, children }, ...expandedChildren];
    }
    if (item.mergePairRole === "mergedChild" && item.mergeGroupKey) return [];
    const duplicateChildren = ["primaryPayment", "primaryPlatformRecord", "primaryTransfer"].includes(item.duplicatePairRole) ? duplicatesByGroup.get(item.duplicateGroupKey) || [] : [];
    const mergeChildren = item.isMergedParent ? mergeChildrenByGroup.get(item.mergeGroupKey) || [] : [];
    const expandedDuplicateChildren = expandedDuplicateGroups.has(item.duplicateGroupKey)
      ? duplicateChildren.map((child) => ({ kind: "duplicateExpanded", item: child }))
      : [];
    const expandedMergeChildren = expandedMergeGroups.has(item.mergeGroupKey) ? mergeChildren.map((child) => ({ kind: "mergeExpanded", item: child })) : [];
    return [{ kind: "transaction", item, duplicateChildren, mergeChildren }, ...expandedDuplicateChildren, ...expandedMergeChildren];
  });
}

function isFullRefundOffsetDisplayItem(item) {
  return Boolean(
    item?.refundGroupKey &&
      item.type === "排除" &&
      item.category === "抵消" &&
      item.originalTypeBeforeRefundOffset &&
      ["originalExpense", "refund"].includes(item.refundPairRole)
  );
}

function createRefundOffsetDisplayParent(originalExpense, children) {
  return {
    id: `refund-offset-parent-${originalExpense.refundGroupKey}`,
    editDescriptionTargetId: originalExpense.id,
    date: originalExpense.date,
    time: originalExpense.time,
    sourcePlatform: originalExpense.sourcePlatform || getDisplaySourcePlatform(originalExpense),
    platform: originalExpense.platform || "-",
    merchant: originalExpense.merchant || "-",
    description: getTransactionDescriptionSummary(originalExpense),
    transactionType: originalExpense.transactionType || "-",
    type: "排除",
    category: "抵消",
    amount: 0,
    refundGroupKey: originalExpense.refundGroupKey,
    refundOffsetChildrenCount: children.length,
    isRefundOffsetParent: true,
  };
}

function isDuplicateOnlyFilterActive() {
  return tableFilters.type === "排除" || tableFilters.category === "重复扣款";
}

function renderTransactionTableRow(item, duplicateChildren = [], mergeChildren = []) {
  const displayTime = formatTableTime(item.time);
  const duplicateToggle = duplicateChildren.length ? renderDuplicateToggle(item.duplicateGroupKey) : "";
  const mergeToggle = mergeChildren.length ? renderMergeToggle(item.mergeGroupKey) : "";
  const mergeSelectControl = renderMergeSelectControl(item);
  const rowClasses = [
    "selectable-row",
    selectedTransactionIds.has(item.id) ? "is-merge-selected" : "",
    item.isMergedParent ? "merged-parent-row" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <tr class="${escapeHtml(rowClasses)}" data-id="${escapeHtml(item.id)}">
      <td data-label="时间" class="time-cell">
        ${renderTransactionTime(displayTime)}
        ${duplicateToggle}
        ${mergeToggle}
      </td>
      <td data-label="账单来源" class="source-cell">${escapeHtml(getDisplaySourcePlatform(item))}</td>
      <td data-label="收/付款方式" class="payment-cell">${escapeHtml(item.platform || "-")}</td>
      <td data-label="交易对方" class="merchant-cell">${escapeHtml(item.merchant || "-")}</td>
      <td data-label="交易说明" class="description-cell">
        ${renderEditableDescription(item)}
      </td>
      <td data-label="类别">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell">${mergeSelectControl}</td>
    </tr>
  `;
}

function ensureTransactionTableSelectionHeader() {
  const headerRow = transactionTable?.closest("table")?.querySelector("thead tr");
  if (!headerRow || headerRow.querySelector("th.selection-header")) return;
  const selectionHeader = document.createElement("th");
  selectionHeader.className = "selection-header";
  selectionHeader.textContent = "选择";
  headerRow.appendChild(selectionHeader);
}

function renderEditableDescription(item) {
  const value = getTransactionDescriptionSummary(item);
  const editTargetId = item.editDescriptionTargetId || item.id || "";
  return `
    <div class="description-main editable-description"
      contenteditable="true"
      data-edit-description-id="${escapeHtml(editTargetId)}"
      data-original-value="${escapeHtml(value || "-")}">${escapeHtml(value || "-")}</div>
  `;
}

function renderTransactionTime(displayTime) {
  return `
    <div class="transaction-time">
      <span class="time-date">${escapeHtml(displayTime.date)}</span>
      ${displayTime.clock ? `<span class="time-clock">${escapeHtml(displayTime.clock)}</span>` : ""}
    </div>
  `;
}

function renderDuplicateToggle(groupKey) {
  const isExpanded = expandedDuplicateGroups.has(groupKey);
  return `
    <button class="duplicate-toggle time-duplicate-toggle" type="button" data-duplicate-group="${escapeHtml(groupKey || "")}" title="银行重复扣款">
      ${isExpanded ? "▾" : "▸"}
    </button>
  `;
}

function renderRefundOffsetToggle(groupKey) {
  const isExpanded = expandedRefundOffsetGroups.has(groupKey);
  return `
    <button class="duplicate-toggle time-duplicate-toggle" type="button" data-refund-offset-group="${escapeHtml(groupKey || "")}" title="展开抵消明细">
      ${isExpanded ? "▾" : "▸"}
    </button>
  `;
}

function renderMergeToggle(groupKey) {
  const isExpanded = expandedMergeGroups.has(groupKey);
  return `
    <button class="merge-toggle time-merge-toggle" type="button" data-merge-group="${escapeHtml(groupKey || "")}" title="展开合并明细">
      ${isExpanded ? "▾" : "▸"}
    </button>
  `;
}

function renderMergeSelectControl(item) {
  if (!isSelectableForSelection(item)) return "";
  const selected = selectedTransactionIds.has(item.id);
  return `
    <button class="merge-select merge-select-control ${selected ? "is-selected" : ""}" type="button" data-transaction-select-id="${escapeHtml(item.id)}" aria-label="${selected ? "取消选择" : "选择"}这条明细">
      ${selected ? "✓" : ""}
    </button>
  `;
}

function isSelectableForSelection(item) {
  return Boolean(item?.id && item.mergePairRole !== "mergedChild");
}

function isSelectableForManualMerge(item) {
  return Boolean(item?.id && !item.isMergedParent && item.mergePairRole !== "mergedChild");
}

function renderDuplicateExpandedRow(item) {
  const displayTime = formatTableTime(item.time);

  return `
    <tr class="duplicate-expanded-row" data-id="${escapeHtml(item.id)}" data-duplicate-group="${escapeHtml(item.duplicateGroupKey || "")}">
      <td data-label="时间" class="time-cell">
        ${renderTransactionTime(displayTime)}
      </td>
      <td data-label="账单来源" class="source-cell">${escapeHtml(getDisplaySourcePlatform(item))}</td>
      <td data-label="收/付款方式" class="payment-cell">${escapeHtml(item.platform || "-")}</td>
      <td data-label="交易对方" class="merchant-cell">${escapeHtml(item.merchant || "-")}</td>
      <td data-label="交易说明" class="description-cell">
        ${renderEditableDescription(item)}
      </td>
      <td data-label="类别">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell"></td>
    </tr>
  `;
}

function renderStaticTableValue(value, extraClass = "") {
  return `<span class="table-static-value ${extraClass}">${escapeHtml(value || "-")}</span>`;
}

function renderRefundOffsetParentRow(item, children = []) {
  const displayTime = formatTableTime(item.time);
  const toggle = children.length ? renderRefundOffsetToggle(item.refundGroupKey) : "";

  return `
    <tr class="selectable-row refund-offset-parent-row" data-id="${escapeHtml(item.id || "")}" data-refund-offset-group="${escapeHtml(item.refundGroupKey || "")}">
      <td data-label="时间" class="time-cell">
        ${renderTransactionTime(displayTime)}
        ${toggle}
      </td>
      <td data-label="账单来源" class="source-cell">${escapeHtml(item.sourcePlatform || "-")}</td>
      <td data-label="收/付款方式" class="payment-cell">${escapeHtml(item.platform || "-")}</td>
      <td data-label="交易对方" class="merchant-cell">${escapeHtml(item.merchant || "-")}</td>
      <td data-label="交易说明" class="description-cell">
        ${renderEditableDescription(item)}
      </td>
      <td data-label="类别">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell excluded">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell">${renderMergeSelectControl(item)}</td>
    </tr>
  `;
}

function renderRefundOffsetExpandedRow(item) {
  const displayItem = {
    ...item,
    type: item.originalTypeBeforeRefundOffset || item.type,
    category: item.originalCategoryBeforeRefundOffset || item.category,
  };
  const displayTime = formatTableTime(displayItem.time);

  return `
    <tr class="duplicate-expanded-row refund-offset-expanded-row" data-id="${escapeHtml(item.id || "")}" data-refund-offset-group="${escapeHtml(item.refundGroupKey || "")}">
      <td data-label="时间" class="time-cell">
        ${renderTransactionTime(displayTime)}
      </td>
      <td data-label="账单来源" class="source-cell">${escapeHtml(getDisplaySourcePlatform(displayItem))}</td>
      <td data-label="收/付款方式" class="payment-cell">${escapeHtml(displayItem.platform || "-")}</td>
      <td data-label="交易对方" class="merchant-cell">${escapeHtml(displayItem.merchant || "-")}</td>
      <td data-label="交易说明" class="description-cell">
        ${renderEditableDescription(displayItem)}
      </td>
      <td data-label="类别">${renderCategorySelect(displayItem)}</td>
      <td data-label="收支类型">${renderTypeSelect(displayItem)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(displayItem.type)}">${formatDisplayAmount(displayItem)}</td>
      <td data-label="选择" class="select-cell"></td>
    </tr>
  `;
}

function renderMergeExpandedRow(item) {
  const displayTime = formatTableTime(item.time);

  return `
    <tr class="merge-expanded-row" data-id="${escapeHtml(item.id)}" data-merge-group="${escapeHtml(item.mergeGroupKey || "")}">
      <td data-label="时间" class="time-cell">
        ${renderTransactionTime(displayTime)}
      </td>
      <td data-label="账单来源" class="source-cell">${escapeHtml(getDisplaySourcePlatform(item))}</td>
      <td data-label="收/付款方式" class="payment-cell">${escapeHtml(item.platform || "-")}</td>
      <td data-label="交易对方" class="merchant-cell">${escapeHtml(item.merchant || "-")}</td>
      <td data-label="交易说明" class="description-cell">
        ${renderEditableDescription(item)}
      </td>
      <td data-label="类别">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell"></td>
    </tr>
  `;
}

function handleTransactionTableClick(event) {
  const mergeSelect = event.target.closest(".merge-select");
  if (mergeSelect) {
    event.preventDefault();
    event.stopPropagation();
    toggleTransactionSelection(mergeSelect.dataset.transactionSelectId || "");
    return;
  }

  const mergeToggle = event.target.closest(".merge-toggle");
  if (mergeToggle) {
    event.preventDefault();
    event.stopPropagation();
    const groupKey = mergeToggle.dataset.mergeGroup || "";
    if (!groupKey) return;
    if (expandedMergeGroups.has(groupKey)) {
      expandedMergeGroups.delete(groupKey);
    } else {
      expandedMergeGroups.add(groupKey);
    }
    applyTableFilters();
    return;
  }

  const refundOffsetToggle = event.target.closest("button[data-refund-offset-group]");
  if (refundOffsetToggle) {
    event.preventDefault();
    event.stopPropagation();
    const groupKey = refundOffsetToggle.dataset.refundOffsetGroup || "";
    if (!groupKey) return;
    if (expandedRefundOffsetGroups.has(groupKey)) {
      expandedRefundOffsetGroups.delete(groupKey);
    } else {
      expandedRefundOffsetGroups.add(groupKey);
    }
    applyTableFilters();
    return;
  }

  const toggle = event.target.closest(".duplicate-toggle");
  if (!toggle) return;

  event.preventDefault();
  event.stopPropagation();
  const groupKey = toggle.dataset.duplicateGroup || "";
  if (!groupKey) return;

  if (expandedDuplicateGroups.has(groupKey)) {
    expandedDuplicateGroups.delete(groupKey);
  } else {
    expandedDuplicateGroups.add(groupKey);
  }
  applyTableFilters();
}

function updateTransactionSelectionControls() {
  const selected = getSelectedTransactions();
  const selectedCount = selected.length;
  const canMerge = selected.length >= 2 && !selected.some((item) => item.mergePairRole === "mergedChild");
  const canSplit = selected.length === 1 && selected[0]?.isMergedParent === true;
  if (cancelManualMergeButton) {
    cancelManualMergeButton.textContent = `已选 ${selectedCount} 条`;
  }
  startManualMergeButton.disabled = !canMerge;
  confirmManualMergeButton.disabled = !canSplit;
}

function toggleTransactionSelection(id) {
  if (!id) return;
  const transaction = findSelectableTransactionById(id);
  if (!transaction || !isSelectableForSelection(transaction)) return;
  if (selectedTransactionIds.has(id)) {
    selectedTransactionIds.delete(id);
  } else {
    selectedTransactionIds.add(id);
  }
  updateTransactionSelectionControls();
  applyTableFilters();
}

function openManualMergeModal() {
  const selectedItems = getSelectedTransactions();
  if (selectedItems.some((item) => item.mergePairRole === "mergedChild")) {
    setStatus("合并子明细不能再次合并，请先拆分原合并账单。");
    return;
  }
  if (selectedItems.some((item) => item.isMergedParent)) {
    setStatus("已合并账单不能再次合并，请先拆分原合并账单。");
    return;
  }

  pendingMergeItems = selectedItems.filter((item) => isSelectableForManualMerge(item));
  if (pendingMergeItems.length < 2) {
    setStatus("请至少选择 2 条明细进行合并");
    return;
  }

  const defaults = getManualMergeDefaults(pendingMergeItems);
  const merchantOptions = getManualMergeMerchantOptions(pendingMergeItems);
  const descriptionOptions = getManualMergeDescriptionOptions(pendingMergeItems);
  mergeTimeInput.value = defaults.time;
  mergeSourcePlatformInput.value = defaults.sourcePlatform;
  mergePlatformInput.value = defaults.platform;
  mergeMerchantInput.value = defaults.merchant;
  renderMergeMerchantOptions(merchantOptions);
  mergeDescriptionInput.value = defaults.description;
  renderMergeDescriptionOptions(descriptionOptions);
  mergeTypeSelect.value = defaults.type;
  renderMergeCategoryOptions(defaults.type, defaults.category);
  mergeCategorySelect.value = defaults.category;
  updateMergeAmountBreakdown(defaults.type, { force: true });
  mergeMemoInput.value = "";
  mergeMessage.textContent = defaults.type === "待确认" ? "选中的明细收支类型不一致，请确认收支类型和金额。" : "";
  mergePreview.innerHTML = `已选择 ${pendingMergeItems.length} 条明细，原始明细会保留并标记为已合并。`;
  mergeModal.classList.remove("hidden");
}

function closeManualMergeModal() {
  mergeModal.classList.add("hidden");
  pendingMergeItems = [];
  mergeMessage.textContent = "";
}

function getSelectedTransactions() {
  return Array.from(selectedTransactionIds)
    .map((id) => findSelectableTransactionById(id))
    .filter(Boolean);
}

function findSelectableTransactionById(id) {
  if (!id) return null;
  return allTransactions.find((item) => item.id === id) || currentTableTransactions.find((item) => item.id === id) || null;
}

function clearTransactionSelection() {
  selectedTransactionIds.clear();
  updateTransactionSelectionControls();
}

function splitSelectedMergedBill() {
  const selectedItems = getSelectedTransactions();
  const mergedParents = selectedItems.filter((item) => item.isMergedParent);
  const normalItems = selectedItems.filter((item) => !item.isMergedParent);

  if (!mergedParents.length) {
    setStatus(normalItems.length ? "普通明细不能拆分，只有已合并账单可以拆分。" : "请选择需要拆分的合并账单。");
    return;
  }
  if (mergedParents.length > 1) {
    setStatus("请一次只拆分一条合并账单。");
    return;
  }
  if (normalItems.length) {
    setStatus("普通明细不能拆分，只有已合并账单可以拆分。");
    return;
  }

  confirmSplitMergedBill(mergedParents[0]);
}

function confirmSplitMergedBill(parentTransaction) {
  if (!parentTransaction?.isMergedParent) return;
  const confirmed = window.confirm("确定要拆分这条合并账单吗？拆分后，合并明细将删除，原始明细会恢复为普通账单。");
  if (!confirmed) return;
  splitMergedBill(parentTransaction);
}

function splitMergedBill(parentTransaction) {
  if (!parentTransaction?.isMergedParent) return;
  const groupKey = parentTransaction.mergeGroupKey || "";
  const children = getMergedChildren(parentTransaction);

  if (!children.length) {
    console.warn("[Manual Merge Split Warning] No merged children found", parentTransaction);
  }

  allTransactions = allTransactions
    .filter((item) => !isSameMergedParent(item, parentTransaction))
    .map((item) => {
      if (!children.some((child) => child.id === item.id)) return item;
      return restoreMergedChild(item);
    });

  if (groupKey) expandedMergeGroups.delete(groupKey);
  clearTransactionSelection();
  resetTablePage();
  renderSelectedMonth(document.getElementById("monthFilter").value);
  saveTransactionsToStorage();
  markUnsaved();
  setStatus(`已拆分合并账单，恢复 ${children.length} 条原始明细。`);
}

function getMergedChildren(parentTransaction) {
  const groupKey = parentTransaction?.mergeGroupKey || "";
  const childIds = new Set(parentTransaction?.mergedChildrenIds || []);
  return allTransactions.filter((item) => {
    if (!item || item.id === parentTransaction.id) return false;
    const matchesGroup = groupKey && item.mergeGroupKey === groupKey && item.mergePairRole === "mergedChild";
    const matchesRecordedId = childIds.has(item.id) && item.mergePairRole === "mergedChild";
    return matchesGroup || matchesRecordedId;
  });
}

function isSameMergedParent(item, parentTransaction) {
  if (!item?.isMergedParent) return false;
  if (item.id && parentTransaction.id && item.id === parentTransaction.id) return true;
  return Boolean(parentTransaction.mergeGroupKey && item.mergeGroupKey === parentTransaction.mergeGroupKey);
}

function restoreMergedChild(child) {
  const missingOriginalFields = !child.originalTypeBeforeMerge || !child.originalCategoryBeforeMerge;
  if (missingOriginalFields) {
    console.warn("[Manual Merge Split Warning] Missing original fields", child);
  }

  const restored = {
    ...child,
    type: child.originalTypeBeforeMerge || "待确认",
    category: child.originalCategoryBeforeMerge || "其他",
    excludeReason: child.originalExcludeReasonBeforeMerge || "",
    needsReview: child.originalNeedsReviewBeforeMerge ?? missingOriginalFields,
  };

  delete restored.mergePairRole;
  delete restored.mergeGroupKey;
  delete restored.originalTypeBeforeMerge;
  delete restored.originalCategoryBeforeMerge;
  delete restored.originalExcludeReasonBeforeMerge;
  delete restored.originalNeedsReviewBeforeMerge;
  delete restored.originalAmountBeforeMerge;
  if (restored.excludeReason === "已合并到账单") delete restored.excludeReason;

  return restored;
}

function getManualMergeDefaults(items) {
  const latest = items.slice().sort((a, b) => getTransactionTimeValue(b) - getTransactionTimeValue(a))[0];
  const sourcePlatforms = uniqueNonEmpty(items.map((item) => getDisplaySourcePlatform(item)));
  const platforms = uniqueNonEmpty(items.map((item) => item.platform));
  const merchants = getManualMergeMerchantOptions(items);
  const categories = uniqueNonEmpty(items.map((item) => item.category));
  const suggestion = calculateMergeAmountSuggestion(items, "");
  const type = suggestion.defaultType;
  const category = suggestion.isFullyOffset ? "抵消" : categories.length === 1 ? categories[0] : "待确认";

  return {
    time: latest?.time || formatDateTime(new Date()),
    sourcePlatform: sourcePlatforms.length === 1 ? sourcePlatforms[0] : "合并账单",
    platform: platforms.length === 1 ? platforms[0] : "多方式",
    merchant: merchants.length === 1 ? merchants[0] : "合并账单",
    description: `手动合并 ${items.length} 条明细`,
    category,
    type,
    amount: suggestion.suggestedAmount,
  };
}

function getManualMergeMerchantOptions(items) {
  return uniqueNonEmpty(
    items.map((item) => item.merchant || item.counterparty || item.payee || item.traderName || "")
  );
}

function renderMergeMerchantOptions(options) {
  mergeMerchantOptions.innerHTML = options.map((option) => `<option value="${escapeHtml(option)}"></option>`).join("");
}

function getManualMergeDescriptionOptions(items) {
  return uniqueNonEmpty(
    items.map((item) => item.description || item.remark || item["商品说明"] || item["交易说明"] || getTransactionDescriptionSummary(item) || "")
  );
}

function renderMergeDescriptionOptions(options) {
  mergeDescriptionOptions.innerHTML = options.map((option) => `<option value="${escapeHtml(option)}"></option>`).join("");
}

function uniqueNonEmpty(values) {
  return Array.from(new Set(values.map((value) => cleanCell(value || "")).filter(Boolean)));
}

function getManualMergeAmountForType(items, type) {
  return calculateMergeAmountSuggestion(items, type).suggestedAmount || 0;
}

function getManualMergeAmountParts(items, type) {
  if (type === "支出") return items.filter((item) => item.type === "支出").map((item) => Number(item.amount || 0)).filter((amount) => amount > 0);
  if (type === "收入") return items.filter((item) => item.type === "收入").map((item) => Number(item.amount || 0)).filter((amount) => amount > 0);
  if (type === "退款") return items.filter((item) => item.type === "退款").map((item) => Number(item.amount || 0)).filter((amount) => amount > 0);
  return [];
}

function handleMergeTypeChange() {
  const type = mergeTypeSelect.value;
  const currentCategory = mergeCategorySelect.value || "待确认";
  const suggestion = calculateMergeAmountSuggestion(pendingMergeItems, type);
  const nextCategory = suggestion.isFullyOffset && type === "排除" ? "抵消" : currentCategory;
  renderMergeCategoryOptions(type, nextCategory);
  mergeCategorySelect.value = nextCategory;
  updateMergeAmountBreakdown(type);
}

function updateMergeAmountBreakdown(type, options = {}) {
  const previousAutoAmount = lastAutoMergeAmount;
  const suggestion = calculateMergeAmountSuggestion(pendingMergeItems, type);
  const nextAutoText = suggestion.hasAutoAmount ? String(suggestion.suggestedAmount) : "";
  mergeAmountBreakdown.innerHTML = renderMergeAmountBreakdown(suggestion);

  const canAutoFill = options.force || !mergeAmountInput.value || mergeAmountInput.value === previousAutoAmount;
  if (canAutoFill) {
    mergeAmountInput.value = nextAutoText;
  }
  lastAutoMergeAmount = nextAutoText;
}

function calculateMergeAmountSuggestion(items, selectedType) {
  const expenseParts = getManualMergeAmountParts(items, "支出");
  const incomeParts = getManualMergeAmountParts(items, "收入");
  const refundParts = getManualMergeAmountParts(items, "退款");
  const expenseTotal = roundMoneyAmount(expenseParts.reduce((sumValue, amount) => sumValue + amount, 0));
  const incomeTotal = roundMoneyAmount(incomeParts.reduce((sumValue, amount) => sumValue + amount, 0));
  const refundTotal = roundMoneyAmount(refundParts.reduce((sumValue, amount) => sumValue + amount, 0));
  const hasExpenses = expenseTotal > 0;
  const hasIncomes = incomeTotal > 0;
  const isFullyOffset = hasExpenses && hasIncomes && isMoneyFullyOffset(expenseTotal, incomeTotal);
  const netExpense = roundMoneyAmount(expenseTotal - incomeTotal);
  const netIncome = roundMoneyAmount(incomeTotal - expenseTotal);
  const defaultType = getDefaultMergeType({ hasExpenses, hasIncomes, expenseTotal, incomeTotal, isFullyOffset, refundTotal });
  const effectiveType = selectedType || defaultType;
  const formulaLines = [];
  let suggestedAmount = 0;
  let hasAutoAmount = false;
  let warningMessage = "";

  if (isFullyOffset && (!selectedType || selectedType === "排除")) {
    formulaLines.push(renderMergeAmountLine("支出合计", expenseParts));
    formulaLines.push(renderMergeAmountLine("收入抵扣", incomeParts));
    formulaLines.push(renderMergeFormulaLine("净额", expenseTotal, incomeTotal, 0));
    formulaLines.push('<div class="merge-amount-breakdown-line warning">已完全抵消，将作为“抵消”项保留，不计入收入或支出统计</div>');
    suggestedAmount = 0;
    hasAutoAmount = true;
  } else if (effectiveType === "支出") {
    formulaLines.push(renderMergeAmountLine("支出合计", expenseParts));
    if (hasIncomes) {
      formulaLines.push(renderMergeAmountLine("收入抵扣", incomeParts));
      if (netExpense > 0) {
        suggestedAmount = netExpense;
        hasAutoAmount = true;
        formulaLines.push(renderMergeFormulaLine("净支出", expenseTotal, incomeTotal, netExpense));
      } else {
        warningMessage = "收入合计已大于或等于支出合计，请确认是否应选择“收入”或手动输入金额";
        formulaLines.push(renderMergeFormulaLine("净支出", expenseTotal, incomeTotal, 0));
      }
    } else {
      suggestedAmount = expenseTotal;
      hasAutoAmount = expenseTotal > 0;
    }
  } else if (effectiveType === "收入") {
    formulaLines.push(renderMergeAmountLine("收入合计", incomeParts));
    if (hasExpenses) {
      formulaLines.push(renderMergeAmountLine("支出抵扣", expenseParts));
      if (netIncome > 0) {
        suggestedAmount = netIncome;
        hasAutoAmount = true;
        formulaLines.push(renderMergeFormulaLine("净收入", incomeTotal, expenseTotal, netIncome));
      } else {
        warningMessage = "当前组合不是净收入，请确认收支类型或手动输入金额";
        formulaLines.push(renderMergeFormulaLine("净收入", incomeTotal, expenseTotal, 0));
      }
    } else {
      suggestedAmount = incomeTotal;
      hasAutoAmount = incomeTotal > 0;
    }
  } else if (effectiveType === "退款") {
    formulaLines.push(renderMergeAmountLine("退款合计", refundParts));
    suggestedAmount = refundTotal;
    hasAutoAmount = refundTotal > 0;
  } else {
    formulaLines.push(renderMergeAmountLine("支出合计", expenseParts));
    formulaLines.push(renderMergeAmountLine("收入合计", incomeParts));
    warningMessage = "请选择收支类型，系统将自动计算净额，或手动输入金额";
  }

  if (warningMessage) {
    formulaLines.push(`<div class="merge-amount-breakdown-line warning">${escapeHtml(warningMessage)}</div>`);
  }

  return {
    expenseTotal,
    incomeTotal,
    defaultType,
    isFullyOffset,
    suggestedAmount,
    hasAutoAmount,
    formulaLines,
    warningMessage,
    canAutoFill: hasAutoAmount,
  };
}

function isMoneyFullyOffset(expenseTotal, incomeTotal) {
  return Math.abs(roundMoneyAmount(expenseTotal - incomeTotal)) <= 0.01;
}

function getDefaultMergeType({ hasExpenses, hasIncomes, expenseTotal, incomeTotal, isFullyOffset, refundTotal }) {
  if (isFullyOffset) return "排除";
  if (hasExpenses && hasIncomes) return expenseTotal > incomeTotal ? "支出" : "收入";
  if (hasExpenses) return "支出";
  if (hasIncomes) return "收入";
  if (refundTotal > 0) return "退款";
  return "待确认";
}

function renderMergeAmountBreakdown(suggestion) {
  return suggestion.formulaLines.join("");
}

function renderMergeAmountLine(label, amounts) {
  const total = roundMoneyAmount(amounts.reduce((sumValue, amount) => sumValue + amount, 0));
  const formula = amounts.length > 1
    ? `${amounts.map((amount) => money.format(amount)).join(" + ")} = ${money.format(total)}`
    : money.format(total);
  return `<div class="merge-amount-breakdown-line">${escapeHtml(label)}：${escapeHtml(formula)}</div>`;
}

function renderMergeFormulaLine(label, minuend, subtrahend, result) {
  return `<div class="merge-amount-breakdown-line">${escapeHtml(label)}：${escapeHtml(money.format(minuend))} - ${escapeHtml(money.format(subtrahend))} = ${escapeHtml(money.format(result))}</div>`;
}

function renderMergeCategoryOptions(type, selectedCategory = "待确认") {
  const normalizedType = TYPE_OPTIONS.includes(type) ? type : "支出";
  const options = mergeUnique(["待确认"], getCategoryOptions(normalizedType));
  if (selectedCategory && !options.includes(selectedCategory)) options.unshift(selectedCategory);
  mergeCategorySelect.innerHTML = options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("");
}

function createManualMergeTransaction() {
  if (pendingMergeItems.length < 2) {
    mergeMessage.textContent = "请至少选择 2 条明细。";
    return;
  }

  const parentType = mergeTypeSelect.value;
  if (!TYPE_OPTIONS.includes(parentType)) {
    mergeMessage.textContent = "请选择合并后的收支类型。";
    return;
  }

  const parentAmount = Number(mergeAmountInput.value);
  if (!Number.isFinite(parentAmount) || parentAmount < 0) {
    mergeMessage.textContent = "请输入有效的合并金额。";
    return;
  }
  if (["支出", "收入", "退款"].includes(parentType) && parentAmount <= 0) {
    mergeMessage.textContent = "支出、收入或退款类型的合并金额必须大于 0。";
    return;
  }

  const date = parseDate(mergeTimeInput.value) || new Date();
  const mergeGroupKey = `manual-merge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const childIds = pendingMergeItems.map((item) => item.id);
  const parentTransaction = {
    id: `${mergeGroupKey}-parent`,
    date,
    time: formatDateTime(date),
    sourcePlatform: cleanCell(mergeSourcePlatformInput.value) || "合并账单",
    platform: cleanCell(mergePlatformInput.value) || "多方式",
    paymentMethod: cleanCell(mergePlatformInput.value) || "多方式",
    merchant: cleanCell(mergeMerchantInput.value) || "合并账单",
    description: cleanCell(mergeDescriptionInput.value) || `手动合并 ${pendingMergeItems.length} 条明细`,
    transactionType: "手动合并",
    type: parentType,
    amount: roundMoneyAmount(parentAmount),
    category: mergeCategorySelect.value || "待确认",
    excludeReason: parentType === "排除" && (mergeCategorySelect.value === "抵消" || roundMoneyAmount(parentAmount) === 0) ? "支出收入完全抵消" : "",
    memo: cleanCell(mergeMemoInput.value),
    isMergedParent: true,
    mergeGroupKey,
    mergedChildrenIds: childIds,
  };

  const childIdSet = new Set(childIds);
  allTransactions = ensureTransactionIds([
    parentTransaction,
    ...allTransactions.map((item) => {
      if (!childIdSet.has(item.id)) return item;
      return {
        ...item,
        mergePairRole: "mergedChild",
        mergeGroupKey,
        type: "排除",
        category: "已合并",
        excludeReason: "已合并到账单",
        originalTypeBeforeMerge: item.originalTypeBeforeMerge || item.type,
        originalCategoryBeforeMerge: item.originalCategoryBeforeMerge || item.category,
        originalExcludeReasonBeforeMerge: item.originalExcludeReasonBeforeMerge ?? item.excludeReason ?? "",
        originalNeedsReviewBeforeMerge: item.originalNeedsReviewBeforeMerge ?? Boolean(item.needsReview),
        originalAmountBeforeMerge: item.originalAmountBeforeMerge ?? item.amount,
      };
    }),
  ]);

  expandedMergeGroups.add(mergeGroupKey);
  console.log("[Manual Merge Applied]", {
    mergeGroupKey,
    selectedCount: childIds.length,
    parentAmount: parentTransaction.amount,
    parentType,
    childCount: childIds.length,
  });

  closeManualMergeModal();
  clearTransactionSelection();
  resetTablePage();
  renderSelectedMonth(document.getElementById("monthFilter").value);
  saveTransactionsToStorage();
  markUnsaved();
}

function updateFilterOptions() {
  tableFilterOptions = {
    platform: uniqueSorted(currentTableTransactions.map((item) => getDisplaySourcePlatform(item))),
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
    const matchesPlatform = !tableFilters.platform || getDisplaySourcePlatform(item) === tableFilters.platform;
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

function getDisplaySourcePlatform(item) {
  const explicitSource = cleanCell(item?.sourcePlatform || item?.__sourcePlatform || item?.billSource || "");
  if (explicitSource && !["未知", "未知来源"].includes(explicitSource)) return explicitSource;
  return getTransactionSourcePlatform(item);
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
  const sortedTransactions = sortTransactionsForDisplay(filtered);
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
  const options = mergeUnique(getCategoryOptions(item.type), [category]);
  return `
    <select class="table-select category-select category-${getCategoryTone(category)}" data-field="category">
      ${options.map((option) => `<option value="${escapeHtml(option)}" ${category === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
    </select>
  `;
}

function handleDescriptionEditFocus(event) {
  const target = event.target.closest(".editable-description");
  if (!target) return;
  target.dataset.beforeEditValue = target.textContent.trim();
}

function handleDescriptionEditKeydown(event) {
  const target = event.target.closest(".editable-description");
  if (!target) return;

  if (event.key === "Enter") {
    event.preventDefault();
    target.blur();
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    target.dataset.cancelEdit = "true";
    target.textContent = target.dataset.beforeEditValue || target.dataset.originalValue || "-";
    target.blur();
  }
}

function handleDescriptionEditBlur(event) {
  const target = event.target.closest(".editable-description");
  if (!target) return;

  const id = target.dataset.editDescriptionId || "";
  const nextValue = cleanCell(target.textContent || "");
  const previousValue = target.dataset.beforeEditValue || target.dataset.originalValue || "";

  if (!id) return;
  if (target.dataset.cancelEdit === "true") {
    delete target.dataset.cancelEdit;
    target.textContent = previousValue || "-";
    return;
  }
  if (!nextValue) {
    target.textContent = previousValue || "-";
    return;
  }
  if (nextValue === previousValue) return;

  const transaction = allTransactions.find((item) => item.id === id);
  if (!transaction) return;

  transaction.description = nextValue;
  target.dataset.originalValue = nextValue;
  target.dataset.beforeEditValue = nextValue;
  target.textContent = nextValue;

  const tableTransaction = currentTableTransactions.find((item) => item.id === id);
  if (tableTransaction && tableTransaction !== transaction) {
    tableTransaction.description = nextValue;
  }

  saveTransactionsToStorage();
  markUnsaved();
  updateFilterOptions();
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

function roundMoneyAmount(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function percent(value, total) {
  return total ? `${Math.round((value / total) * 100)}%` : "0%";
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
