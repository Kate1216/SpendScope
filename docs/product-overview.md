# SpendScope Product Overview

SpendScope is a personal bill analysis tool for understanding monthly spending across WeChat, Alipay, bank bills, and similar transaction exports.

## User Problem

Personal bills often mix very different transaction types in the same file:

- real purchases;
- refunds;
- transfers;
- account movement;
- family-card records;
- duplicate bank charges;
- records marked as not counted for income/expense;
- rows that need manual category correction.

If these rows are treated only by their amount or product description, monthly totals can become misleading. Refunds can look like income, duplicate charges can inflate spending, and transfer-like records can distort both sides of the ledger.

## Product Direction

SpendScope moves from raw bill amount to real net expense.

The product first decides what kind of transaction a row is, then decides what product category it belongs to:

```text
transaction nature first, product category second
```

This is especially important for refunds, exclusions, transfers, family-card records, and duplicate bank charges.

## Current Capabilities

- Upload and parse monthly bills.
- Save parsed bills into a SQLite-backed monthly bill library.
- View one bill, multiple selected bills, or all bills.
- Search, filter, and paginate transaction details.
- Edit category, type, and description on a single row.
- Apply a category/type edit to similar transactions explicitly.
- Save category rules for future uploads when the user chooses to remember a decision.
- Pair refunds with original payments when possible.
- Show refunds as offsets against original payments.
- Keep unmatched refunds visible without counting them as income or expense.
- Exclude transfers, account movement, family-card records, and duplicate bank charges from normal totals.
- Present summary cards, charts, daily trends, monthly trends, and budget usage using effective amounts.

## User Value

SpendScope helps users answer practical questions:

- How much did I really spend this month after refunds?
- Which categories drove actual expense?
- Did any refunds or duplicate charges distort the raw bill?
- Which transactions still need category review?
- Can future uploads reuse my correction rules safely?

The goal is not to replace financial judgment. It is to make monthly personal spending easier to inspect, correct, and understand.
