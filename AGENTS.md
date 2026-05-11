# SpendScope Agent Notes

This file is for Codex and other AI coding agents working in this repository. Treat it as the project rulebook. Follow these rules unless the user explicitly asks for a scoped exception.

## Project Overview

SpendScope is a personal monthly bill analysis Web application.

- Frontend: plain HTML / CSS / JavaScript.
- Backend: FastAPI.
- Database: SQLite.
- Supported bill sources: Alipay, WeChat, Bank of China / bank bill files.
- Current main pages:
  - 本月总览
  - 账单明细
  - 趋势分析 / 月度消费复盘

The product goal is to help users upload monthly bills, preserve transactions in a monthly bill library, inspect details, correct categories, understand refunds as offsets, and review true net spending.

## Key Files

Frontend:

- `index.html`: main page structure and modal DOM.
- `styles.css`: visual system, page layouts, responsive styles.
- `script.js`: main frontend state, bill library, transaction table, filters, pagination, editing flows, soft-delete state, review page, insight payload.
- `refund-match.js`: frontend refund matching and display helpers.
- `parser-alipay.js`: legacy/frontend Alipay parser helpers.
- `parser-wechat.js`: legacy/frontend WeChat parser helpers.
- `parser-boc.js`: legacy/frontend bank parser helpers.
- `parser-utils.js`: parser utilities.
- `dedupe.js`: duplicate / transfer display helpers.

Backend:

- `backend/main.py`: FastAPI routes.
- `backend/schemas.py`: Pydantic request/response schemas.
- `backend/services/bill_upload_service.py`: upload orchestration, parser routing, rule application, database save/upsert.
- `backend/services/transaction_service.py`: transaction listing, patching, similar transaction updates.
- `backend/services/statistics_service.py`: effective expense, effective income, refund amount helpers.
- `backend/services/refund_match_service.py`: backend refund pairing and metadata.
- `backend/services/category_rule_service.py`: category rules, similarity logic, semantic guard.
- `backend/services/insight_service.py`: local-rule insight card generation.

Older parser files may still exist in the frontend. Do not assume the project is frontend-only.

## Core Business Principles

Always preserve these product rules:

- First determine transaction nature, then determine product category.
- Refunds are not income.
- Refunds are not normal expenses.
- Refunds offset the original payment.
- Normal expenses should prefer `raw_json.netAmount` when available.
- Excluded records, transfers, family-card records, account movement, and duplicate bank charges must not be accidentally overwritten by normal consumption rules.
- Multi-bill merging is temporary frontend viewing only. It must not write to the database and must not change original bill ownership.

## Refund Logic Protection

Refund metadata is business-critical. Do not casually rename, remove, or reinterpret these fields:

- `refundMatched`
- `refundStatus`
- `refundTotalAmount`
- `netAmount`
- `refundTransactionIds`
- `refundPairRole`
- `refundLinked`
- `refundOriginalTransactionId`
- `refundMatchStatus`

Required behavior:

- Do not count refunds as income.
- Do not count refunds as normal expense.
- Do not let matched refunds appear as duplicate top-level spending rows in the main table.
- Preserve refund folding: original payment is the parent row, matched refunds are child rows.
- Preserve the behavior where searching or filtering for a matched refund child item brings out and expands the original payment row.
- Preserve unmatched refund display as independent refund records.
- Preserve partial refund, full refund, and multiple refund accumulation behavior.

Backend refund pairing currently protects original candidates:

- Original must be an expense.
- Refund must be a refund.
- Original must be earlier than refund.
- Matching window is limited.
- Accumulated refunds must not exceed original payment amount.
- Excluded records, transfers, family-card records, account movement, duplicate bank charges, and bank sources should not become normal refund originals by accident.

## Category Rules and Similar Transaction Editing

Direct row editing and similar-transaction editing are separate flows.

Direct row editing:

- A direct edit modifies only the current transaction.
- It should call `PATCH /api/transactions/{transaction_id}`.
- It must preserve user manual override metadata.
- It must not create or update `category_rules`.
- It must not send `saveAsRule`.

Similar transaction editing:

- The user selects exactly one transaction as a sample.
- `saveAsRule=false` updates only currently existing similar transactions.
- `saveAsRule=true` updates currently existing similar transactions and creates or updates `category_rules`.
- Existing special transaction protections must still apply.

Semantic guard:

- The semantic guard in `backend/services/category_rule_service.py` must protect refunds, exclusions, transfers, family-card records, account movement, duplicate bank charges, and other special flows.
- Do not bypass `category_rule_service.py` semantic protection.
- Do not apply normal product-category rules before transaction nature is known.

## Bill Deletion Current State

Current "删除账单" is frontend soft delete only.

- localStorage key: `spendscopeRemovedBills`.
- Removed bill identity format: `YYYY-MM||平台`.
- It hides the bill from the frontend monthly bill library and normal views.
- It does not delete `transactions`.
- It does not delete `category_rules`.
- It does not delete `raw_json`.
- It does not delete refund metadata.
- It does not clear user modification records.
- "查看全部账单" should exclude soft-deleted bills by default.
- The review page and AI summary payload should exclude soft-deleted bills by default.
- The UI supports "查看已删除账单", single-bill restore, and restore all.
- Re-uploading the same platform + month can make the bill visible again when that information is available.

True database deletion is not implemented. If future work adds real deletion, it must be designed as a separate backend API with explicit second confirmation and metadata/rule/refund implications reviewed carefully.

## AI Insight Rules

Current AI insight is an interface placeholder plus local rules.

- `POST /api/insights/generate` is currently reserved for insight generation.
- Current provider is `local-rule`.
- Do not connect DeepSeek unless explicitly requested.
- Do not connect Kimi unless explicitly requested.
- Do not call external AI APIs unless explicitly requested.
- Do not read, write, or hard-code API keys.
- Frontend `buildInsightSummaryPayload` may only send desensitized statistical summaries.

The insight payload must not contain:

- Full `transactions`.
- `merchant`.
- `description`.
- `raw_json`.
- Order numbers.
- Bank card numbers.
- Real names.
- Full transaction timestamps.

Allowed summary examples:

- Total expense.
- Total income.
- Refund offset.
- Transaction count.
- Expense count.
- Refund count.
- Top categories.
- Top platforms.
- Daily peak with date reduced to `MM-DD`.
- Unmatched refund count.

If the insight API fails, the frontend should fall back to local rule cards.

## UI and Modal Rules

- Use `showAppModal()` for app dialogs.
- Do not add browser-native `alert`, `confirm`, or `prompt`.
- The top navigation font size must remain consistent across 本月总览, 账单明细, and 趋势分析.
- Active navigation state may change background, color, or weight, but not font size.
- Keep the visual style low-saturation, green / beige, soft shadows, and rounded cards.
- When changing UI, do not change business logic unless the user explicitly asks.
- Mobile layouts must not introduce horizontal scrolling.
- Avoid fake demo data. Empty states should be honest.

## Testing Commands

For frontend JavaScript changes:

```bash
node --check script.js
```

For the insight service and core backend schemas/routes:

```bash
cd backend
python -m py_compile main.py schemas.py services/insight_service.py
```

If you modify other backend service files, also compile the changed files. Example:

```bash
cd backend
python -m py_compile services/bill_upload_service.py services/transaction_service.py services/statistics_service.py services/refund_match_service.py services/category_rule_service.py
```

If only `styles.css` or documentation changed, `node --check script.js` is not required unless the user asks for it.

## Development Requirements

- Make small, scoped changes.
- Prefer the minimum change that satisfies the request.
- Do not perform large `script.js` rewrites unless explicitly requested.
- Do not introduce new dependencies unless explicitly requested.
- Do not write fake demo data into production UI.
- Do not exaggerate AI capability or imply real model integration when the provider is `local-rule`.
- Do not change backend, database, statistics policy, refund logic, or AI privacy rules during UI-only tasks.
- After each task, clearly state changed files.
- After each task, state whether statistics policy, refund logic, and AI desensitization principles were affected.
- Protect unrelated user changes in the worktree. Do not revert files you did not intend to edit.

