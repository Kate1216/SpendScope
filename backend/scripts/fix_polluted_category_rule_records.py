from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime
from pathlib import Path


POLLUTED_RULE_ID = 7
PRODUCT_KEYWORDS = ["顽皮", "wanpy", "happy100", "鲜封包"]
EXCLUDED_KEYWORDS = ["亲情卡", "不计收支", "排除"]
REFUND_KEYWORDS = ["退款", "退货", "售后", "运费补贴"]
CLEANUP_REASON = "semantic guard cleanup for old category rule pollution"


def main() -> int:
    args = _parse_args()
    db_path = args.db_path or _default_db_path()
    if not db_path.exists():
        raise SystemExit(f"database not found: {db_path}")

    matches = find_polluted_records(db_path)
    print(f"database: {db_path}")
    print(f"mode: {'apply' if args.apply else 'dry-run'}")
    print(f"matched: {len(matches)}")
    for item in matches:
        print(
            json.dumps(
                {
                    "id": item["id"],
                    "time": item["time"],
                    "merchant": item["merchant"],
                    "description": item["description"],
                    "currentType": item["type"],
                    "currentCategory": item["category"],
                    "restoreType": item["restore_type"],
                    "restoreCategory": item["restore_category"],
                    "semanticReason": item["semantic_reason"],
                },
                ensure_ascii=False,
            )
        )

    if args.apply and matches:
        apply_cleanup(db_path, matches)
        print(f"applied: {len(matches)}")
    elif not args.apply:
        print("dry-run only; pass --apply to write changes")

    return 0


def find_polluted_records(db_path: Path) -> list[dict]:
    with sqlite3.connect(db_path) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            select id, time, merchant, description, transaction_type, type, category, raw_json
            from transactions
            where category = ? and (type = ? or transaction_type = ?)
            """
            ,
            ("宠物", "支出", "支出"),
        ).fetchall()

    matches = []
    for row in rows:
        raw_json = _raw_json_to_dict(row["raw_json"])
        if raw_json.get("categoryRuleMatched") is not True:
            continue
        if str(raw_json.get("categoryRuleId") or "") != str(POLLUTED_RULE_ID):
            continue

        searchable_text = _build_searchable_text(row, raw_json)
        normalized = searchable_text.casefold()
        if not any(keyword.casefold() in normalized for keyword in PRODUCT_KEYWORDS):
            continue

        restore_type, restore_category, semantic_reason = _infer_restore_values(normalized)
        if not restore_type:
            continue

        matches.append(
            {
                "id": row["id"],
                "time": row["time"],
                "merchant": row["merchant"],
                "description": row["description"],
                "transaction_type": row["transaction_type"],
                "type": row["type"],
                "category": row["category"],
                "raw_json": raw_json,
                "restore_type": restore_type,
                "restore_category": restore_category,
                "semantic_reason": semantic_reason,
            }
        )

    return matches


def apply_cleanup(db_path: Path, matches: list[dict]) -> None:
    fixed_at = datetime.utcnow().isoformat()
    with sqlite3.connect(db_path) as connection:
        for item in matches:
            raw_json = dict(item["raw_json"])
            raw_json["type"] = item["restore_type"]
            raw_json["category"] = item["restore_category"]
            raw_json.pop("categoryRuleMatched", None)
            raw_json.pop("categoryRuleId", None)
            raw_json["historicalCategoryRulePollutionFixed"] = True
            raw_json["fixedReason"] = CLEANUP_REASON
            raw_json["fixedAt"] = fixed_at

            connection.execute(
                """
                update transactions
                set type = ?, category = ?, raw_json = ?, updated_at = ?
                where id = ?
                """
                ,
                (
                    item["restore_type"],
                    item["restore_category"],
                    json.dumps(raw_json, ensure_ascii=False),
                    fixed_at,
                    item["id"],
                ),
            )
        connection.commit()


def _infer_restore_values(text: str) -> tuple[str | None, str | None, str | None]:
    if any(keyword.casefold() in text for keyword in REFUND_KEYWORDS):
        return "退款", "退款/抵扣", "refund_keyword"
    if any(keyword.casefold() in text for keyword in EXCLUDED_KEYWORDS):
        return "排除", "排除", "excluded_keyword"
    return None, None, None


def _build_searchable_text(row: sqlite3.Row, raw_json: dict) -> str:
    values = [
        row["merchant"],
        row["description"],
        row["transaction_type"],
        row["type"],
        row["category"],
        row["raw_json"],
    ]
    values.extend(str(value) for value in raw_json.values() if value not in (None, ""))
    return " ".join(str(value or "") for value in values)


def _raw_json_to_dict(value: str | None) -> dict:
    try:
        data = json.loads(value or "{}")
    except (TypeError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _default_db_path() -> Path:
    return Path(__file__).resolve().parents[1] / "spendscope.db"


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Dry-run or fix old polluted category-rule records.")
    parser.add_argument("--apply", action="store_true", help="write the cleanup to the database")
    parser.add_argument("--db-path", type=Path, default=None, help="override the SQLite database path")
    return parser.parse_args()


if __name__ == "__main__":
    raise SystemExit(main())
