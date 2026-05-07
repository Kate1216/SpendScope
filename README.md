# SpendScope

SpendScope 是一个多平台账单分析 Web 项目，用于解析微信、支付宝、中国银行账单，并完成月度收支统计、消费分类、跨平台重复扣款识别、退款抵扣、趋势分析和账单明细管理。

项目目前以前端可视化分析为主，前端已部署至 Netlify；支付宝 PDF 解析已接入本地 FastAPI 后端，用于提升 PDF 表格识别稳定性。

---

## 项目地址

- 在线访问地址：https://spendscopekate.netlify.app
- GitHub 仓库：https://github.com/Kate1216/SpendScope

---

## 项目目标

日常账单往往分散在微信、支付宝和银行卡中，同一笔消费可能同时出现在支付平台和银行卡流水里，直接汇总会导致重复统计。

SpendScope 希望解决以下问题：

1. 多平台账单格式不同，人工整理麻烦。
2. 微信、支付宝、中国银行账单需要统一成一套明细结构。
3. 银行流水和支付平台流水可能重复，需要自动识别重复扣款。
4. 退款、运费补偿、售后退款等需要从真实消费中抵扣。
5. 消费分类需要更清晰，减少“其他”占比。
6. 用户需要快速了解本月总支出、分类占比、平台分布和每日趋势。

---

## 当前支持的账单来源

### 1. 微信账单

- 支持微信 Excel / CSV 账单解析。
- 当前测试文件可稳定解析约 124 条明细。
- 解析逻辑在前端完成，不依赖后端。

### 2. 支付宝账单

- 支持支付宝 PDF 账单解析。
- 当前支付宝 PDF 必须通过 FastAPI 后端解析。
- 使用 `pdfplumber` 抽取 PDF 表格。
- 当前测试文件可稳定解析约 100 条明细。
- 当前已停用支付宝前端旧文本解析 fallback，避免解析结果不稳定。

### 3. 中国银行账单

- 支持中国银行 PDF 账单解析。
- 当前测试文件可稳定解析约 71 条明细。
- 解析逻辑在前端完成，不依赖后端。

---

## 技术栈

### 前端

- HTML
- CSS
- JavaScript
- 原生前端，无 React / Vue 框架
- 前端部署：Netlify

### 后端

- Python
- FastAPI
- pdfplumber
- 后端目前本地运行，用于支付宝 PDF 解析

---

## 项目结构

```text
SpendScope/
├── index.html
├── styles.css
├── script.js
├── parser-utils.js
├── parser-wechat.js
├── parser-alipay.js
├── parser-boc.js
├── dedupe.js
├── refund-match.js
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── parsers/
│       └── alipay_pdf.py
└── README.md
