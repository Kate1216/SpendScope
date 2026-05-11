# AI and Rule Design

SpendScope is AI-assisted in product direction, but the current implementation deliberately relies on deterministic parsing, rules, metadata, and user confirmation for critical financial behavior.

## Current Approach

Current transaction handling is based on:

- platform-specific parsers;
- transaction nature detection;
- category rules;
- semantic guards;
- explicit user edits;
- backend metadata stored in `raw_json`;
- regression checks for refund and exclusion behavior.

The system does not assume that a product keyword alone is enough to classify a transaction. Transaction nature is evaluated first.

## Semantic Guards

Category rules include semantic protection so that normal product rules do not overwrite special transaction types.

Protected cases include:

- refunds;
- excluded records;
- transfers;
- account movement;
- family-card records;
- duplicate bank charges;
- manually edited rows.

For example, a pet-food category rule should not turn a refund row or family-card row into a normal pet expense.

## User Control

Direct row editing only changes the selected transaction. Batch behavior is explicit through "apply to similar transactions." Rule memory is also explicit: the user chooses whether to remember a decision for future uploads.

This keeps automated behavior inspectable and reversible.

## Possible Future AI Assistance

Future AI assistance could help with:

- suggesting categories for uncertain transactions;
- explaining why a row was classified a certain way;
- identifying likely duplicate or refund relationships for review;
- summarizing monthly spending patterns in natural language.

Any AI-assisted classification should preserve:

- user confirmation for risky changes;
- privacy-conscious local or controlled processing where possible;
- semantic guards for refunds, exclusions, transfers, family-card records, and duplicate charges;
- auditability through metadata and visible UI hints.

The design goal is useful assistance, not opaque automation.
