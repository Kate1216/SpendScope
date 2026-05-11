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
const BACKEND_BASE_URL = "http://127.0.0.1:8000";
const USE_BACKEND_BILL_UPLOAD = true;
const USE_BACKEND_STORAGE = true;

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
const ACTIVE_PAGE_KEY = "spendscope.activePage.v1";
const LOGIN_STATE_KEY = "spendscope.loginState.v1";
const TABLE_PAGE_KEY = "spendscope.tablePage.v1";
const REMOVED_BILLS_STORAGE_KEY = "spendscopeRemovedBills";
const VALID_PAGES = ["overview", "details", "trends"];
const PAGE_SIZE = 20;
const SIMILAR_SELECT_ONE_MESSAGE = "\u8bf7\u5148\u9009\u62e9\u4e00\u6761\u660e\u7ec6";
const SIMILAR_SELECT_ONLY_ONE_MESSAGE = "\u8bf7\u53ea\u9009\u62e9\u4e00\u6761\u4f5c\u4e3a\u540c\u7c7b\u8d26\u5355\u6837\u672c";
let allTransactions = [];
let isSaved = false;
let hasUnsavedChanges = false;
let customCategories = { expense: [], income: [] };
let monthlyBudgets = {};
let currentTableTransactions = [];
let currentTablePage = 1;
let isRestoringTablePage = true;
let currentAssistantStats = null;
const expandedDuplicateGroups = new Set();
const expandedRefundOffsetGroups = new Set();
let autoExpandedRefundOffsetGroups = new Set();
const expandedMergeGroups = new Set();
const selectedTransactionIds = new Set();
let pendingSimilarTransaction = null;
let pendingMergeItems = [];
let backendBillLibrary = [];
let activeBackendBillFilter = null;
let selectedBackendBills = [];
let activeBackendBillSelection = null;
let activeBackendBillMode = "empty";
let removedBackendBillKeys = loadRemovedBackendBillKeys();

const billUploader = document.getElementById("billUploader");
const uploadPanel = document.querySelector(".upload-panel");
const chooseBillFileButton = document.getElementById("chooseBillFile");
const billLibraryList = document.getElementById("billLibraryList");
const billLibraryCurrent = document.getElementById("billLibraryCurrent");
const billSelectedCount = document.getElementById("billSelectedCount");
const viewAllBackendBillsButton = document.getElementById("viewAllBackendBills");
const viewSelectedBackendBillsButton = document.getElementById("viewSelectedBackendBills");
const clearSelectedBackendBillsButton = document.getElementById("clearSelectedBackendBills");
const restoreRemovedBillsButton = document.getElementById("restoreRemovedBills");
const uploadConfirm = document.getElementById("uploadConfirm");
const saveLocalButton = document.getElementById("saveLocal");
const clearStorageButton = document.getElementById("clearStorage");
const exportExcelButton = document.getElementById("exportExcel");
const exportPdfButton = document.getElementById("exportPdf");
const transactionTable = document.getElementById("transactionTable");
const transactionDetailTitle = document.querySelector("#detailsPage .panel-heading h2");
const tableSearch = document.getElementById("tableSearch");
const clearTableFiltersButton = document.getElementById("clearTableFilters");
const tableResultStatus = document.getElementById("tableResultStatus");
const similarEditHint = document.getElementById("similarEditHint");
const tablePagination = document.getElementById("tablePagination");
const headerFilterMenu = document.getElementById("headerFilterMenu");
const headerFilterOptions = document.getElementById("headerFilterOptions");
const headerFilterButtons = Array.from(document.querySelectorAll(".th-filter"));
const manageCategoriesButton = document.getElementById("manageCategories");
const editSimilarTransactionsButton = document.getElementById("editSimilarTransactions");
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
const similarTransactionModal = document.getElementById("similarTransactionModal");
const closeSimilarTransactionModalButton = document.getElementById("closeSimilarTransactionModal");
const cancelSimilarTransactionModalButton = document.getElementById("cancelSimilarTransactionModal");
const confirmSimilarTransactionEditButton = document.getElementById("confirmSimilarTransactionEdit");
const similarTargetCategorySelect = document.getElementById("similarTargetCategory");
const similarTargetTypeSelect = document.getElementById("similarTargetType");
const similarRememberChoiceInput = document.getElementById("similarRememberChoice");
const similarTransactionMessage = document.getElementById("similarTransactionMessage");
const similarRememberDescription = document.getElementById("similarRememberDescription");
const similarConfirmNote = document.getElementById("similarConfirmNote");
const similarSampleMerchant = document.getElementById("similarSampleMerchant");
const similarSampleDescription = document.getElementById("similarSampleDescription");
const similarSampleAmount = document.getElementById("similarSampleAmount");
const similarSampleCategory = document.getElementById("similarSampleCategory");
const similarSampleType = document.getElementById("similarSampleType");
const appModalBackdrop = document.getElementById("appModal");
const appModalDialog = appModalBackdrop?.querySelector(".app-modal");
const appModalToneLabel = document.getElementById("appModalToneLabel");
const appModalTitle = document.getElementById("appModalTitle");
const appModalMessage = document.getElementById("appModalMessage");
const appModalDetail = document.getElementById("appModalDetail");
const appModalConfirmButton = document.getElementById("appModalConfirm");
const appModalCancelButton = document.getElementById("appModalCancel");
let activeAppModalOptions = null;
const removedBillsModal = document.getElementById("removedBillsModal");
const removedBillsList = document.getElementById("removedBillsList");
const closeRemovedBillsModalButton = document.getElementById("closeRemovedBillsModal");
const closeRemovedBillsModalFooterButton = document.getElementById("closeRemovedBillsModalFooter");
const restoreAllRemovedBillsButton = document.getElementById("restoreAllRemovedBills");
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
const generateInsightButton = document.getElementById("generateInsightBtn");
const insightPrivacyNote = document.getElementById("insightPrivacyNote");
const insightProviderBadge = document.getElementById("insightProviderBadge");
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    ensureTransactionTableSelectionHeader();
    const loginState = getLoginState();
    currentTablePage = loadSavedTablePage();
    loadMonthlyBudgets();
    loadCustomCategories();
    await loadBackendBillLibrary();
    renderEmptyTransactionState();
    updateFilterOptions();
    renderBudgetPanel();
    updateTrendPageCopy();
    renderReviewSummaryCards({ transactions: [], expenses: [], incomes: [], refunds: [], totalIncome: 0, totalExpense: 0, totalRefund: 0 });
    ["categoryChart", "platformChart", "dailyChart"].forEach((id) => {
      const [emptyTitle, emptyDetail] = getChartEmptyCopy(id);
      setChartEmptyState(id, true, emptyTitle, emptyDetail);
    });
    const savedPage = localStorage.getItem(ACTIVE_PAGE_KEY);
    switchPage(VALID_PAGES.includes(savedPage) ? savedPage : "overview");
    renderAuthState(Boolean(loginState?.loggedIn));
  } finally {
    isRestoringTablePage = false;
    document.body.classList.remove("app-initializing");
  }
});

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
clearTableFiltersButton?.addEventListener("click", clearSearchAndTableFilters);
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
ensureTransactionToolbarOrder();
editSimilarTransactionsButton?.addEventListener("click", openSimilarTransactionModal);
closeSimilarTransactionModalButton?.addEventListener("click", closeSimilarTransactionModal);
cancelSimilarTransactionModalButton?.addEventListener("click", closeSimilarTransactionModal);
confirmSimilarTransactionEditButton?.addEventListener("click", confirmSimilarTransactionEdit);
similarTargetTypeSelect?.addEventListener("change", handleSimilarTargetTypeChange);
similarRememberChoiceInput?.addEventListener("change", updateSimilarRememberCopy);
appModalConfirmButton?.addEventListener("click", confirmAppModal);
appModalCancelButton?.addEventListener("click", cancelAppModal);
appModalBackdrop?.addEventListener("click", handleAppModalBackdropClick);
closeRemovedBillsModalButton?.addEventListener("click", closeRemovedBillsModal);
closeRemovedBillsModalFooterButton?.addEventListener("click", closeRemovedBillsModal);
removedBillsModal?.addEventListener("click", handleRemovedBillsModalClick);
restoreAllRemovedBillsButton?.addEventListener("click", requestRestoreAllRemovedBackendBills);
startManualMergeButton?.addEventListener("click", openManualMergeModal);
confirmManualMergeButton?.addEventListener("click", splitSelectedMergedBill);
closeMergeModalButton?.addEventListener("click", closeManualMergeModal);
cancelMergeModalButton?.addEventListener("click", closeManualMergeModal);
createManualMergeButton?.addEventListener("click", createManualMergeTransaction);
mergeTypeSelect?.addEventListener("change", handleMergeTypeChange);
saveBudgetButton?.addEventListener("click", saveCurrentMonthBudget);
clearBudgetButton?.addEventListener("click", clearCurrentMonthBudget);
generateInsightButton?.addEventListener("click", handleGenerateInsightClick);
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

chooseBillFileButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  billUploader.click();
});

billLibraryList?.addEventListener("click", handleBillLibraryClick);
billLibraryList?.addEventListener("keydown", handleBillLibraryKeydown);
viewAllBackendBillsButton?.addEventListener("click", loadAllBackendTransactions);
viewSelectedBackendBillsButton?.addEventListener("click", loadSelectedBackendTransactions);
clearSelectedBackendBillsButton?.addEventListener("click", clearSelectedBackendBills);
restoreRemovedBillsButton?.addEventListener("click", openRemovedBillsModal);

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

  if (USE_BACKEND_BILL_UPLOAD) {
    try {
      console.info("[Backend Upload Try]", {
        count: files.length,
        names: files.map((file) => file.name),
        url: `${BACKEND_BASE_URL}/api/bills/upload`,
      });
      const rows = await uploadBillsToBackend(files);
      if (!rows.length) throw new Error("后端统一上传没有返回可用交易");
      const backendTransactions = rows.map(normalizeBackendTransaction).filter((item) => item.date instanceof Date && !Number.isNaN(item.date.getTime()) && Number.isFinite(item.amount) && item.amount !== 0);
      if (!backendTransactions.length) throw new Error("后端统一上传交易无法转换为前端格式");
      revealUploadedBackendBills(backendTransactions);
      console.info("[Backend Upload Success]", {
        rows: rows.length,
        transactions: backendTransactions.length,
        sample: backendTransactions.slice(0, 3),
      });
      await loadBackendBillLibrary({ preserveOnFailure: true });
      renderEmptyTransactionState("上传成功，已保存到月度账单库。请选择一个或多个月度账单查看明细。");
      setStatus("账单已保存到账单库。点击账单卡片即可查看明细和复盘。");
      return;
    } catch (error) {
      console.warn("[Backend Upload Fallback]", error);
      setStatus("后端统一上传不可用，正在回退到本地解析...");
    }
  }

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

    const normalizedTransactions = normalizedResults.filter(Boolean).sort((a, b) => a.date - b.date);

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
    const transactions = renderParsedTransactions(normalizedTransactions, rows.length);
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

async function uploadBillsToBackend(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${BACKEND_BASE_URL}/api/bills/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`后端统一上传失败：${response.status}`);
  }

  const data = await response.json();

  if (!data?.ok || !Array.isArray(data.transactions)) {
    throw new Error("后端统一上传返回格式不正确");
  }

  return data.transactions;
}

async function fetchBillsFromBackend(params = {}) {
  const query = buildBackendQuery(params);
  const response = await fetch(`${BACKEND_BASE_URL}/api/bills${query}`);
  if (!response.ok) {
    throw new Error(`读取后端账单库失败：${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.bills)) {
    throw new Error("后端账单库返回格式不正确");
  }

  return data.bills;
}

async function fetchTransactionsFromBackend(params = {}) {
  const query = buildBackendQuery(params);
  const response = await fetch(`${BACKEND_BASE_URL}/api/transactions${query}`);
  if (!response.ok) {
    throw new Error(`读取后端交易失败：${response.status}`);
  }

  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.transactions)) {
    throw new Error("后端交易返回格式不正确");
  }

  return data.transactions.map(normalizeBackendTransaction);
}

async function generateInsightFromBackend(payload) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/insights/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.detail || `insight request failed: ${response.status}`);
  }
  if (!data || !Array.isArray(data.cards) || !data.cards.length) {
    throw new Error("insight response has no cards");
  }
  return data;
}

function buildBackendQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

async function patchTransactionToBackend(id, updates) {
  if (!id || !updates || !Object.keys(updates).length) return null;
  if (updates.saveAsRule) {
    console.info("[Category Rule Save]", { id, updates });
  }

  const response = await fetch(`${BACKEND_BASE_URL}/api/transactions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`保存交易修改失败：${response.status}`);
  }

  const data = await response.json();
  if (updates.saveAsRule) {
    console.info("[Category Rule Response]", data?.categoryRule || null);
  }
  return data;
}

async function applySimilarTransactionToBackend(id, updates) {
  if (!id || !updates) throw new Error("missing similar transaction request");

  const response = await fetch(`${BACKEND_BASE_URL}/api/transactions/${encodeURIComponent(id)}/apply-similar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const detail = data?.detail || data?.error || "";
    const error = new Error(detail || `同类账单修改失败：${response.status}`);
    error.status = response.status;
    error.detail = detail;
    throw error;
  }

  if (!data?.ok) {
    throw new Error("同类账单修改返回格式不正确");
  }

  return data;
}

function normalizeBackendTransaction(item) {
  const amount = Number(item.amount || 0);
  const type = normalizeBackendType(item, amount);
  const rawJson = getRawJsonObject(item);
  const categoryParts = {
    description: item.description || "",
    merchant: item.merchant || "",
    transactionType: item.transactionType || "",
  };
  const backendCategory = cleanCell(item.category);
  const category = hasCategoryManualOverride(item) || hasBackendCategoryRuleMarker(item) || isExplicitCategory(backendCategory) ? backendCategory : normalizeCategoryForType(type, backendCategory, categoryParts);

  return {
    id: item.id,
    time: item.time,
    date: parseDate(item.time),
    sourcePlatform: item.sourcePlatform || item.platform || "未知来源",
    platform: item.platform || "",
    paymentMethod: item.platform || "",
    merchant: item.merchant || "",
    description: item.description || "",
    transactionType: item.transactionType || "",
    type,
    category,
    amount,
    categoryManualOverride: hasCategoryManualOverride(item),
    categoryRuleMatched: Boolean(item.categoryRuleMatched || rawJson?.categoryRuleMatched),
    categoryRuleId: item.categoryRuleId || rawJson?.categoryRuleId || "",
    refundGroupKey: item.refundGroupKey || rawJson?.refundGroupKey || "",
    refundPairRole: item.refundPairRole || rawJson?.refundPairRole || (rawJson?.refundMatched ? "originalExpense" : rawJson?.refundLinked ? "refund" : ""),
    refundedAmount: item.refundedAmount ?? rawJson?.refundedAmount ?? rawJson?.refundTotalAmount,
    refundStatus: normalizeRefundStatus(item.refundStatus || rawJson?.refundStatus),
    refundMatchedCount: item.refundMatchedCount || rawJson?.refundMatchedCount || rawJson?.refundTransactionIds?.length || 0,
    refundOriginalTransactionId: item.refundOriginalTransactionId || rawJson?.refundOriginalTransactionId || rawJson?.refundMatchedOriginalTransactionId || "",
    raw: item,
  };
}

async function loadBackendBillLibrary(options = {}) {
  if (!USE_BACKEND_STORAGE || !billLibraryList) return;

  try {
    backendBillLibrary = await fetchBillsFromBackend();
    renderBackendBillLibrary();
  } catch (error) {
    console.warn("[Backend Bills Fallback]", error);
    if (options.preserveOnFailure) {
      return;
    }
    backendBillLibrary = [];
    renderBackendBillLibrary("暂无后端账单数据");
  }
}

function renderBackendBillLibrary(message = "") {
  if (!billLibraryList) return;
  const visibleBills = getVisibleBackendBills();

  if (!backendBillLibrary.length) {
    billLibraryList.innerHTML = `
      <div class="bill-library-empty">
        <strong class="bill-library-empty-title">${escapeHtml(message || "还没有上传账单")}</strong>
        <span class="bill-library-empty-text">先上传支付宝、微信或银行账单，SpendScope 会帮你生成月度复盘。</span>
        <span class="bill-library-empty-text">上传后账单会出现在这里，点击账单即可查看明细和复盘。</span>
      </div>
    `;
    updateBillLibraryCurrent();
    return;
  }

  if (!visibleBills.length) {
    billLibraryList.innerHTML = `
      <div class="bill-library-empty">
        <strong class="bill-library-empty-title">账单库里的账单都已在当前浏览器隐藏</strong>
        <span class="bill-library-empty-text">这些流水仍保留在数据库中。点击“恢复已删除账单”可以重新显示。</span>
      </div>
    `;
    updateBillLibraryCurrent();
    return;
  }

  billLibraryList.innerHTML = visibleBills
    .map((bill) => {
      const isActive = activeBackendBillFilter?.month === bill.month && activeBackendBillFilter?.platform === bill.platform;
      const isSelected = isBackendBillSelected(bill.month, bill.platform);
      const uploadedAt = formatBackendUploadedAt(bill.uploadedAt);
      return `
        <article class="bill-library-card ${isActive ? "active is-active" : ""} ${isSelected ? "is-selected" : ""}" role="button" tabindex="0"
          data-bill-month="${escapeHtml(bill.month || "")}"
          data-bill-platform="${escapeHtml(bill.platform || "")}">
          <label class="bill-library-select" title="选择此账单">
            <input type="checkbox" data-bill-select="true" ${isSelected ? "checked" : ""} />
            <span>选择</span>
          </label>
          <span class="bill-library-card-top">
            <strong>${escapeHtml(bill.month || "未知月份")}</strong>
            <em>${escapeHtml(bill.platform || "未知平台")}</em>
          </span>
          <span class="bill-library-count">${Number(bill.transactionCount || 0)} 笔交易</span>
          <span class="bill-library-money">
            <span>支出 ${money.format(Number(bill.totalExpense || 0))}</span>
            <span>收入 ${money.format(Number(bill.totalIncome || 0))}</span>
            <span>退款 ${money.format(Number(bill.totalRefund || 0))}</span>
          </span>
          <span class="bill-library-card-footer">
            <span class="bill-library-uploaded">最近上传：${escapeHtml(uploadedAt || "—")}</span>
            <button class="bill-delete-button" type="button" data-bill-delete="true">删除账单</button>
          </span>
        </article>
      `;
    })
    .join("");
  updateBillLibraryCurrent();
}

function updateBillLibraryCurrent() {
  if (!billLibraryCurrent) return;
  const selectedCount = selectedBackendBills.length;
  const viewCount = allTransactions.length;
  const removedCount = removedBackendBillKeys.length;
  if (billSelectedCount) {
    billSelectedCount.textContent = `已选择 ${selectedCount} 个账单`;
  }
  if (viewSelectedBackendBillsButton) {
    viewSelectedBackendBillsButton.disabled = !selectedCount;
    viewSelectedBackendBillsButton.textContent = selectedCount ? `合并查看已选 ${selectedCount} 个账单` : "合并查看已选账单";
  }
  if (clearSelectedBackendBillsButton) {
    clearSelectedBackendBillsButton.disabled = !selectedCount;
  }
  if (restoreRemovedBillsButton) {
    restoreRemovedBillsButton.disabled = !removedCount;
    restoreRemovedBillsButton.classList.remove("hidden");
    restoreRemovedBillsButton.textContent = removedCount ? `查看已删除账单（${removedCount}）` : "暂无已删除账单";
  }
  if (activeBackendBillFilter) {
    billLibraryCurrent.innerHTML = `
      <span class="current-bill-view-title">当前正在查看：${escapeHtml(activeBackendBillFilter.platform)} · ${escapeHtml(activeBackendBillFilter.month)}</span>
      <span class="current-bill-view-detail">共 ${viewCount} 条流水。复盘页和明细页均基于当前账单。</span>
    `;
  } else if (activeBackendBillSelection?.length) {
    billLibraryCurrent.innerHTML = `
      <span class="current-bill-view-title">当前正在临时合并查看 ${activeBackendBillSelection.length} 个账单</span>
      <span class="current-bill-view-detail">共 ${viewCount} 条流水。原始账单归属不会改变。</span>
    `;
  } else if (activeBackendBillMode === "all") {
    billLibraryCurrent.innerHTML = `
      <span class="current-bill-view-title">当前正在查看全部账单</span>
      <span class="current-bill-view-detail">共 ${viewCount} 条流水。</span>
    `;
  } else {
    billLibraryCurrent.innerHTML = `
      <span class="current-bill-view-title">当前未选择账单</span>
      <span class="current-bill-view-detail">请选择一个月度账单查看明细和复盘。</span>
    `;
  }
  viewAllBackendBillsButton?.classList.toggle("active", activeBackendBillMode === "all");
  return;
  if (activeBackendBillFilter) {
    billLibraryCurrent.textContent = `当前查看：${activeBackendBillFilter.month} · ${activeBackendBillFilter.platform}`;
  } else if (activeBackendBillSelection?.length) {
    billLibraryCurrent.textContent = `当前查看：已选 ${activeBackendBillSelection.length} 个账单`;
  } else if (activeBackendBillMode === "all") {
    billLibraryCurrent.textContent = "当前查看：全部账单";
  } else {
    billLibraryCurrent.textContent = "当前查看：未选择账单";
  }
  viewAllBackendBillsButton?.classList.toggle("active", activeBackendBillMode === "all");
}

function formatBackendUploadedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

async function handleBillLibraryClick(event) {
  const deleteControl = event.target.closest("[data-bill-delete]");
  if (deleteControl) {
    event.preventDefault();
    event.stopPropagation();
    const card = deleteControl.closest("[data-bill-month][data-bill-platform]");
    await removeBackendBillFromView(card?.dataset.billMonth || "", card?.dataset.billPlatform || "");
    return;
  }

  const selectControl = event.target.closest(".bill-library-select");
  if (selectControl) {
    event.preventDefault();
    event.stopPropagation();
    const selectedCard = selectControl.closest("[data-bill-month][data-bill-platform]");
    toggleBackendBillSelection(selectedCard?.dataset.billMonth || "", selectedCard?.dataset.billPlatform || "");
    return;
  }

  const card = event.target.closest("[data-bill-month][data-bill-platform]");
  if (!card) return;

  const month = card.dataset.billMonth || "";
  const platform = card.dataset.billPlatform || "";
  if (!month || !platform) return;
  if (isBackendBillRemoved(month, platform)) return;

  try {
    setBillLibraryLoading(true);
    const transactions = await fetchTransactionsFromBackend({ month, platform });
    activeBackendBillFilter = { month, platform };
    activeBackendBillSelection = null;
    activeBackendBillMode = "single";
    applyBackendTransactionsToDashboard(transactions, {
      month,
      titleText: `${month} · ${platform}`,
      statusText: `已加载 ${month} · ${platform} 的 ${transactions.length} 笔交易。`,
    });
    renderBackendBillLibrary();
  } catch (error) {
    console.warn("[Backend Bill Load Failed]", error);
    setStatus("读取后端账单明细失败，原页面数据已保留。");
  } finally {
    setBillLibraryLoading(false);
  }
}

function handleBillLibraryKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest("button, input, label")) return;
  const card = event.target.closest("[data-bill-month][data-bill-platform]");
  if (!card) return;
  event.preventDefault();
  card.click();
}

async function loadAllBackendTransactions() {
  if (!USE_BACKEND_STORAGE) return;

  try {
    setBillLibraryLoading(true);
    const transactions = filterRemovedBackendTransactions(await fetchTransactionsFromBackend());
    activeBackendBillFilter = null;
    activeBackendBillSelection = null;
    activeBackendBillMode = "all";
    applyBackendTransactionsToDashboard(transactions, {
      titleText: "全部账单",
      statusText: `已恢复显示全部 ${transactions.length} 笔交易。`,
    });
    renderBackendBillLibrary();
  } catch (error) {
    console.warn("[Backend All Transactions Load Failed]", error);
    setStatus("读取后端全部交易失败，原页面数据已保留。");
  } finally {
    setBillLibraryLoading(false);
  }
}

function getBackendBillKey(month, platform) {
  return `${month || ""}||${platform || ""}`;
}

function getBackendBillKeyFromTransaction(item) {
  return getBackendBillKey(getTransactionBillMonth(item), getTransactionBillPlatform(item));
}

function getTransactionBillMonth(item) {
  if (item?.time) return String(item.time).slice(0, 7);
  if (item?.date instanceof Date && !Number.isNaN(item.date.getTime())) {
    return `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, "0")}`;
  }
  return "";
}

function getTransactionBillPlatform(item) {
  return cleanCell(item?.sourcePlatform || item?.source_platform || getDisplaySourcePlatform(item));
}

function loadRemovedBackendBillKeys() {
  try {
    const rawValue = localStorage.getItem(REMOVED_BILLS_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    const keys = Array.isArray(parsed)
      ? parsed.map((item) => {
          if (typeof item === "string") return item;
          return getBackendBillKey(item?.month, item?.platform);
        })
      : [];
    return Array.from(new Set(keys.filter(Boolean)));
  } catch (error) {
    console.warn("[Removed Bills Storage Read Failed]", error);
    return [];
  }
}

function getRemovedBackendBills() {
  return removedBackendBillKeys
    .map((key) => {
      const [month = "", platform = ""] = key.split("||");
      return { key, month, platform };
    })
    .filter((bill) => bill.month && bill.platform);
}

function saveRemovedBackendBillKeys() {
  try {
    const removedBills = removedBackendBillKeys.map((key) => {
      const [month = "", platform = ""] = key.split("||");
      return { month, platform };
    });
    localStorage.setItem(REMOVED_BILLS_STORAGE_KEY, JSON.stringify(removedBills));
  } catch (error) {
    console.warn("[Removed Bills Storage Save Failed]", error);
  }
}

function isBackendBillRemoved(month, platform) {
  return removedBackendBillKeys.includes(getBackendBillKey(month, platform));
}

function getVisibleBackendBills() {
  return backendBillLibrary.filter((bill) => !isBackendBillRemoved(bill.month, bill.platform));
}

function filterRemovedBackendTransactions(transactions) {
  if (!removedBackendBillKeys.length) return transactions;
  return transactions.filter((item) => !removedBackendBillKeys.includes(getBackendBillKeyFromTransaction(item)));
}

function revealUploadedBackendBills(transactions) {
  if (!removedBackendBillKeys.length) return;
  const uploadedKeys = new Set(transactions.map(getBackendBillKeyFromTransaction).filter(Boolean));
  if (!uploadedKeys.size) return;
  const nextKeys = removedBackendBillKeys.filter((key) => !uploadedKeys.has(key));
  if (nextKeys.length === removedBackendBillKeys.length) return;
  removedBackendBillKeys = nextKeys;
  saveRemovedBackendBillKeys();
}

function isBackendBillSelected(month, platform) {
  const key = getBackendBillKey(month, platform);
  return selectedBackendBills.some((bill) => getBackendBillKey(bill.month, bill.platform) === key);
}

function toggleBackendBillSelection(month, platform) {
  if (!month || !platform) return;
  if (isBackendBillRemoved(month, platform)) return;
  const key = getBackendBillKey(month, platform);
  if (isBackendBillSelected(month, platform)) {
    selectedBackendBills = selectedBackendBills.filter((bill) => getBackendBillKey(bill.month, bill.platform) !== key);
  } else {
    selectedBackendBills = [...selectedBackendBills, { month, platform }];
  }
  renderBackendBillLibrary();
}

async function removeBackendBillFromView(month, platform) {
  if (!month || !platform) return;
  showAppModal({
    title: "删除账单",
    message: `确认删除 ${month} ${platform}账单吗？`,
    detail: "当前版本只会将它从账单库和普通视图中移除，不会删除数据库中的流水、修改记录、退款信息和分类规则。之后重新上传同一账单时，会重新显示并继续按已有规则分类。",
    confirmText: "确认删除",
    cancelText: "取消",
    tone: "warning",
    onConfirm: () => executeRemoveBackendBillFromView(month, platform),
  });
}

async function executeRemoveBackendBillFromView(month, platform) {
  const key = getBackendBillKey(month, platform);
  if (!removedBackendBillKeys.includes(key)) {
    removedBackendBillKeys = [...removedBackendBillKeys, key];
    saveRemovedBackendBillKeys();
  }

  selectedBackendBills = selectedBackendBills.filter((bill) => getBackendBillKey(bill.month, bill.platform) !== key);
  if (activeBackendBillFilter && getBackendBillKey(activeBackendBillFilter.month, activeBackendBillFilter.platform) === key) {
    renderEmptyTransactionState("账单已从当前浏览器的账单库中隐藏。数据库流水、修改记录、退款信息和分类规则均未删除。");
    return;
  }

  if (activeBackendBillSelection?.length) {
    activeBackendBillSelection = activeBackendBillSelection.filter((bill) => getBackendBillKey(bill.month, bill.platform) !== key);
    if (!activeBackendBillSelection.length) {
      renderEmptyTransactionState("已从已选账单中移除该账单，请重新选择需要查看的账单。");
      return;
    }
    selectedBackendBills = selectedBackendBills.filter((bill) => !isBackendBillRemoved(bill.month, bill.platform));
    await loadSelectedBackendTransactions();
    setStatus("账单已从当前浏览器的账单库中隐藏。数据库数据未删除。");
    return;
  }

  if (activeBackendBillMode === "all") {
    await loadAllBackendTransactions();
    setStatus("账单已从当前浏览器的账单库和查看全部中隐藏。数据库数据未删除。");
    return;
  }

  renderBackendBillLibrary();
  setStatus("账单已从当前浏览器的账单库中隐藏。数据库数据未删除。");
}

function openRemovedBillsModal() {
  renderRemovedBillsModalList();
  removedBillsModal?.classList.remove("hidden");
}

function closeRemovedBillsModal() {
  removedBillsModal?.classList.add("hidden");
}

function renderRemovedBillsModalList() {
  if (!removedBillsList) return;
  const removedBills = getRemovedBackendBills();
  if (!removedBills.length) {
    removedBillsList.innerHTML = `<p class="removed-bills-empty">暂无已删除账单。</p>`;
    if (restoreAllRemovedBillsButton) restoreAllRemovedBillsButton.disabled = true;
    updateBillLibraryCurrent();
    return;
  }

  if (restoreAllRemovedBillsButton) restoreAllRemovedBillsButton.disabled = false;
  removedBillsList.innerHTML = removedBills
    .map((bill) => `
      <article class="removed-bill-item">
        <span class="removed-bill-main">
          <strong>${escapeHtml(bill.month)} · ${escapeHtml(bill.platform)}</strong>
          <span class="removed-bill-meta">数据库流水、退款信息和分类规则仍然保留</span>
        </span>
        <button class="restore-single-bill-btn" type="button"
          data-restore-bill-month="${escapeHtml(bill.month)}"
          data-restore-bill-platform="${escapeHtml(bill.platform)}">恢复</button>
      </article>
    `)
    .join("");
  updateBillLibraryCurrent();
}

function handleRemovedBillsModalClick(event) {
  if (event.target === removedBillsModal) {
    closeRemovedBillsModal();
    return;
  }
  const restoreButton = event.target.closest("[data-restore-bill-month][data-restore-bill-platform]");
  if (!restoreButton) return;
  restoreSingleRemovedBackendBill(restoreButton.dataset.restoreBillMonth || "", restoreButton.dataset.restoreBillPlatform || "");
}

async function restoreSingleRemovedBackendBill(month, platform) {
  if (!month || !platform) return;
  const key = getBackendBillKey(month, platform);
  if (!removedBackendBillKeys.includes(key)) return;
  removedBackendBillKeys = removedBackendBillKeys.filter((item) => item !== key);
  saveRemovedBackendBillKeys();
  renderRemovedBillsModalList();
  renderBackendBillLibrary();
  if (activeBackendBillMode === "all") {
    await loadAllBackendTransactions();
  }
  setStatus(`已恢复 ${month} ${platform}账单。`);
  if (!removedBackendBillKeys.length) closeRemovedBillsModal();
}

async function requestRestoreAllRemovedBackendBills() {
  if (!removedBackendBillKeys.length) {
    renderRemovedBillsModalList();
    return;
  }
  showAppModal({
    title: "恢复全部账单",
    message: "确认恢复所有已删除账单吗？",
    detail: "恢复后，这些账单会重新显示在月度账单库和普通视图中。",
    confirmText: "确认恢复",
    cancelText: "取消",
    tone: "success",
    onConfirm: executeRestoreRemovedBackendBills,
  });
}

async function executeRestoreRemovedBackendBills() {
  removedBackendBillKeys = [];
  saveRemovedBackendBillKeys();
  await loadBackendBillLibrary({ preserveOnFailure: true });
  closeRemovedBillsModal();
  if (activeBackendBillMode === "all") {
    await loadAllBackendTransactions();
  } else {
    renderBackendBillLibrary();
  }
  setStatus("已恢复所有已删除账单。");
}

async function loadSelectedBackendTransactions() {
  selectedBackendBills = selectedBackendBills.filter((bill) => !isBackendBillRemoved(bill.month, bill.platform));
  if (!selectedBackendBills.length) {
    setStatus("请先选择至少一个账单");
    renderBackendBillLibrary();
    return;
  }
  const selection = selectedBackendBills.map((bill) => ({ ...bill }));
  try {
    setBillLibraryLoading(true);
    const groupedTransactions = await Promise.all(selection.map((bill) => fetchTransactionsFromBackend(bill)));
    const transactions = groupedTransactions.flat();
    activeBackendBillFilter = null;
    activeBackendBillSelection = selection;
    activeBackendBillMode = "selection";
    applyBackendTransactionsToDashboard(transactions, {
      titleText: getBackendBillSelectionTitle(selection),
      statusText: `已加载已选 ${selection.length} 个账单的 ${transactions.length} 笔交易。`,
    });
    renderBackendBillLibrary();
  } catch (error) {
    console.warn("[Backend Selected Bills Load Failed]", error);
    setStatus("读取已选账单明细失败，原页面数据已保留。");
  } finally {
    setBillLibraryLoading(false);
  }
}

function clearSelectedBackendBills() {
  const wasViewingSelection = Boolean(activeBackendBillSelection?.length);
  selectedBackendBills = [];
  activeBackendBillSelection = null;
  if (wasViewingSelection) activeBackendBillMode = "empty";
  renderBackendBillLibrary();
  if (wasViewingSelection) {
    renderEmptyTransactionState("请选择一个或多个月度账单查看明细");
  }
}

function getBackendBillSelectionTitle(selection) {
  if (selection.length > 0 && selection.length <= 2) {
    return selection.map((bill) => `${bill.month} · ${bill.platform}`).join(" + ");
  }
  return `已选 ${selection.length} 个账单`;
}

function setBillLibraryLoading(isLoading) {
  billLibraryList?.classList.toggle("is-loading", isLoading);
  viewAllBackendBillsButton?.toggleAttribute("disabled", isLoading);
  viewSelectedBackendBillsButton?.toggleAttribute("disabled", isLoading);
  clearSelectedBackendBillsButton?.toggleAttribute("disabled", isLoading);
  restoreRemovedBillsButton?.toggleAttribute("disabled", isLoading || !removedBackendBillKeys.length);
  if (!isLoading) updateBillLibraryCurrent();
}

function setTransactionDetailTitle(text) {
  if (transactionDetailTitle) transactionDetailTitle.textContent = `账单明细：${text}`;
}

function renderEmptyTransactionState(statusText = "请选择一个或多个月度账单查看明细") {
  allTransactions = [];
  currentTableTransactions = [];
  activeBackendBillFilter = null;
  activeBackendBillSelection = null;
  activeBackendBillMode = "empty";
  clearTransactionSelection();
  resetTableFilters({ skipRender: true });
  resetTablePage();
  populateMonthFilter([]);
  setTransactionDetailTitle("未选择账单");
  renderDashboard([]);
  renderTable([], 0, 0, 0);
  renderBackendBillLibrary();
  markSaved(statusText);
}

function applyBackendTransactionsToDashboard(backendTransactions, options = {}) {
  const preservedSearch = options.preserveSearch ? tableSearch.value : "";
  const normalizedTransactions = ensureTransactionIds(backendTransactions.slice().sort((a, b) => a.date - b.date));
  const dedupedTransactions = applyCrossPlatformDedup(normalizedTransactions);
  const transactions = applyRefundPairing(dedupedTransactions);
  allTransactions = transactions;
  clearTransactionSelection();
  resetTableFilters({ skipRender: true });
  if (options.preserveSearch) tableSearch.value = preservedSearch;
  resetTablePage();
  populateMonthFilter(allTransactions);
  const monthFilter = document.getElementById("monthFilter");
  if (options.month && Array.from(monthFilter.options).some((option) => option.value === options.month)) {
    monthFilter.value = options.month;
  }
  if (options.titleText) setTransactionDetailTitle(options.titleText);
  renderSelectedMonth(monthFilter.value);
  markSaved(options.statusText || `已从后端加载 ${allTransactions.length} 笔交易。`);
}

function renderParsedTransactions(parsedTransactions, rawCount = parsedTransactions.length) {
  const normalizedTransactions = ensureTransactionIds(parsedTransactions.slice().sort((a, b) => a.date - b.date));
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
  activeBackendBillFilter = null;
  console.info("[Analyze Flow] render done", {
    rawRows: rawCount,
    transactions: transactions.length,
  });
  return transactions;
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
    category: aggregateNet(netSummary.netExpenses, [], "category"),
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
    category: hasCategoryManualOverride(item) ? cleanCell(item.category) || "待确认" : normalizeCategoryForType(type, item.category, categoryParts),
  };
}

function ensureTransactionIds(transactions) {
  return transactions.map((item, index) => ({
    ...item,
    id: item.id || `${item.time || "time"}-${item.platform || "platform"}-${item.merchant || "merchant"}-${item.amount || 0}-${index}-${Date.now()}`,
  }));
}

async function restoreDashboardFromStorage() {
  if (USE_BACKEND_STORAGE) {
    try {
      const backendTransactions = await fetchTransactionsFromBackend();
      if (!backendTransactions.length) throw new Error("后端数据库暂无交易");

      const normalizedTransactions = ensureTransactionIds(backendTransactions.slice().sort((a, b) => a.date - b.date));
      const dedupedTransactions = applyCrossPlatformDedup(normalizedTransactions);
      const transactions = applyRefundPairing(dedupedTransactions);
      allTransactions = transactions;
      clearTransactionSelection();
      populateMonthFilter(allTransactions);
      renderSelectedMonth(document.getElementById("monthFilter").value);
      markSaved(`已从后端恢复 ${allTransactions.length} 笔交易。`);
      return;
    } catch (error) {
      console.warn("[Backend Storage Fallback]", error);
    }
  }

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
  activeBackendBillFilter = null;
  activeBackendBillSelection = null;
  activeBackendBillMode = "empty";
  selectedBackendBills = [];
  clearTransactionSelection();
  resetTablePage();
  billUploader.value = "";
  uploadConfirm.classList.add("hidden");
  uploadConfirm.innerHTML = "";
  resetDashboard();
  renderBackendBillLibrary();
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
  renderSummary({ transactions: [], expenses: [], incomes: [], refunds: [], totalIncome: 0, totalExpense: 0, totalRefund: 0, net: 0 });
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
  const totalIncome = sumEffectiveIncome(incomes);
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
    category: aggregateNet(expenses, [], "category"),
    platform: aggregateNet(expenses, [], "platform"),
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

function isWeakCategory(category) {
  const value = cleanCell(category);
  return !value || ["待确认", "未分类", "其他"].includes(value);
}

function isExplicitCategory(category) {
  return !isWeakCategory(category);
}

function isProtectedType(type) {
  return TYPE_OPTIONS.includes(type);
}

function normalizeBackendType(item, amount) {
  if (isProtectedType(item?.type)) return item.type;
  const rawType = cleanCell(item?.rawType || item?.originalType || item?.type || "");
  const hintText = `${rawType} ${item?.transactionType || ""} ${item?.description || ""} ${item?.merchant || ""}`;
  if (/退款|退货|售后退款|运费补偿|运费补贴|运费险|退运费|运费赔付|中性|不计收支|支出|付款|借|消费|收入|收款|贷|入账/.test(hintText) || /^[+-]$/.test(rawType)) {
    return detectType(rawType || hintText, amount, item || {});
  }
  return "待确认";
}

function getRawJsonObject(item) {
  const rawJson = item?.raw_json || item?.rawJson || item?.raw?.raw_json || item?.raw?.rawJson;
  if (!rawJson) return null;
  if (typeof rawJson === "object") return rawJson;
  try {
    return JSON.parse(rawJson);
  } catch (error) {
    return null;
  }
}

function hasBackendCategoryRuleMarker(item) {
  const rawJson = getRawJsonObject(item);
  return Boolean(item?.categoryRuleMatched || item?.categoryRuleId || rawJson?.categoryRuleMatched || rawJson?.categoryRuleId);
}

function hasCategoryManualOverride(item) {
  const rawJson = getRawJsonObject(item);
  return Boolean(item?.categoryManualOverride || rawJson?.categoryManualOverride);
}

function isRefundTransaction(item) {
  const rawJson = getRawJsonObject(item);
  const text = `${item?.type || ""} ${item?.transactionType || ""} ${rawJson?.type || ""} ${rawJson?.transactionType || ""} ${rawJson?.description || ""}`;
  const hasExplicitRefundType = item?.type === "退款" || item?.transactionType === "退款" || rawJson?.type === "退款" || rawJson?.transactionType === "退款";
  const hasRefundMetadata = rawJson?.refundLinked === true || ["matched", "unmatched"].includes(rawJson?.refundMatchStatus) || ["refund", "unmatchedRefund"].includes(item?.refundPairRole || rawJson?.refundPairRole);
  const canInferFromText = !["支出", "排除"].includes(item?.type) && !["支出", "排除"].includes(rawJson?.type);
  return (
    hasExplicitRefundType ||
    hasRefundMetadata ||
    (canInferFromText && /退款|退货|售后退款|运费补偿|运费补贴|运费险|退运费|运费赔付|退回|原路退回/.test(text))
  );
}

function isExcludedLikeTransaction(item) {
  const rawJson = getRawJsonObject(item);
  const text = [
    item?.type,
    item?.category,
    item?.transactionType,
    item?.sourcePlatform,
    item?.platform,
    item?.description,
    item?.excludeReason,
    rawJson?.type,
    rawJson?.category,
    rawJson?.transactionType,
    rawJson?.platform,
    rawJson?.excludeReason,
  ].join(" ");
  return (
    item?.type === "排除" ||
    /排除|不计收支|亲情卡|转账|转入|转出|账户转移|自动转入|重复扣款|已合并|抵消/.test(text)
  );
}

function getEffectiveExpenseAmount(item) {
  if (!item || isRefundTransaction(item) || isExcludedLikeTransaction(item) || item.type !== "支出") return 0;
  const rawJson = getRawJsonObject(item);
  const netAmount = rawJson?.netAmount;
  const amount = netAmount !== undefined && netAmount !== null && netAmount !== "" ? Number(netAmount) : Number(item.amount || 0);
  return Number.isFinite(amount) ? Math.max(0, roundMoneyAmount(amount)) : 0;
}

function getEffectiveIncomeAmount(item) {
  if (!item || isRefundTransaction(item) || isExcludedLikeTransaction(item) || item.type !== "收入") return 0;
  const amount = Number(item.amount || 0);
  return Number.isFinite(amount) ? Math.max(0, roundMoneyAmount(amount)) : 0;
}

function getRefundAmount(item) {
  if (!isRefundTransaction(item)) return 0;
  const amount = Number(item?.amount || 0);
  return Number.isFinite(amount) ? Math.max(0, roundMoneyAmount(amount)) : 0;
}

function normalizeRefundStatus(value) {
  if (value === "full_refund") return "full";
  if (value === "partial_refund") return "partial";
  return value || "";
}

function normalizeCategoryForType(type, category, input = "") {
  const value = cleanCell(category);
  if (isExplicitCategory(value)) return value;
  const options = getCategoryOptions(type);
  if (options.includes(value) && !isWeakCategory(value)) return value;
  return inferCategory(type, input);
}

function getNetExpenseSummary(transactions) {
  const expenses = transactions.filter((item) => getEffectiveExpenseAmount(item) > 0);
  const incomes = transactions.filter((item) => getEffectiveIncomeAmount(item) > 0);
  const refunds = transactions.filter((item) => isRefundTransaction(item));
  const pairedRefunds = refunds.filter((item) => item.refundGroupKey || getRawJsonObject(item)?.refundLinked === true || getRawJsonObject(item)?.refundMatchStatus === "matched");
  const unpairedRefunds = refunds.filter((item) => !pairedRefunds.includes(item));
  const pairedRefundAmount = sumRefundAmounts(pairedRefunds);
  const unpairedRefundAmount = sumRefundAmounts(unpairedRefunds);
  const totalRefund = roundMoneyAmount(pairedRefundAmount + unpairedRefundAmount);
  const netExpenses = expenses.map((item) => ({
    ...item,
    amount: getEffectiveExpenseAmount(item),
    originalAmount: item.originalAmount ?? item.amount,
  }));
  const grossExpense = roundMoneyAmount(transactions.reduce((total, item) => total + (item.type === "支出" ? Number(item.amount || 0) : 0), 0));
  const pairedOriginalExpenses = netExpenses.filter((item) => item.refundPairRole === "originalExpense" || getRawJsonObject(item)?.refundMatched === true);
  const totalExpense = sum(netExpenses);

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
  updateTrendPageCopy();
  const netExpenseSummary = getNetExpenseSummary(transactions);
  const expenses = netExpenseSummary.netExpenses;
  const incomes = netExpenseSummary.incomes;
  const refunds = netExpenseSummary.refunds;
  const totalIncome = sumEffectiveIncome(incomes);
  const totalRefund = netExpenseSummary.totalRefund;
  const totalExpense = netExpenseSummary.totalExpense;
  const net = totalIncome - totalExpense;

  document.getElementById("totalIncome").textContent = money.format(totalIncome);
  document.getElementById("totalExpense").textContent = money.format(totalExpense);
  document.getElementById("netAmount").textContent = money.format(net);
  document.getElementById("expenseCount").textContent = expenses.length;
  renderReviewSummaryCards({ transactions, expenses, incomes, refunds, totalIncome, totalExpense, totalRefund });
  const categoryExpenseData = aggregateNet(expenses, [], "category");
  const platformExpenseData = aggregateNet(expenses, [], "platform");
  const dailyExpenseData = aggregateNetByDay(expenses, []);
  renderCategoryReviewNote(categoryExpenseData, totalExpense);
  renderCategoryBubbleChart(categoryExpenseData, totalExpense);
  renderPlatformReviewCards(platformExpenseData, totalExpense);
  renderDailyReviewNote(dailyExpenseData);

  renderChart("categoryChart", "pie", aggregateNet(expenses, [], "category"), "分类支出");
  renderChart("platformChart", "bar", aggregateNet(expenses, [], "platform"), "平台支出");
  renderDailyChart(expenses, []);
  document.getElementById("aiSummary").textContent = "正在整理你的月度消费洞察…";
  renderSummary({ transactions, expenses, incomes, refunds, unpairedRefunds: netExpenseSummary.unpairedRefunds, totalIncome, totalExpense, totalRefund, net });
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

function updateTrendPageCopy() {
  const trendsPage = document.getElementById("trendsPage");
  if (!trendsPage) return;
  const headings = trendsPage.querySelectorAll(".chart-panel .panel-heading");
  const copy = [
    ["钱主要花在哪", "按净支出统计，退款已抵扣"],
    ["主要支付平台", "微信 / 支付宝 / 银行"],
    ["每日净支出节奏", "看这个月哪几天支出更集中"],
  ];
  headings.forEach((heading, index) => {
    const title = heading.querySelector("h2");
    const subtitle = heading.querySelector("span");
    if (!copy[index]) return;
    if (title) title.textContent = copy[index][0];
    if (subtitle) subtitle.textContent = copy[index][1];
  });
  const assistantTitle = trendsPage.querySelector(".assistant-panel .panel-heading h2, .ai-panel .panel-heading h2");
  const assistantBadge = trendsPage.querySelector(".assistant-panel .insight-badge, .ai-panel .insight-badge");
  if (assistantTitle) assistantTitle.textContent = "账单小助手";
  if (assistantBadge) assistantBadge.textContent = "Monthly Note";
}

function renderReviewSummaryCards(stats) {
  if (!document.querySelector(".review-summary-grid")) return;
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };
  const setCardHelper = (index, value) => {
    const helper = document.querySelectorAll(".review-summary-grid .review-card em")[index];
    if (helper) helper.textContent = value;
  };
  setText("reviewTotalExpense", money.format(stats.totalExpense || 0));
  setText("reviewTotalIncome", money.format(stats.totalIncome || 0));
  setText("reviewTotalRefund", money.format(stats.totalRefund || 0));
  setText("reviewTransactionCount", `${stats.transactions.length} 笔`);
  setText("reviewTransactionMeta", `支出 ${stats.expenses.length} 笔 · 退款 ${stats.refunds.length} 笔`);
  setCardHelper(
    0,
    stats.totalExpense > 0 ? "已扣除匹配退款后的净支出" : "选择账单后显示净支出"
  );
  setCardHelper(1, "退款不计入收入，仅统计真实收入流水");
  setCardHelper(
    2,
    stats.totalRefund > 0 ? "已从原付款中抵扣" : "本月暂无明显退款抵扣"
  );
  setCardHelper(3, `支出 ${stats.expenses.length} 笔 · 退款 ${stats.refunds.length} 笔`);
}

function getTopExpenseItemsWithOther(data, limit = 6) {
  const cleanData = data.filter((item) => Number(item.value) > 0);
  if (cleanData.length <= limit) return cleanData;
  const visible = cleanData.slice(0, limit - 1);
  const otherValue = roundMoneyAmount(cleanData.slice(limit - 1).reduce((total, item) => total + Number(item.value || 0), 0));
  return otherValue > 0 ? [...visible, { name: "其他", value: otherValue }] : visible;
}

function renderCategoryReviewNote(data, totalExpense) {
  const node = document.getElementById("categoryReviewNote");
  if (!node) return;
  if (!data.length || !totalExpense) {
    node.textContent = "";
    node.classList.add("hidden");
    return;
  }

  const top = data[0];
  const next = data.slice(1, 3).map((item) => item.name).filter(Boolean);
  const share = percent(top.value, totalExpense);
  node.textContent = next.length
    ? `本月消费最明显的是 ${top.name}，占净支出的 ${share}，其次是 ${next.join("、")}。`
    : `本月支出主要集中在 ${top.name}。`;
  node.classList.remove("hidden");
}

function renderCategoryBubbleChart(data, totalExpense) {
  const container = document.getElementById("categoryBubbleChart");
  if (!container) return;
  const items = getTopExpenseItemsWithOther(data, 6);
  if (!items.length) {
    container.innerHTML = "";
    return;
  }

  const maxValue = Math.max(...items.map((item) => Number(item.value || 0)), 1);
  const tones = ["sage", "peach", "olive", "beige", "teal", "sand"];
  container.innerHTML = items
    .map((item, index) => {
      const value = Number(item.value || 0);
      const ratio = Math.sqrt(value / maxValue);
      const size = Math.round(104 + ratio * 82);
      const share = percent(value, totalExpense);
      return `
        <div class="category-bubble category-bubble-${tones[index % tones.length]}" style="--bubble-size: ${size}px">
          <strong>${escapeHtml(item.name || "未分类")}</strong>
          <span>${escapeHtml(money.format(value))}</span>
          <em>${escapeHtml(share)}</em>
        </div>
      `;
    })
    .join("");
}

function renderPlatformReviewCards(data, totalExpense) {
  const container = document.getElementById("platformReviewList");
  if (!container) return;
  const items = getTopExpenseItemsWithOther(data, 6);
  if (!items.length) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = items
    .map((item, index) => {
      const value = Number(item.value || 0);
      const share = totalExpense ? Math.round((value / totalExpense) * 100) : 0;
      const badge =
        index === 0
          ? `<em class="platform-review-badge primary">${share > 60 ? "主要平台 · 占比较高" : "主要平台"}</em>`
          : "";
      return `
        <div class="platform-review-card">
          <div class="platform-review-main">
            <span>${escapeHtml(item.name || "其他")}</span>
            ${badge}
            <strong>${escapeHtml(money.format(value))}</strong>
          </div>
          <div class="platform-review-meta">
            <span>${share}%</span>
            <div class="platform-review-track">
              <i style="width: ${Math.min(share, 100)}%"></i>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function buildDailyPeakNote(dailyData) {
  if (!dailyData.length) return "";
  const maxValue = Math.max(...dailyData.map((item) => Number(item.value || 0)));
  if (!Number.isFinite(maxValue) || maxValue <= 0) return "";
  const peakDays = dailyData.filter((item) => Number(item.value || 0) === maxValue);
  if (peakDays.length > 1) {
    return `本月有 ${peakDays.length} 天支出并列最高，最高单日净支出 ${money.format(maxValue)}。`;
  }
  const label = formatDailyPeakDate(peakDays[0].name);
  return `本月单日支出最高出现在 ${label}，净支出 ${money.format(maxValue)}。`;
}

function buildAssistantNoteCards(stats) {
  if (!stats.transactions.length) {
    return [
      {
        title: "等待账单数据",
        text: "上传并选择账单后，这里会生成本月消费复盘。",
      },
    ];
  }

  const categories = aggregateNet(stats.expenses, [], "category");
  const platforms = aggregateNet(stats.expenses, [], "platform");
  const dailyData = aggregateNetByDay(stats.expenses, []);
  const topCategory = categories[0];
  const topPlatform = platforms[0];
  const peakNote = buildDailyPeakNote(dailyData);
  const cards = [];

  cards.push({
    title: "主要支出",
    text: topCategory
      ? `主要支出集中在 ${topCategory.name}，占净支出的 ${percent(topCategory.value, stats.totalExpense)}。`
      : "这个月还没有明显的支出类别分布。",
  });

  cards.push({
    title: "平台观察",
    text: topPlatform
      ? `本月 ${topPlatform.name} 是主要记录平台，贡献了 ${money.format(topPlatform.value)} 净支出。`
      : "暂时还没有明显的平台支出差异。",
  });

  cards.push({
    title: "退款情况",
    text: stats.refunds.length
      ? `本月已识别退款抵扣 ${money.format(stats.totalRefund)}，已从真实支出中扣除。`
      : "本月没有明显退款抵扣记录。",
  });

  if (peakNote) {
    cards.push({
      title: "消费节奏",
      text: `${peakNote} 可以在明细页回看具体交易。`,
    });
  }

  return cards.slice(0, 4);
}

function formatDailyPeakDate(value) {
  const text = String(value || "");
  const match = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[2]}-${match[3]}`;
  return text || "-";
}

function renderDailyReviewNote(dailyData) {
  const node = document.getElementById("dailyReviewNote");
  if (!node) return;
  const note = buildDailyPeakNote(dailyData);
  node.textContent = note;
  node.classList.toggle("hidden", !note);
}

function getDailyPeakSummary(dailyData) {
  if (!dailyData.length) return null;
  const maxValue = Math.max(...dailyData.map((item) => Number(item.value || 0)));
  if (!Number.isFinite(maxValue) || maxValue <= 0) return null;
  const peak = dailyData.find((item) => Number(item.value || 0) === maxValue);
  return {
    day: formatDailyPeakDate(peak?.name),
    amount: roundMoneyAmount(maxValue),
  };
}

function getInsightMonthLabel(transactions) {
  const months = uniqueSorted(
    transactions
      .map((item) => (item.date instanceof Date && !Number.isNaN(item.date.getTime()) ? monthKey(item.date) : ""))
      .filter(Boolean)
  );
  return months.length === 1 ? months[0] : null;
}

function buildInsightTopItems(data, totalExpense) {
  return data.slice(0, 5).map((item) => {
    const amount = roundMoneyAmount(Number(item.value || 0));
    return {
      name: String(item.name || "其他"),
      amount,
      ratio: totalExpense > 0 ? Number((amount / totalExpense).toFixed(4)) : null,
    };
  });
}

// Privacy boundary: build only an anonymized aggregate payload for insight generation.
// Never send full transactions, merchant, description, raw_json, order ids, card numbers,
// real names, or full transaction timestamps to /api/insights/generate.
function buildInsightSummaryPayload(stats) {
  const categoryData = aggregateNet(stats.expenses, [], "category");
  const platformData = aggregateNet(stats.expenses, [], "platform");
  const dailyData = aggregateNetByDay(stats.expenses, []);
  const dailyPeak = getDailyPeakSummary(dailyData);
  return {
    month: getInsightMonthLabel(stats.transactions),
    totalExpense: roundMoneyAmount(stats.totalExpense || 0),
    totalIncome: roundMoneyAmount(stats.totalIncome || 0),
    refundOffset: roundMoneyAmount(stats.totalRefund || 0),
    transactionCount: stats.transactions.length,
    expenseCount: stats.expenses.length,
    refundCount: stats.refunds.length,
    topCategories: buildInsightTopItems(categoryData, stats.totalExpense || 0),
    topPlatforms: buildInsightTopItems(platformData, stats.totalExpense || 0),
    dailyPeak,
    spendingRhythm: dailyPeak ? "可以在明细页回看当天的具体交易。" : null,
    unmatchedRefundCount: stats.unpairedRefunds?.length || 0,
  };
}

function setInsightStatus({ provider = "", privacyNote = "", message = "", isFallback = false } = {}) {
  if (insightProviderBadge) {
    insightProviderBadge.textContent = provider;
    insightProviderBadge.classList.toggle("hidden", !provider);
  }
  if (insightPrivacyNote) {
    insightPrivacyNote.textContent = message || privacyNote || "";
    insightPrivacyNote.classList.toggle("hidden", !(message || privacyNote));
    insightPrivacyNote.classList.toggle("is-fallback", Boolean(isFallback));
  }
}

function normalizeAssistantCards(cards) {
  return (Array.isArray(cards) ? cards : [])
    .filter((card) => card && typeof card.title === "string" && typeof card.text === "string")
    .slice(0, 4);
}

function renderAssistantCards(cards, options = {}) {
  const target = document.getElementById("aiSummary");
  if (!target) return;
  const normalizedCards = normalizeAssistantCards(cards);
  const safeCards = normalizedCards.length
    ? normalizedCards
    : [
        {
          title: "等待账单数据",
          text: "上传并选择账单后，这里会生成本月消费复盘。",
          empty: true,
        },
      ];
  setInsightStatus(options);
  target.innerHTML = `
    <div class="assistant-note-list">
      ${safeCards
        .map(
          (card, index) => `
            <article class="assistant-note-card${card.empty ? " is-empty" : ""}${card.tone ? ` tone-${escapeHtml(card.tone)}` : ""}">
              <span class="assistant-note-index">${String(index + 1).padStart(2, "0")}</span>
              <strong class="assistant-note-title">${escapeHtml(card.title)}</strong>
              <span class="assistant-note-text">${escapeHtml(card.text)}</span>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

async function handleGenerateInsightClick() {
  if (!currentAssistantStats || !currentAssistantStats.transactions.length) {
    renderAssistantCards(buildAssistantNoteCards({ transactions: [], expenses: [], incomes: [], refunds: [], totalIncome: 0, totalExpense: 0, totalRefund: 0 }), {
      message: "请先上传并选择账单，再生成小结。",
      provider: "Local rule",
      isFallback: true,
    });
    return;
  }

  const payload = buildInsightSummaryPayload(currentAssistantStats);
  generateInsightButton.disabled = true;
  generateInsightButton.textContent = "生成中...";
  setInsightStatus({ message: "正在基于脱敏统计摘要生成小结..." });
  try {
    const result = await generateInsightFromBackend(payload);
    renderAssistantCards(result.cards, {
      provider: result.provider === "local-rule" ? "本地规则小结" : result.provider,
      privacyNote: result.privacyNote || "仅基于脱敏统计摘要生成，不上传完整账单明细。",
    });
  } catch (error) {
    console.warn("[Insight fallback]", error);
    renderAssistantCards(buildAssistantNoteCards(currentAssistantStats), {
      provider: "Local rule",
      message: "智能小结暂不可用，已显示本地复盘。",
      isFallback: true,
    });
  } finally {
    generateInsightButton.disabled = false;
    generateInsightButton.textContent = "生成 AI 小结";
  }
}

function setChartEmptyState(id, isEmpty, title = "", detail = "") {
  const canvas = document.getElementById(id);
  const empty = document.getElementById(`${id}Empty`);
  if (canvas) canvas.classList.toggle("is-empty", Boolean(isEmpty));
  if (!empty) return;
  empty.classList.toggle("hidden", !isEmpty);
  const titleNode = empty.querySelector("strong");
  const detailNode = empty.querySelector("span");
  if (titleNode && title) titleNode.textContent = title;
  if (detailNode && detail) detailNode.textContent = detail;
  let hintNode = empty.querySelector(".empty-state-hint");
  if (isEmpty) {
    if (!hintNode) {
      hintNode = document.createElement("p");
      hintNode.className = "empty-state-hint";
      empty.appendChild(hintNode);
    }
    hintNode.textContent = getChartEmptyActionCopy(id);
  } else if (hintNode) {
    hintNode.remove();
  }
}

function getChartEmptyActionCopy(id) {
  const copies = {
    categoryChart: "上传并选择账单后，这里会显示分类复盘。",
    platformChart: "选择一个月度账单后，可以查看平台支出结构。",
    dailyChart: "当前还没有可复盘的数据，先去上传或选择账单。",
  };
  return copies[id] || "上传或选择账单后，这里会显示复盘内容。";
}

function getChartEmptyCopy(id) {
  const copies = {
    categoryChart: ["还没有分类支出数据", "上传账单后，这里会显示本月主要消费类别。"],
    platformChart: ["还没有平台支出数据", "支付宝、微信、银行账单上传后会在这里对比。"],
    dailyChart: ["还没有每日趋势", "有支出记录后，可以看到这个月哪几天花得比较多。"],
  };
  return copies[id] || ["还没有可展示的数据", "上传账单后，这里会显示对应的复盘图表。"];
}

function renderChart(id, type, data, label) {
  const ctx = document.getElementById(id);
  const [emptyTitle, emptyDetail] = getChartEmptyCopy(id);
  const isEmpty = !data.length;
  setChartEmptyState(id, isEmpty, emptyTitle, emptyDetail);
  if (isEmpty) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
    return;
  }
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
  const [emptyTitle, emptyDetail] = getChartEmptyCopy(id);
  const isEmpty = !data.length;
  setChartEmptyState(id, isEmpty, emptyTitle, emptyDetail);
  if (isEmpty) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
    return;
  }
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

function buildMonthlyAssistantNote(stats) {
  if (!stats.transactions.length) {
    return [
      "这个月还没有足够的账单数据。",
      "上传支付宝、微信或银行账单后，我会帮你整理：钱主要花在哪些类别、哪些退款已抵扣、哪些消费比较集中。",
    ].join("\n");
  }

  const categories = aggregateNet(stats.expenses, [], "category");
  const platforms = aggregateNet(stats.expenses, [], "platform");
  const merchants = aggregate(stats.expenses, "merchant");
  const topCategories = categories.slice(0, 2).map((item) => `「${item.name}」`);
  const topPlatform = platforms[0];
  const topMerchant = merchants[0];
  const budget = getCurrentMonthBudget();
  const budgetStatus = getBudgetStatus(stats.totalExpense, budget);
  const lines = [];

  if (topCategories.length) {
    lines.push(`这个月你的真实支出主要集中在 ${topCategories.join("和")}。`);
  } else {
    lines.push("这个月还没有明显的支出类别分布，继续上传账单后会更完整。");
  }

  if (stats.refunds.length) {
    lines.push(`其中有 ${stats.refunds.length} 笔退款已经按抵扣处理，合计 ${money.format(stats.totalRefund)}，没有被算作收入。`);
  } else {
    lines.push("这个月暂时没有识别到退款抵扣，收入和支出会分开统计。");
  }

  if (topPlatform) {
    lines.push(`支付平台里比较明显的是「${topPlatform.name}」，净支出约 ${money.format(topPlatform.value)}。`);
  }

  if (topMerchant?.name) {
    lines.push(`如果想看看消费集中点，可以先关注高频或高额交易，比如「${topMerchant.name}」。`);
  } else {
    lines.push("如果想控制预算，可以先关注高频小额消费，比如便利店、外卖和饮品。");
  }

  if (budget) {
    lines.push(`预算方面可以参考当前进度：${budgetStatus.text}`);
  }

  return lines.join("\n\n");
}

function renderSummary(stats) {
  currentAssistantStats = stats;
  if (generateInsightButton) {
    generateInsightButton.disabled = !stats.transactions.length;
  }
  const localCards = buildAssistantNoteCards(stats);
  if (!stats.transactions.length && localCards[0]) {
    localCards[0] = {
      title: "等待账单数据",
      text: "上传并选择账单后，这里会生成本月消费复盘。当前版本使用本地规则生成，不会上传完整账单明细。",
      empty: true,
    };
  }
  renderAssistantCards(localCards, {
    provider: "Local rule",
    privacyNote: "当前为本地规则复盘；点击按钮后仅发送脱敏统计摘要。",
  });
  return;
  const target = document.getElementById("aiSummary");
  const cards = buildAssistantNoteCards(stats);
  if (!stats.transactions.length && cards[0]) {
    cards[0] = {
      title: "等待账单数据",
      text: "上传并选择账单后，这里会生成本月消费复盘。当前版本使用本地规则生成，不会上传完整账单明细。",
      empty: true,
    };
  }
  target.innerHTML = `
    <div class="assistant-note-list">
      ${cards
        .map(
          (card, index) => `
            <article class="assistant-note-card${card.empty ? " is-empty" : ""}">
              <span class="assistant-note-index">${String(index + 1).padStart(2, "0")}</span>
              <strong class="assistant-note-title">${escapeHtml(card.title)}</strong>
              <span class="assistant-note-text">${escapeHtml(card.text)}</span>
            </article>
          `
        )
        .join("")}
    </div>
  `;
  return;
  const category = aggregateNet(stats.expenses, [], "category");
  const platform = aggregateNet(stats.expenses, [], "platform");
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

function renderTable(rows, total, filteredCount = rows.length, totalPages = 0, filteredTransactionCount = filteredCount) {
  ensureTransactionTableSelectionHeader();
  const tbody = document.getElementById("transactionTable");
  const hint = document.getElementById("tableHint");
  const displayPage = filteredCount ? currentTablePage : 0;
  hint.textContent = `共 ${filteredCount} 条明细，当前显示第 ${displayPage} / ${totalPages} 页`;
  const countText = filteredTransactionCount !== filteredCount
    ? `\u5171 ${filteredCount} \u7ec4\u660e\u7ec6\uff0c\u542b ${filteredTransactionCount} \u6761\u4ea4\u6613`
    : `\u5171 ${filteredCount} \u6761\u660e\u7ec6`;
  hint.textContent = `${countText}\uff0c\u5f53\u524d\u663e\u793a\u7b2c ${displayPage} / ${totalPages} \u9875`;
  renderTableResultStatus({ filteredCount, totalPages, filteredTransactionCount });
  updateTransactionSelectionControls();

  if (!rows.length) {
    const emptyContent = total
      ? "没有符合条件的明细"
      : `
        <div class="transaction-empty-state">
          <strong>请选择一个或多个月度账单查看明细</strong>
          <span>你可以从“月度账单库”中选择某个月份和平台，<br />例如：2026-04 · 支付宝。</span>
          <div class="transaction-empty-actions">
            <button class="action-button primary-action" type="button" data-empty-transaction-action="view-all">查看全部账单</button>
            <button class="action-button" type="button" data-empty-transaction-action="upload">上传新账单</button>
          </div>
        </div>
      `;
    const normalizedEmptyContent = total
      ? `
        <div class="transaction-empty-state">
          <strong>没有找到匹配流水</strong>
          <span>可以清空搜索和筛选条件后再试。</span>
          <div class="transaction-empty-actions">
            <button class="action-button primary-action" type="button" data-empty-transaction-action="clear-filters">清空搜索和筛选</button>
          </div>
        </div>
      `
      : emptyContent;
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row">${normalizedEmptyContent}</td></tr>`;
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
    if (!isRefundPairDisplayItem(item) || item.refundPairRole !== "refund") return groups;
    const children = groups.get(item.refundGroupKey) || [];
    children.push(item);
    groups.set(item.refundGroupKey, children);
    return groups;
  }, new Map());
  refundOffsetChildrenByGroup.forEach((children) => {
    children.sort((a, b) => getRefundPairRoleOrder(a) - getRefundPairRoleOrder(b) || getTransactionTimeValue(a) - getTransactionTimeValue(b));
  });
  const refundOriginalGroups = new Set(
    rows
      .filter((item) => isRefundPairDisplayItem(item) && item.refundPairRole === "originalExpense")
      .map((item) => item.refundGroupKey)
  );

  return rows.flatMap((item) => {
    if (["bankDuplicate", "bankTransferDuplicate"].includes(item.duplicatePairRole) && item.duplicateGroupKey) return [];
    if (isRefundPairDisplayItem(item)) {
      if (item.refundPairRole !== "originalExpense") {
        if (refundOriginalGroups.has(item.refundGroupKey)) return [];
        return [{ kind: "transaction", item, duplicateChildren: [], mergeChildren: [] }];
      }
      const children = refundOffsetChildrenByGroup.get(item.refundGroupKey) || [];
      const parent = createRefundOffsetDisplayParent(item, children);
      const expandedChildren = isRefundGroupExpandedForDisplay(parent, children)
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

function isRefundPairDisplayItem(item) {
  return Boolean(item?.refundGroupKey && ["originalExpense", "refund"].includes(item.refundPairRole));
}

function isRefundGroupExpandedForDisplay(parent, children = []) {
  if (expandedRefundOffsetGroups.has(parent.refundGroupKey)) return true;
  if (autoExpandedRefundOffsetGroups.has(parent.refundGroupKey)) return true;
  const keyword = tableSearch.value.trim().toLowerCase();
  if (!keyword || !children.length) return false;
  return transactionMatchesSearch(parent, keyword) || children.some((child) => transactionMatchesSearch(child, keyword));
}

function createRefundOffsetDisplayParent(originalExpense, children) {
  const originalAmount = Number(originalExpense.originalAmount ?? originalExpense.amount ?? 0);
  const refundedAmount = getRefundedAmountForDisplay(originalExpense, children);
  const netAmount = Math.max(0, roundMoneyAmount(originalAmount - refundedAmount));
  return {
    ...originalExpense,
    id: originalExpense.id,
    editDescriptionTargetId: originalExpense.id,
    type: originalExpense.originalTypeBeforeRefundOffset || originalExpense.type,
    category: originalExpense.originalCategoryBeforeRefundOffset || originalExpense.category,
    amount: netAmount,
    originalAmount,
    refundedAmount,
    refundStatus: normalizeRefundStatus(originalExpense.refundStatus) || (netAmount <= 0 ? "full" : "partial"),
    refundGroupKey: originalExpense.refundGroupKey,
    refundOffsetChildrenCount: children.length,
    isRefundOffsetParent: true,
  };
}

function getRefundedAmountForDisplay(originalExpense, children = []) {
  const explicit = Number(originalExpense.refundedAmount);
  if (Number.isFinite(explicit) && explicit > 0) return roundMoneyAmount(explicit);
  const rawJson = getRawJsonObject(originalExpense);
  const rawRefundTotal = Number(rawJson?.refundTotalAmount);
  if (Number.isFinite(rawRefundTotal) && rawRefundTotal > 0) return roundMoneyAmount(rawRefundTotal);
  return roundMoneyAmount(children.reduce((total, child) => total + Number(child.amount || 0), 0));
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
        ${renderUnmatchedRefundHint(item)}
        ${renderMatchedRefundOutsideViewHint(item)}
      </td>
      <td data-label="类别" class="category-cell">${renderCategorySelect(item)}</td>
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
    <button class="duplicate-toggle time-duplicate-toggle" type="button" data-refund-offset-group="${escapeHtml(groupKey || "")}" title="展开退款明细">
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
      <td data-label="类别" class="category-cell">${renderCategorySelect(item)}</td>
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
        ${renderRefundOffsetHint(item)}
      </td>
      <td data-label="类别" class="category-cell">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell">${renderMergeSelectControl(item)}</td>
    </tr>
  `;
}

function renderRefundOffsetHint(item) {
  const refundedAmount = Number(item.refundedAmount || 0);
  const netAmount = Number(item.amount || 0);
  if (!Number.isFinite(refundedAmount) || refundedAmount <= 0) return "";
  const status = normalizeRefundStatus(item.refundStatus) === "full" || netAmount <= 0 ? "已全额退款" : `已部分退款 ${money.format(refundedAmount)}`;
  const detail = netAmount <= 0
    ? `已抵扣 ${money.format(refundedAmount)} · 净支出 ${money.format(0)}`
    : `净支出 ${money.format(netAmount)}`;
  return `<div class="refund-offset-hint">${escapeHtml(status)} · ${escapeHtml(detail)}</div>`;
}

function renderUnmatchedRefundHint(item) {
  const rawJson = getRawJsonObject(item);
  if (!isRefundTransaction(item) || rawJson?.refundMatchStatus !== "unmatched") return "";
  return `<div class="refund-offset-hint">未匹配到原支出 · 不计入收入/支出</div>`;
}

function renderMatchedRefundOutsideViewHint(item) {
  const rawJson = getRawJsonObject(item);
  const isMatchedRefund = item?.refundPairRole === "refund" || rawJson?.refundLinked === true || rawJson?.refundMatchStatus === "matched";
  if (!isRefundTransaction(item) || !isMatchedRefund || rawJson?.refundMatchStatus === "unmatched") return "";
  return `<div class="refund-offset-hint">å·²åŒ¹é…é€€æ¬¾ï¼Œä½†åŽŸä»˜æ¬¾ä¸åœ¨å½“å‰è§†å›¾ Â· ä¸è®¡å…¥æ”¶å…¥/æ”¯å‡º</div>`;
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
      <td data-label="类别" class="category-cell">${renderCategorySelect(displayItem)}</td>
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
      <td data-label="类别" class="category-cell">${renderCategorySelect(item)}</td>
      <td data-label="收支类型">${renderTypeSelect(item)}</td>
      <td data-label="金额" class="amount-cell ${getAmountClass(item.type)}">${formatDisplayAmount(item)}</td>
      <td data-label="选择" class="select-cell"></td>
    </tr>
  `;
}

function handleTransactionTableClick(event) {
  const emptyAction = event.target.closest("[data-empty-transaction-action]");
  if (emptyAction) {
    event.preventDefault();
    if (emptyAction.dataset.emptyTransactionAction === "view-all") {
      loadAllBackendTransactions();
    } else if (emptyAction.dataset.emptyTransactionAction === "upload") {
      billUploader.click();
    } else if (emptyAction.dataset.emptyTransactionAction === "clear-filters") {
      clearSearchAndTableFilters();
    }
    return;
  }

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
  const canEditSimilar = selectedCount === 1;
  if (cancelManualMergeButton) {
    cancelManualMergeButton.textContent = `已选 ${selectedCount} 条`;
  }
  if (similarEditHint) {
    similarEditHint.textContent = getSimilarEditHintText(selected);
    similarEditHint.classList.toggle("has-sample", selectedCount === 1);
    similarEditHint.classList.toggle("is-warning", selectedCount > 1);
  }
  if (editSimilarTransactionsButton) {
    editSimilarTransactionsButton.disabled = !canEditSimilar;
  }
  startManualMergeButton.disabled = !canMerge;
  confirmManualMergeButton.disabled = !canSplit;
}

function getSimilarEditHintText(selectedItems) {
  if (!selectedItems.length) return "请先选中一条流水作为样本。";
  if (selectedItems.length > 1) return "修改同类账单需要选择 1 条样本流水，请只保留一条选中。";

  const item = selectedItems[0];
  const merchant = cleanCell(item.merchant) || "未记录商户";
  const description = getTransactionDescriptionSummary(item) || "无交易说明";
  const category = cleanCell(item.category) || "待确认";
  const type = cleanCell(item.type) || "待确认";
  const amount = Number.isFinite(Number(item.amount)) ? money.format(Number(item.amount)) : "-";
  return `当前样本：${merchant} / ${description} · ${category} · ${type} · ${amount}`;
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

function ensureTransactionToolbarOrder() {
  const toolbar = manageCategoriesButton?.parentElement;
  if (!toolbar || !manageCategoriesButton || !editSimilarTransactionsButton || !startManualMergeButton || !confirmManualMergeButton) return;
  toolbar.insertBefore(editSimilarTransactionsButton, startManualMergeButton);
  toolbar.insertBefore(startManualMergeButton, confirmManualMergeButton);
}

function showSimilarTransactionSelectionPrompt(message) {
  setStatus(message);
  showAppModal({
    title: "提示",
    message,
    confirmText: "知道了",
    showCancel: false,
    tone: "default",
  });
}

function openSimilarTransactionModal(event) {
  event?.preventDefault();
  const selectedItems = getSelectedTransactions();
  if (!selectedItems.length) {
    showSimilarTransactionSelectionPrompt(SIMILAR_SELECT_ONE_MESSAGE);
    return;
  }
  if (selectedItems.length > 1) {
    showSimilarTransactionSelectionPrompt(SIMILAR_SELECT_ONLY_ONE_MESSAGE);
    return;
  }
  if (!selectedItems.length) {
    setStatus("请先选择一条明细");
    return;
  }
  if (selectedItems.length > 1) {
    setStatus("请只选择一条作为同类账单样本");
    return;
  }

  pendingSimilarTransaction = selectedItems[0];
  renderSimilarTransactionModal(pendingSimilarTransaction);
  similarTransactionModal?.classList.remove("hidden");
}

function renderSimilarTransactionModal(transaction) {
  if (!transaction) return;
  const category = cleanCell(transaction.category) || "待确认";
  const type = TYPE_OPTIONS.includes(transaction.type) ? transaction.type : TYPE_OPTIONS[0];
  if (similarSampleMerchant) similarSampleMerchant.textContent = transaction.merchant || "-";
  if (similarSampleDescription) similarSampleDescription.textContent = getTransactionDescriptionSummary(transaction) || "-";
  if (similarSampleAmount) similarSampleAmount.textContent = money.format(Number(transaction.amount || 0));
  if (similarSampleCategory) similarSampleCategory.textContent = category;
  if (similarSampleType) similarSampleType.textContent = transaction.type || "-";

  renderSimilarTypeOptions(type);
  renderSimilarCategoryOptions(type, category);
  if (similarRememberChoiceInput) similarRememberChoiceInput.checked = false;
  updateSimilarRememberCopy();
  if (similarTransactionMessage) similarTransactionMessage.textContent = "";
}

function updateSimilarRememberCopy() {
  const saveAsRule = Boolean(similarRememberChoiceInput?.checked);
  if (similarRememberDescription) {
    similarRememberDescription.textContent = saveAsRule
      ? "同时记住这次选择。后续上传的新账单中，命中相似规则的交易会优先按此分类。"
      : "仅修改当前已有的同类交易，不会生成后续分类规则。";
  }
  if (similarConfirmNote) {
    similarConfirmNote.textContent = saveAsRule
      ? "确认修改当前已有同类交易，并记住这次选择用于后续新账单分类？"
      : "确认修改当前已有同类交易？这不会生成后续分类规则。";
  }
}

function renderSimilarTypeOptions(selectedType) {
  if (!similarTargetTypeSelect) return;
  similarTargetTypeSelect.innerHTML = TYPE_OPTIONS.map((type) => `<option value="${escapeHtml(type)}" ${type === selectedType ? "selected" : ""}>${escapeHtml(type)}</option>`).join("");
}

function renderSimilarCategoryOptions(type, selectedCategory) {
  if (!similarTargetCategorySelect) return;
  const options = mergeUnique(getCategoryOptions(type), [selectedCategory || "待确认"]);
  similarTargetCategorySelect.innerHTML = options.map((category) => `<option value="${escapeHtml(category)}" ${category === selectedCategory ? "selected" : ""}>${escapeHtml(category)}</option>`).join("");
}

function handleSimilarTargetTypeChange() {
  const type = similarTargetTypeSelect?.value || TYPE_OPTIONS[0];
  const currentCategory = similarTargetCategorySelect?.value || pendingSimilarTransaction?.category || "待确认";
  const nextCategory = normalizeCategoryForType(type, currentCategory, {
    description: pendingSimilarTransaction?.description || "",
    merchant: pendingSimilarTransaction?.merchant || "",
    transactionType: pendingSimilarTransaction?.transactionType || "",
  });
  renderSimilarCategoryOptions(type, nextCategory);
  if (similarTargetCategorySelect) similarTargetCategorySelect.value = nextCategory;
}

async function confirmSimilarTransactionEdit() {
  if (!pendingSimilarTransaction) {
    setStatus("请先选择一条明细");
    return;
  }
  const transactionId = pendingSimilarTransaction.id;
  const category = similarTargetCategorySelect?.value || "";
  const type = similarTargetTypeSelect?.value || "";
  const saveAsRule = Boolean(similarRememberChoiceInput?.checked);
  if (!transactionId || !category || !type) {
    if (similarTransactionMessage) similarTransactionMessage.textContent = "请先选择类别和收支类型";
    return;
  }

  const payload = {
    category,
    type,
    saveAsRule,
  };

  showAppModal({
    title: saveAsRule ? "确认修改并记住规则" : "确认修改同类账单",
    message: saveAsRule
      ? "确认修改当前已有同类交易，并记住这次选择用于后续新账单分类吗？"
      : "确认修改当前已有同类交易吗？",
    detail: saveAsRule
      ? "后续上传的新账单中，命中相似规则的交易会优先按此分类。排除、转账、退款等特殊流水仍会受到规则保护。"
      : "这不会生成后续分类规则，仅影响当前已匹配到的同类交易。",
    confirmText: saveAsRule ? "确认并记住" : "确认修改",
    cancelText: "取消",
    tone: "warning",
    onConfirm: () => executeSimilarTransactionEdit(transactionId, payload),
  });
}

async function executeSimilarTransactionEdit(transactionId, payload) {
  const { category, type, saveAsRule } = payload;
  setSimilarTransactionSubmitting(true);
  if (similarTransactionMessage) similarTransactionMessage.textContent = "";
  try {
    const response = await applySimilarTransactionToBackend(transactionId, payload);
    const appliedCount = Number(response.appliedCount || 0);
    console.info("[Apply Similar Transaction]", {
      transactionId,
      category,
      type,
      saveAsRule,
      appliedCount,
    });
    const message = saveAsRule
      ? "已修改同类交易，并记住本次选择，后续新账单会优先应用此规则。"
      : "已修改当前已有同类交易，未生成后续分类规则。";
    closeSimilarTransactionModal();
    clearTransactionSelection();
    await refreshCurrentBackendTransactions(message);
  } catch (error) {
    const message = getSimilarTransactionErrorMessage(error);
    if (similarTransactionMessage) similarTransactionMessage.textContent = message;
    setStatus(message);
    console.warn("[Apply Similar Transaction Failed]", error);
  } finally {
    setSimilarTransactionSubmitting(false);
  }
}

function closeSimilarTransactionModal() {
  similarTransactionModal?.classList.add("hidden");
  pendingSimilarTransaction = null;
  if (similarTransactionMessage) similarTransactionMessage.textContent = "";
}


function setSimilarTransactionSubmitting(isSubmitting) {
  if (!confirmSimilarTransactionEditButton) return;
  confirmSimilarTransactionEditButton.disabled = isSubmitting;
  confirmSimilarTransactionEditButton.textContent = isSubmitting ? "修改中..." : "确定";
}

function showAppModal(options = {}) {
  if (!appModalBackdrop || !appModalDialog) return;
  const tone = ["default", "warning", "danger", "success"].includes(options.tone) ? options.tone : "default";
  const showCancel = options.showCancel !== false;
  const toneLabels = {
    default: "提示",
    warning: "请确认",
    danger: "重要确认",
    success: "已完成",
  };

  activeAppModalOptions = options;
  appModalDialog.classList.remove("app-modal-default", "app-modal-warning", "app-modal-danger", "app-modal-success");
  appModalDialog.classList.add(`app-modal-${tone}`);
  if (appModalToneLabel) appModalToneLabel.textContent = options.toneLabel || toneLabels[tone];
  if (appModalTitle) appModalTitle.textContent = options.title || "提示";
  if (appModalMessage) appModalMessage.textContent = options.message || "";
  if (appModalDetail) {
    appModalDetail.textContent = options.detail || "";
    appModalDetail.classList.toggle("hidden", !options.detail);
  }
  if (appModalConfirmButton) appModalConfirmButton.textContent = options.confirmText || "确定";
  if (appModalCancelButton) {
    appModalCancelButton.textContent = options.cancelText || "取消";
    appModalCancelButton.classList.toggle("hidden", !showCancel);
  }
  appModalBackdrop.classList.remove("hidden");
  appModalConfirmButton?.focus();
}

function closeAppModal() {
  appModalBackdrop?.classList.add("hidden");
  activeAppModalOptions = null;
}

function confirmAppModal() {
  const onConfirm = activeAppModalOptions?.onConfirm;
  closeAppModal();
  if (typeof onConfirm === "function") onConfirm();
}

function cancelAppModal() {
  const onCancel = activeAppModalOptions?.onCancel;
  closeAppModal();
  if (typeof onCancel === "function") onCancel();
}

function handleAppModalBackdropClick(event) {
  if (event.target === appModalBackdrop) cancelAppModal();
}

function getSimilarTransactionErrorMessage(error) {
  if (error?.status === 404) return "样本交易不存在，请刷新后重试";
  if (error?.status === 400) return "这条明细暂时无法自动匹配同类账单，请尝试直接修改单条明细";
  return error?.message || "同类账单修改失败，请稍后重试";
}

async function refreshCurrentBackendTransactions(statusText) {
  if (!USE_BACKEND_STORAGE) {
    renderSelectedMonth(document.getElementById("monthFilter").value);
    markSaved(statusText);
    return;
  }
  if (activeBackendBillFilter) {
    const filter = { ...activeBackendBillFilter };
    if (isBackendBillRemoved(filter.month, filter.platform)) {
      renderEmptyTransactionState(statusText || "当前账单已从前端账单库中隐藏。");
      return;
    }
    const transactions = await fetchTransactionsFromBackend(filter);
    applyBackendTransactionsToDashboard(transactions, {
      month: filter.month,
      titleText: `${filter.month} · ${filter.platform}`,
      preserveSearch: true,
      statusText,
    });
  } else if (activeBackendBillSelection?.length) {
    const selection = activeBackendBillSelection.filter((bill) => !isBackendBillRemoved(bill.month, bill.platform)).map((bill) => ({ ...bill }));
    if (!selection.length) {
      renderEmptyTransactionState(statusText || "当前已选账单均已隐藏，请重新选择账单。");
      return;
    }
    const groupedTransactions = await Promise.all(selection.map((bill) => fetchTransactionsFromBackend(bill)));
    applyBackendTransactionsToDashboard(groupedTransactions.flat(), {
      titleText: getBackendBillSelectionTitle(selection),
      preserveSearch: true,
      statusText,
    });
    activeBackendBillSelection = selection;
  } else if (activeBackendBillMode === "all") {
    const transactions = filterRemovedBackendTransactions(await fetchTransactionsFromBackend());
    applyBackendTransactionsToDashboard(transactions, {
      titleText: "全部账单",
      preserveSearch: true,
      statusText,
    });
  } else {
    renderEmptyTransactionState(statusText || "请选择一个或多个月度账单查看明细");
    return;
  }
  await loadBackendBillLibrary({ preserveOnFailure: true });
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
  showAppModal({
    title: "拆分账单",
    message: "确认拆分当前账单吗？",
    detail: "拆分后，合并明细将删除，原始明细会恢复为普通账单。请确认当前账单数据已保存。",
    confirmText: "确认拆分",
    cancelText: "取消",
    tone: "warning",
    onConfirm: () => splitMergedBill(parentTransaction),
  });
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
  return buildFilteredRefundAwareRows(currentTableTransactions).rows;
}

function buildFilteredRefundAwareRows(transactions, searchKeyword = tableSearch.value.trim().toLowerCase()) {
  const groups = buildRefundAwareDisplayGroups(transactions);
  const matchedGroups = groups.filter((group) => {
    const matchedItems = group.items.filter((item) => transactionMatchesSearch(item, searchKeyword) && transactionMatchesTableFilters(item));
    if (!matchedItems.length) return false;
    if (group.kind === "refund" && group.original?.refundGroupKey && shouldAutoExpandRefundGroupForFilter(group, matchedItems, searchKeyword)) {
      autoExpandedRefundOffsetGroups.add(group.original.refundGroupKey);
    }
    return true;
  });
  const sortedGroups = sortRefundAwareDisplayGroups(matchedGroups);
  const rowIds = new Set();
  const rows = sortedGroups.flatMap((group) =>
    group.rows.filter((item) => {
      if (!item?.id) return true;
      if (rowIds.has(item.id)) return false;
      rowIds.add(item.id);
      return true;
    })
  );

  return {
    groups: sortedGroups,
    rows,
    groupCount: sortedGroups.length,
    transactionCount: rowIds.size,
  };
}

function buildRefundAwareDisplayGroups(transactions) {
  const groups = [];
  const groupedIds = new Set();
  const refundGroups = buildRefundSearchGroups(transactions);

  refundGroups.forEach((group, key) => {
    const children = uniqueTransactionsById(group.children || []).sort(
      (a, b) => getRefundPairRoleOrder(a) - getRefundPairRoleOrder(b) || getTransactionTimeValue(a) - getTransactionTimeValue(b)
    );
    if (group.original) {
      const rows = [group.original, ...children];
      rows.forEach((item) => {
        if (item?.id) groupedIds.add(item.id);
      });
      groups.push({
        kind: "refund",
        key,
        main: group.original,
        original: group.original,
        children,
        items: rows,
        rows,
      });
      return;
    }

    children.forEach((child) => {
      if (child?.id) groupedIds.add(child.id);
      groups.push({
        kind: "refundOutsideView",
        key: `${key || "refund"}:${child?.id || groups.length}`,
        main: child,
        original: null,
        children: [],
        items: [child],
        rows: [child],
      });
    });
  });

  transactions.forEach((item) => {
    if (item?.id && groupedIds.has(item.id)) return;
    groups.push({
      kind: "transaction",
      key: item?.id || `transaction:${groups.length}`,
      main: item,
      original: null,
      children: [],
      items: [item],
      rows: [item],
    });
  });

  return groups;
}

function hasActiveTableQuery() {
  return Boolean(tableSearch.value.trim() || Object.values(tableFilters).some(Boolean));
}

function getActiveTableFilterLabels() {
  const labels = {
    platform: "来源",
    type: "类型",
    category: "分类",
    merchant: "交易对象",
    transactionType: "交易类型",
  };
  return Object.entries(tableFilters)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${labels[key] || key}：${value}`);
}

function updateClearTableFiltersButton() {
  if (clearTableFiltersButton) {
    clearTableFiltersButton.disabled = !hasActiveTableQuery();
  }
}

function renderTableResultStatus({ filteredCount = 0, totalPages = 0, filteredTransactionCount = filteredCount } = {}) {
  if (!tableResultStatus) return;
  const keyword = tableSearch.value.trim();
  const filterLabels = getActiveTableFilterLabels();
  const hasQuery = Boolean(keyword || filterLabels.length);
  const displayCount = filteredTransactionCount || filteredCount;
  if (!currentTableTransactions.length) {
    tableResultStatus.textContent = activeBackendBillMode === "empty"
      ? "当前未选择账单。请选择一个月度账单查看明细和复盘。"
      : "当前账单暂无可展示流水。";
  } else if (!displayCount) {
    tableResultStatus.textContent = "没有找到匹配流水，可以清空搜索和筛选条件后再试。";
  } else if (keyword && filterLabels.length) {
    tableResultStatus.textContent = `搜索“${keyword}”并按 ${filterLabels.join("、")} 筛选，找到 ${displayCount} 条相关流水。`;
  } else if (keyword) {
    tableResultStatus.textContent = `搜索“${keyword}”后找到 ${displayCount} 条相关流水。`;
  } else if (filterLabels.length) {
    tableResultStatus.textContent = `已按 ${filterLabels.join("、")} 筛选，找到 ${displayCount} 条流水。`;
  } else {
    tableResultStatus.textContent = `当前视图共 ${displayCount} 条流水，正在显示第 ${filteredCount ? currentTablePage : 0} / ${totalPages} 页。`;
  }
  tableResultStatus.classList.toggle("is-empty", !displayCount);
  tableResultStatus.classList.toggle("has-query", hasQuery);
  updateClearTableFiltersButton();
}

function uniqueTransactionsById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id || item;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sortRefundAwareDisplayGroups(groups) {
  const groupByMain = new Map(groups.map((group) => [group.main, group]));
  return sortTransactionsForDisplay(groups.map((group) => group.main))
    .map((item) => groupByMain.get(item))
    .filter(Boolean);
}

function shouldAutoExpandRefundGroupForFilter(group, matchedItems, searchKeyword) {
  if (!group.children.length) return false;
  if (searchKeyword) return group.original ? matchedItems.some((item) => item.id === group.original.id || group.children.some((child) => child.id === item.id)) : false;
  if (!hasActiveTableFilters()) return false;
  const matchedRefundChild = matchedItems.some((item) => item?.id && group.children.some((child) => child.id === item.id));
  return matchedRefundChild;
}

function hasActiveTableFilters() {
  return Object.values(tableFilters).some(Boolean);
}

function transactionMatchesTableFilters(item) {
  const matchesPlatform = !tableFilters.platform || getDisplaySourcePlatform(item) === tableFilters.platform;
  const matchesType = !tableFilters.type || item.type === tableFilters.type;
  const matchesCategory = !tableFilters.category || item.category === tableFilters.category;
  const matchesMerchant = !tableFilters.merchant || item.merchant === tableFilters.merchant;
  const matchesTransactionType = !tableFilters.transactionType || (item.transactionType || "-") === tableFilters.transactionType;
  return matchesPlatform && matchesType && matchesCategory && matchesMerchant && matchesTransactionType;
}

function transactionMatchesSearch(item, keyword) {
  if (!keyword) return true;
  return getSearchTextForTransaction(item).includes(keyword);
}

function getSearchTextForTransaction(item) {
  const rawJson = getRawJsonObject(item);
  const refundStatus = normalizeRefundStatus(item?.refundStatus || rawJson?.refundStatus);
  const refundedAmount = Number(item?.refundedAmount ?? rawJson?.refundTotalAmount ?? rawJson?.refundedAmount ?? 0);
  const netAmount = Number(rawJson?.netAmount ?? item?.amount ?? 0);
  const refundHint = [
    refundStatus === "full" ? "已全额退款" : "",
    refundStatus === "partial" ? "已部分退款" : "",
    refundedAmount ? `已抵扣 ${money.format(refundedAmount)} ${refundedAmount}` : "",
    Number.isFinite(netAmount) ? `净支出 ${money.format(Math.max(0, netAmount))} ${Math.max(0, netAmount)}` : "",
    isRefundTransaction(item) ? "退款 退款/抵扣 refund" : "",
  ];
  const rawValues = rawJson && typeof rawJson === "object" ? Object.values(rawJson) : [];
  const fields = [
    item?.time,
    item?.sourcePlatform,
    item?.source_platform,
    item?.__sourcePlatform,
    item?.billSource,
    item?.platform,
    item?.paymentMethod,
    item?.payment_method,
    item?.merchant,
    item?.description,
    item?.memo,
    item?.summary,
    item?.transactionType,
    item?.transaction_type,
    item?.category,
    item?.type,
    String(item?.amount ?? ""),
    Number.isFinite(Number(item?.amount)) ? money.format(Number(item.amount)) : "",
    ...refundHint,
    ...rawValues,
  ];
  return fields.map((value) => String(value || "").toLowerCase()).join(" ");
}

function buildRefundSearchGroups(transactions) {
  const groups = new Map();
  const byId = new Map(transactions.map((item) => [item.id, item]));
  transactions.forEach((item) => {
    const rawJson = getRawJsonObject(item);
    const originalId = item.refundOriginalTransactionId || rawJson?.refundOriginalTransactionId || rawJson?.refundMatchedOriginalTransactionId || "";
    const groupKey = item.refundGroupKey || rawJson?.refundGroupKey || (originalId ? `refund-original-${originalId}` : "");
    const refundTransactionIds = rawJson?.refundTransactionIds || rawJson?.refundMatchedRefundTransactionIds || [];

    if (item.refundPairRole === "originalExpense" || rawJson?.refundMatched === true) {
      const key = groupKey || `refund-original-${item.id}`;
      const group = groups.get(key) || { original: null, children: [] };
      group.original = item;
      refundTransactionIds.forEach((id) => {
        const child = byId.get(id);
        if (child && !group.children.some((entry) => entry.id === child.id)) group.children.push(child);
      });
      groups.set(key, group);
    }

    if (item.refundPairRole === "refund" || rawJson?.refundLinked === true) {
      const key = groupKey || `refund-original-${originalId}`;
      if (!key) return;
      const group = groups.get(key) || { original: null, children: [] };
      if (!group.original && originalId) group.original = byId.get(originalId) || null;
      if (!group.children.some((entry) => entry.id === item.id)) group.children.push(item);
      groups.set(key, group);
    }
  });
  return groups;
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
  autoExpandedRefundOffsetGroups = new Set();
  const filtered = buildFilteredRefundAwareRows(currentTableTransactions);
  const totalPages = Math.ceil(filtered.groupCount / PAGE_SIZE);
  if (totalPages && currentTablePage > totalPages) {
    currentTablePage = totalPages;
  }
  if (currentTablePage < 1) {
    currentTablePage = 1;
  }
  if (totalPages > 0) saveCurrentTablePage();
  const start = (currentTablePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageGroups = filtered.groups.slice(start, end);
  const pageTransactions = pageGroups.flatMap((group) => group.rows);
  renderTable(pageTransactions, currentTableTransactions.length, filtered.groupCount, totalPages, filtered.transactionCount);
  renderTablePagination(filtered.groupCount);
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

function clearSearchAndTableFilters() {
  resetTableFilters();
  setStatus("已清空搜索和筛选条件。");
}

function resetTableFilters(options = {}) {
  tableSearch.value = "";
  Object.keys(tableFilters).forEach((key) => {
    tableFilters[key] = "";
  });
  resetTablePage();
  updateHeaderFilterButtons();
  if (!options.skipRender) applyTableFilters();
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
  const category = hasCategoryManualOverride(item) || hasBackendCategoryRuleMarker(item)
    ? cleanCell(item.category) || "待确认"
    : normalizeCategoryForType(item.type, item.category, {
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

function renderRememberRuleControl(item) {
  return "";
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
  const backendUpdates = { description: nextValue };
  patchTransactionToBackend(transaction.id, backendUpdates).then(handleCategoryRulePatchResponse).catch((error) => {
    console.warn("[Backend Patch Failed]", error);
  });
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

  let backendUpdates = {};
  if (field === "type") {
    transaction.type = event.target.value;
    transaction.category = normalizeCategoryForType(transaction.type, transaction.category, {
      description: transaction.description,
      merchant: transaction.merchant,
      transactionType: transaction.transactionType,
    });
    backendUpdates = { type: transaction.type, category: transaction.category };
  } else if (field === "category") {
    transaction.category = event.target.value;
    transaction.categoryManualOverride = true;
    backendUpdates = { category: transaction.category, categoryManualOverride: true };
  }

  const tableTransaction = currentTableTransactions.find((item) => item.id === id);
  if (tableTransaction && tableTransaction !== transaction) {
    tableTransaction.type = transaction.type;
    tableTransaction.category = transaction.category;
    tableTransaction.categoryManualOverride = transaction.categoryManualOverride;
  }

  renderSelectedMonth(document.getElementById("monthFilter").value);
  saveTransactionsToStorage();
  markUnsaved();
  patchTransactionToBackend(transaction.id, backendUpdates).then(handleCategoryRulePatchResponse).catch((error) => {
    console.warn("[Backend Patch Failed]", error);
  });
}

function buildSaveAsRuleUpdates(transaction, row = null) {
  const category = row?.querySelector('[data-field="category"]')?.value || transaction.category;
  const type = row?.querySelector('[data-field="type"]')?.value || transaction.type;
  return {
    category,
    type,
    saveAsRule: true,
  };
}

function shouldSaveRowAsRule(row) {
  return Boolean(row?.querySelector("[data-rule-remember]:checked"));
}

async function handleCategoryRulePatchResponse(response) {
  if (response?.categoryRule) {
    const count = Number(response.categoryRuleAppliedCount || 0);
    const message = count > 0 ? `已保存分类规则，并更新 ${count} 条类似交易。` : "已保存分类规则，下次类似商户将自动归类。";
    setStatus(message);
    if (count > 1) {
      await refreshBackendTransactionsAfterRuleApplied(message);
    }
  }
}

async function refreshBackendTransactionsAfterRuleApplied(statusText) {
  if (!USE_BACKEND_STORAGE) return;
  try {
    await refreshCurrentBackendTransactions(statusText);
  } catch (error) {
    console.warn("[Category Rule Refresh Failed]", error);
  }
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
  if (item.isRefundOffsetParent && item.type === TYPE_OPTIONS[0]) return amountText;
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

  return Array.from(map, ([name, value]) => ({ name, value: Math.max(0, value) })).sort((a, b) => a.name.localeCompare(b.name));
}

function sum(items) {
  return roundMoneyAmount(items.reduce((total, item) => total + Number(item.amount || 0), 0));
}

function sumEffectiveIncome(items) {
  return roundMoneyAmount(items.reduce((total, item) => total + getEffectiveIncomeAmount(item), 0));
}

function sumRefundAmounts(items) {
  return roundMoneyAmount(items.reduce((total, item) => total + getRefundAmount(item), 0));
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
}
