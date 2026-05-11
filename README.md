# SpendScope

SpendScope 是一个个人月度账单分析 Web 应用，用来上传并解析支付宝、微信、中国银行/银行账单，按月管理账单库，查看账单明细，并生成真实净支出视角的月度消费复盘。

它的核心判断不是“这笔钱是收入还是支出”这么简单，而是先判断账单性质，再判断商品类别。尤其是退款场景：退款不是收入，也不是普通支出，而是原付款项的抵扣。

## 核心功能

- 多平台账单解析：支付宝 PDF、微信 Excel/CSV、中国银行/银行 PDF。
- 月度账单库：按月份和平台聚合账单，打开页面时只加载账单库，不自动展开明细。
- 单账单查看：点击某个月度账单后查看对应流水和复盘。
- 多账单临时合并查看：选择多个账单后合并展示，不写数据库，不改变原始账单归属。
- 查看全部账单：按当前前端可见账单范围查看所有流水。
- 删除账单：当前是前端软删除，仅从账单库和普通视图隐藏。
- 查看已删除账单：支持查看已隐藏账单、单条恢复、全部恢复。
- 账单明细：支持搜索、筛选、分页、空状态提示和结果状态说明。
- 单条修改：可直接修改某条流水的分类、收支类型和说明。
- 修改同类账单：以一条流水为样本，批量修改当前已有同类交易。
- 记住我的选择：可沉淀为 `category_rules`，用于后续上传账单时优先分类。
- 退款处理：自动识别退款、配对原付款、写入 metadata，并在前端折叠展示。
- 月度消费复盘：分类气泡图、平台支出卡片、每日净支出节奏和账单小助手。
- AI 小结接口预留：提供 `POST /api/insights/generate`，当前只返回本地规则小结。

## 页面结构

SpendScope 当前主界面分为三页：

- 本月总览：上传账单、查看月度账单库、当前视图状态、核心统计摘要和预算提醒。
- 账单明细：查看选中账单的流水，支持搜索、筛选、分页、分类修改和修改同类账单。
- 趋势分析 / 月度消费复盘：重点复盘钱花在哪、主要支付平台、每日净支出节奏和账单小助手。

## 退款逻辑

SpendScope 明确采用净支出视角处理退款。

- 退款不计入收入。
- 退款不计入普通支出。
- 退款作为原付款项抵扣。
- 原付款项优先使用 `raw_json.netAmount` 参与统计。
- 支持部分退款、全额退款、多笔退款累计。
- 已匹配退款折叠在原付款项下方展示，原付款项显示抵扣后的净支出。
- 未匹配退款独立显示，并且不计入收入或普通支出。
- 排除、转账、亲情卡、账户转移、银行重复扣款等特殊流水不会被普通消费分类规则随意覆盖。

示例：

```text
原付款：30.00
退款：10.00
净支出：20.00
收入影响：0.00
```

更完整的退款说明见 [docs/refund-logic.md](docs/refund-logic.md)。

## 分类与规则

SpendScope 支持两类修改：

- 单条修改：只修改当前流水，不创建规则。
- 修改同类账单：以当前选中流水为样本，批量修改当前已有同类交易。

如果用户勾选“记住我的选择”，SpendScope 会创建或更新 `category_rules`。后续上传的新账单中，命中相似规则的交易会优先按此分类。

规则应用前会先判断交易性质，保护退款、转账、排除、亲情卡、账户转移、银行重复扣款等特殊流水，避免被普通商品分类误伤。

## AI 小结与隐私设计

当前 AI 小结是接口预留和本地规则版本：

- 当前不接 DeepSeek。
- 当前不接 Kimi。
- 当前 provider 是 `local-rule`。
- `POST /api/insights/generate` 只接收脱敏统计摘要。
- 不上传完整账单明细。
- 不上传 `merchant`、`description`、`raw_json`。
- 不上传订单号、银行卡号、姓名。
- 不读取或写死任何外部模型 API Key。
- 接口失败时，前端会回退到本地规则小结。

允许传入的摘要信息包括总支出、总收入、退款抵扣、交易数量、退款数量、Top 分类、Top 平台、最高消费日的 MM-DD 和未匹配退款数量等。

## 技术栈

Frontend:

- HTML
- CSS
- JavaScript
- Chart.js
- pdf.js
- html2pdf.js

Backend:

- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy

Database:

- SQLite

Parsing dependencies:

- `pdfplumber`：支付宝 / 中国银行等 PDF 解析
- `openpyxl`：微信 Excel 账单解析
- `python-multipart`：FastAPI 文件上传

## 项目结构

```text
SpendScope/
|-- index.html
|-- styles.css
|-- script.js
|-- refund-match.js
|-- dedupe.js
|-- parser-utils.js
|-- parser-wechat.js
|-- parser-alipay.js
|-- parser-boc.js
|-- backend/
|   |-- main.py
|   |-- models.py
|   |-- schemas.py
|   |-- database.py
|   |-- requirements.txt
|   |-- parsers/
|   |   |-- alipay_pdf.py
|   |   |-- boc_parser.py
|   |   `-- wechat_parser.py
|   |-- services/
|   |   |-- bill_upload_service.py
|   |   |-- transaction_service.py
|   |   |-- statistics_service.py
|   |   |-- refund_match_service.py
|   |   |-- category_rule_service.py
|   |   |-- insight_service.py
|   |   `-- platform_detect.py
|   `-- scripts/
`-- docs/
```

## 主要后端接口

- `GET /api/health`
- `GET /api/bills`
- `GET /api/bills?month=YYYY-MM`
- `GET /api/bills?platform=<platform>`
- `GET /api/transactions`
- `PATCH /api/transactions/{transaction_id}`
- `POST /api/transactions/{transaction_id}/apply-similar`
- `GET /api/category-rules`
- `POST /api/category-rules`
- `PATCH /api/category-rules/{rule_id}`
- `DELETE /api/category-rules/{rule_id}`
- `POST /api/bills/upload`
- `POST /api/parse/alipay`
- `POST /api/insights/generate`

## 本地运行

安装后端依赖：

```bash
cd backend
python -m pip install -r requirements.txt
```

启动后端：

```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

打开前端：

- 直接用浏览器打开仓库根目录下的 `index.html`。
- 或者用任意静态文件服务器启动仓库根目录。
- 前端默认访问后端 API：`http://127.0.0.1:8000`。

## 常用检查

前端语法检查：

```bash
node --check script.js
```

后端 Python 编译检查：

```bash
cd backend
python -m py_compile main.py schemas.py services/insight_service.py
```

更完整的后端服务文件检查可按需执行：

```bash
cd backend
python -m py_compile main.py schemas.py services/bill_upload_service.py services/transaction_service.py services/statistics_service.py services/refund_match_service.py services/category_rule_service.py services/insight_service.py
```

## 项目亮点

- 从真实账单问题出发，而不是只做简单图表展示。
- 退款抵扣不是简单收入/支出分类，而是回写到原付款项的净额逻辑。
- 用户修正一次分类，可以选择沉淀为后续上传账单的分类规则。
- 多账单合并只是前端临时查看，不改变数据库中的原始账单归属。
- AI 小结前先构造脱敏摘要，并保留本地规则回退。
- 适合展示 AI 产品经理、前端产品化、数据体验设计和轻量后端能力。

## 当前限制与后续计划

- 当前“删除账单”是前端软删除，不是真正删除数据库中的流水。
- 当前 AI 小结未接入真实大模型，只提供 `local-rule` 和接口预留。
- 后续可以增加真正的数据库删除接口和回收站机制。
- 后续可以接入 DeepSeek / Kimi 等大模型，但需要继续遵守脱敏摘要原则。
- 后续可以增加更多银行格式、更多导出格式和更完善的自动化测试。

## 文档

- [Product overview](docs/product-overview.md)
- [Refund logic](docs/refund-logic.md)
- [Iteration log](docs/iteration-log.md)
- [AI and rule design](docs/ai-design.md)

