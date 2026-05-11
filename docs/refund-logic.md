# SpendScope Refund Handling Logic

SpendScope treats refunds as offsets against original payments. This keeps monthly totals closer to real spending and avoids inflating income with money that simply returned from a previous purchase.

## 1. Why Refunds Are Not Income

A refund is not new earning power. It reverses or reduces a previous expense.

If a user spends 30.00 and receives a 10.00 refund, the user's real expense is 20.00. Counting the refund as income would make both income and expense look larger than they really are.

SpendScope therefore applies this principle:

```text
refund = offset against original payment
refund != income
refund != normal exclusion
```

## 2. Refund States

### Partial Refund

The original payment remains visible and keeps its original category and type. Statistics use the net amount.

```text
Original payment: 30.00
Refund: 10.00
Net expense: 20.00
```

The category chart, platform chart, daily trend, monthly trend, and budget usage count 20.00 under the original category.

### Full Refund

The original payment remains visible, but net expense becomes zero.

```text
Original payment: 29.90
Refund: 29.90
Net expense: 0.00
```

The original category does not add 29.90 to spending totals, but the table still preserves the original payment and refund trace.

### Unmatched Refund

If a refund cannot be confidently paired to an original payment, it is shown as an independent row.

Unmatched refunds:

- do not count as income;
- do not count as expense;
- show a hint that no original expense was matched.

## 3. Backend Metadata Fields

Refund pairing metadata is stored in `transactions.raw_json`. The database schema does not need a separate refund table.

### Original Payment Metadata

Original payment rows may include:

- `refundMatched = true`
- `refundStatus = "partial_refund"` or `"full_refund"`
- `refundTotalAmount`
- `netAmount`
- `refundTransactionIds`
- `refundPairGeneratedAt`
- `refundPairRole = "originalExpense"`
- `refundGroupKey`
- `refundedAmount`
- `refundMatchedCount`

### Refund Transaction Metadata

Refund rows may include:

- `refundLinked = true`
- `refundOriginalTransactionId`
- `refundMatchStatus = "matched"`
- `refundPairGeneratedAt`
- `refundPairRole = "refund"`
- `refundGroupKey`

### Unmatched Refund Metadata

Unmatched refund rows may include:

- `refundLinked = false`
- `refundMatchStatus = "unmatched"`

## 4. Statistics Policy

SpendScope uses three helper concepts.

### Effective Expense

Effective expense is the amount that should count as spending.

- Refund rows return `0`.
- Excluded-like rows return `0`.
- Normal expense rows use `raw_json.netAmount` first.
- If no `netAmount` exists, normal expense rows use `amount`.

### Effective Income

Effective income is the amount that should count as income.

- Refund rows return `0`.
- Excluded-like rows return `0`.
- Normal income rows use `amount`.

### Refund Amount

Refund amount is tracked separately for explanation and display.

- Refund rows contribute their refund amount.
- Non-refund rows contribute `0`.

## 5. Frontend Display Logic

Refund display is folded around the original payment.

- The original payment is the parent row.
- The original payment keeps its own merchant, description, category, type, platform, and time.
- The parent row amount shows net expense.
- Refund rows appear as child rows when expanded.
- Matched refund rows do not appear again as duplicate top-level rows.
- Unmatched refund rows remain independent.

Search and filters are refund-aware:

- If search or filters hit the original payment, the parent row is shown.
- If search or filters hit a refund child row, SpendScope brings out the original parent row and expands the refund child.
- Clearing search restores the default folded state.
- Pagination is based on display groups, so a parent row and its refund child rows do not split across pages.

## 6. Boundary Cases

### Alipay Not-Counted + Refund Description

Alipay can mark refund rows as not counted for income/expense while the description clearly starts with a refund signal. SpendScope gives refund signals priority, so these rows become:

```text
type = refund
transaction_type = refund
category = refund/offset
```

### Family Card

Family-card records are protected from refund classification. They are treated according to their transaction nature rather than product text.

### Transfer and Account Movement

Transfers, account movement, automatic transfers, and similar records are not original-payment candidates for refund matching.

### Bank Duplicate Charges

Bank duplicate charges and cross-platform duplicate payment display logic remain separate from refund folding.

### Only Refund Is In Current View

In multi-bill or scoped views, a refund row may be visible while its original payment is outside the current view. SpendScope does not hide the refund. It shows the refund independently with a hint:

```text
matched refund, but the original payment is outside the current view;
not counted as income or expense
```

## 7. Regression Checklist

- Alipay not-counted rows with refund descriptions become `refund / refund-offset`.
- Normal not-counted income/expense records remain excluded when they are not refunds.
- Family-card, transfer, account movement, and duplicate bank charge records are not misclassified as refunds.
- Partial refunds count only net expense.
- Full refunds count zero expense.
- Refunds do not increase income.
- Unmatched refunds are visible but excluded from income and expense totals.
- Original payment rows remain the refund parent rows.
- Refund child rows do not duplicate as top-level rows.
- Search for refund text brings out and expands the parent row.
- Filtering by refund category or refund type brings out and expands the parent row.
- Pagination counts display groups rather than refund child rows.
- Single-bill, multi-bill, and view-all modes preserve refund behavior.
