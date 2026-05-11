# SpendScope Iteration Log

This log records notable product and engineering iterations. It focuses on user-visible behavior and the data rules behind that behavior.

## Refund Recognition and Net Expense Statistics

### Step 1: Backend Refund Pairing Metadata

Problem: Refunds were present in bill data, but the app needed a stable way to connect refund rows to original payment rows.

Solution: Added backend refund pairing metadata in `raw_json`. Original payments can store refund totals, net amount, refund status, refund transaction IDs, and group keys. Refund rows can store linked original transaction IDs and match status.

Result: The backend can preserve refund relationships without changing the SQLite table structure.

### Step 2: Backend Net Expense Statistics

Problem: Counting refunds as income or raw expenses made monthly totals misleading.

Solution: Added effective amount helpers in `statistics_service.py`:

- `get_effective_expense_amount(transaction)`
- `get_effective_income_amount(transaction)`
- `get_refund_amount(transaction)`

Result: Backend totals use net expense. Refunds do not enter income.

### Step 2.5: Frontend Statistics Alignment

Problem: Backend and frontend charts needed the same financial policy.

Solution: Aligned frontend summary cards, category statistics, platform statistics, daily trend, monthly trend, and budget usage around effective expense and effective income.

Result: Partial refunds, full refunds, unmatched refunds, exclusions, transfers, family-card records, and duplicate charges now follow one shared statistical policy.

### Step 2.6: Fix Alipay Refunds Marked as Excluded

Problem: Some Alipay PDF rows were marked as not counted for income/expense while their descriptions clearly started with a refund signal. They were incorrectly normalized as excluded records.

Solution: Made refund signals take priority over not-counted income/expense markers during parsing and upload merge when the existing row was not manually edited. Added a historical repair script for polluted rows.

Result: Affected rows are normalized to refund/refund-offset instead of excluded/excluded.

### Step 3: Frontend Refund Folding

Problem: Showing original payments and matched refunds as separate top-level rows made the detail table noisy and easy to double-read.

Solution: Made the original payment the parent row and matched refunds child rows. The parent keeps its original category and type while showing net expense and a refund hint.

Result: Full refunds show net expense zero while preserving the original payment and refund trace.

### Step 4A: Search Adaptation

Problem: Matched refund rows are folded by default, so searching for refund text could hide the relevant result.

Solution: Search now treats an original payment and its refund children as a group. If a refund child matches the keyword, the parent row is shown and the child row expands temporarily.

Result: Searches for refund keywords, refund-offset category text, and refund descriptions bring out the correct refund group without duplicating child rows.

### Step 4B: Filters, Pagination, and Multi-Bill Views

Problem: Filters and pagination needed to respect refund groups instead of treating matched refund rows as ordinary top-level rows.

Solution: Added a refund-aware display pipeline. Filtering evaluates group members, pagination counts display groups, and scoped views handle missing originals or missing refund children.

Result: Refund category and refund type filters show the parent row and expand refund children. Parent and child rows do not split across pages.

### Step 5A: Regression Testing and Default Expansion Fix

Problem: Regression testing found that automatic expansion could be too broad in the default unfiltered view.

Solution: Restricted temporary auto-expansion to search states or active filters that match refund child rows.

Result: Default views stay folded. Search and refund-specific filters still expand the matching refund groups.
