from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sqlite3


DEFAULT_DB_PATH = Path(__file__).resolve().parents[1] / "spendscope.db"
REFUND_KEYWORDS = ["退款-", "退款", "退货", "售后退款", "退回", "原路退回", "运费补贴", "运费补偿", "已退款"]
HARD_EXCLUDED_KEYWORDS = ["亲情卡", "转账", "转入", "转出", "账户转移", "自动转入", "重复扣款", "中国银行"]


def main() -> None:
    parser = argparse.ArgumentParser(description="Dry-run or fix refund transactions incorrectly marked as excluded.")
    parser.add_argument("--db", default=str(DEFAULT_DB_PATH), help="SQLite database path")
    parser.add_argument("--apply", action="store_true", help="Apply fixes. Default is dry-run.")
    args = parser.parse_args()

    db_path = Path(args.db)
    matches = find_matches(db_path)
    print(f"mode: {'apply' if args.apply else 'dry-run'}")
    print(f"db: {db_path}")
    print(f"matched: {len(matches)}")
    for item in matches[:20]:
        print(
            json.dumps(
                {
                    "id": item["id"],
                    "time": item["time"],
                    "merchant": item["merchant"],
                    "description": item["description"],
                    "oldType": item["type"],
                    "oldTransactionType": item["transaction_type"],
                    "oldCategory": item["category"],
                    "newType": "退款",
                    "newTransactionType": "退款",
                    "newCategory": "退款/抵扣",
                },
                ensure_ascii=False,
            )
        )

    if args.apply and matches:
        apply_fixes(db_path, matches)
        print(f"applied: {len(matches)}")


def find_matches(db_path: Path) -> list[dict]:
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    try:
        rows = con.execute(
            """
            select id, time, merchant, description, transaction_type, type, category, raw_json
            from transactions
            where type = ? or transaction_type = ? or category = ?
            order by time, id
            """,
            ("排除", "排除", "排除"),
        ).fetchall()
    finally:
        con.close()

    matches = []
    for row in rows:
        raw_json = _raw_json_to_dict(row["raw_json"])
        text = _build_searchable_text(row, raw_json)
        if not _contains_any(text, REFUND_KEYWORDS):
            continue
        if _contains_any(text, HARD_EXCLUDED_KEYWORDS):
            continue
        if _has_manual_marker(raw_json):
            continue
        matches.append({**dict(row), "raw_json_dict": raw_json})
    return matches


def apply_fixes(db_path: Path, matches: list[dict]) -> None:
    fixed_at = datetime.now(timezone.utc).isoformat()
    con = sqlite3.connect(db_path)
    try:
        for item in matches:
            raw_json = dict(item["raw_json_dict"] or {})
            raw_json["refundSemanticFixed"] = True
            raw_json["refundSemanticFixedAt"] = fixed_at
            raw_json["previousType"] = item["type"]
            raw_json["previousTransactionType"] = item["transaction_type"]
            raw_json["previousCategory"] = item["category"]
            raw_json["type"] = "退款"
            raw_json["transactionType"] = "退款"
            raw_json["category"] = "退款/抵扣"
            con.execute(
                """
                update transactions
                set type = ?, transaction_type = ?, category = ?, raw_json = ?, updated_at = ?
                where id = ?
                """,
                (
                    "退款",
                    "退款",
                    "退款/抵扣",
                    json.dumps(raw_json, ensure_ascii=False),
                    fixed_at,
                    item["id"],
                ),
            )
        con.commit()
    finally:
        con.close()


def _build_searchable_text(row: sqlite3.Row, raw_json: dict) -> str:
    values = [
        row["merchant"],
        row["description"],
        row["transaction_type"],
        row["type"],
        row["category"],
    ]
    values.extend(str(value) for value in raw_json.values() if value not in (None, ""))
    return " ".join(str(value) for value in values if value)


def _has_manual_marker(raw_json: dict) -> bool:
    if raw_json.get("categoryManualOverride") is True:
        return True
    if str(raw_json.get("updatedBy") or "").casefold() == "user":
        return True
    if str(raw_json.get("editSource") or "").casefold() == "manual":
        return True
    if raw_json.get("manuallyEditedAt"):
        return True
    return any(_is_manual_metadata_key(key) and value not in (None, "", False) for key, value in raw_json.items())


def _is_manual_metadata_key(key) -> bool:
    normalized = str(key or "").casefold()
    return "manual" in normalized or "override" in normalized


def _contains_any(text: str, keywords: list[str]) -> bool:
    return any(keyword.casefold() in str(text or "").casefold() for keyword in keywords)


def _raw_json_to_dict(value: str | None) -> dict:
    try:
        data = json.loads(value or "{}")
    except Exception:
        return {}
    return data if isinstance(data, dict) else {}


if __name__ == "__main__":
    main()
