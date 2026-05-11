from datetime import datetime
import json
import re

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import BillFile, Transaction
from schemas import TransactionPatch
from services.category_rule_service import (
    apply_single_category_rule_to_existing_transactions,
    create_or_update_rule_from_transaction,
    derive_rule_keywords_for_transaction,
    extract_similarity_tokens,
    build_similarity_searchable_text,
    get_transaction_semantic_type,
    is_similar_transaction,
    is_semantic_type_compatible,
    transaction_matches_rule_keywords,
)
from services.refund_match_service import apply_refund_pair_metadata
from services.statistics_service import (
    get_effective_expense_amount,
    get_effective_income_amount,
    get_refund_amount,
)

PRESERVED_RAW_JSON_KEYS = {
    "categoryManualOverride",
    "similarEditApplied",
    "similarEditSourceTransactionId",
    "categoryRuleMatched",
    "categoryRuleId",
    "manuallyEditedAt",
    "updatedBy",
    "editSource",
}
SEMANTICALLY_PROTECTED_TYPES = {"excluded", "refund", "transfer"}


def transaction_to_out(transaction: Transaction) -> dict:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    return {
        "id": transaction.id,
        "time": transaction.time,
        "sourcePlatform": transaction.source_platform,
        "platform": transaction.platform,
        "merchant": transaction.merchant,
        "description": transaction.description,
        "transactionType": transaction.transaction_type,
        "type": transaction.type,
        "category": transaction.category,
        "amount": transaction.amount,
        "raw_json": transaction.raw_json,
        "categoryManualOverride": bool(raw_json.get("categoryManualOverride")),
    }


def list_transactions(db: Session, month: str | None = None, platform: str | None = None) -> list[dict]:
    query = db.query(Transaction)
    if platform:
        query = query.filter(Transaction.source_platform == platform)

    transactions = query.order_by(Transaction.time.desc()).all()
    if month:
        transactions = [transaction for transaction in transactions if _extract_transaction_month(transaction.time) == month]

    return [transaction_to_out(transaction) for transaction in transactions]


def list_bills(db: Session, month: str | None = None, platform: str | None = None) -> list[dict]:
    latest_uploads = _latest_uploads_by_platform(db)
    query = db.query(Transaction)
    if platform:
        query = query.filter(Transaction.source_platform == platform)

    groups = {}
    for transaction in query.all():
        bill_month = _extract_transaction_month(transaction.time)
        bill_platform = transaction.source_platform or transaction.platform or "未知平台"

        if month and bill_month != month:
            continue

        key = (bill_month, bill_platform)
        if key not in groups:
            groups[key] = {
                "month": bill_month,
                "platform": bill_platform,
                "transactionCount": 0,
                "totalExpense": 0,
                "totalIncome": 0,
                "totalRefund": 0,
                "uploadedAt": _format_datetime(latest_uploads.get(bill_platform)),
            }

        group = groups[key]
        group["transactionCount"] += 1
        group["totalExpense"] += get_effective_expense_amount(transaction)
        group["totalIncome"] += get_effective_income_amount(transaction)
        group["totalRefund"] += get_refund_amount(transaction)

    bills = list(groups.values())
    for bill in bills:
        bill["totalExpense"] = round(bill["totalExpense"], 2)
        bill["totalIncome"] = round(bill["totalIncome"], 2)
        bill["totalRefund"] = round(bill["totalRefund"], 2)

    return sorted(bills, key=lambda item: (_month_sort_key(item["month"]), item["platform"]), reverse=True)


def update_transaction(db: Session, transaction_id: str, patch: TransactionPatch) -> dict:
    transaction = db.get(Transaction, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="transaction not found")

    updates = patch.model_dump(exclude_none=True)
    save_as_rule = bool(updates.pop("saveAsRule", False))
    category_manual_override = bool(updates.pop("categoryManualOverride", False))
    field_map = {
        "merchant": "merchant",
        "description": "description",
        "transactionType": "transaction_type",
        "type": "type",
        "category": "category",
    }

    for patch_field, model_field in field_map.items():
        if patch_field in updates:
            setattr(transaction, model_field, updates[patch_field])

    if any(field in updates for field in ["category", "type", "description"]):
        category_manual_override = True

    if category_manual_override:
        raw_json = _raw_json_to_dict(transaction.raw_json)
        raw_json["categoryManualOverride"] = True
        transaction.raw_json = json.dumps(raw_json, ensure_ascii=False)

    transaction.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(transaction)
    category_rule = create_or_update_rule_from_transaction(db, transaction) if save_as_rule else None
    category_rule_applied_count = apply_single_category_rule_to_existing_transactions(db, category_rule) if category_rule else 0
    if category_rule_applied_count:
        db.refresh(transaction)
    return {
        "transaction": transaction_to_out(transaction),
        "categoryRule": category_rule,
        "categoryRuleAppliedCount": category_rule_applied_count,
    }


def apply_similar_transaction_update(
    db: Session,
    source_transaction_id: str,
    target_category: str,
    target_type: str,
    save_as_rule: bool = False,
) -> dict:
    source_transaction = db.get(Transaction, source_transaction_id)
    if source_transaction is None:
        raise HTTPException(status_code=404, detail="transaction not found")

    target_category = _clean_required_text(target_category, "category")
    target_type = _clean_required_text(target_type, "type")
    merchant_keyword, description_keyword = derive_rule_keywords_for_transaction(source_transaction)
    source_similarity_tokens = extract_similarity_tokens(build_similarity_searchable_text(source_transaction))
    if not merchant_keyword and not description_keyword and not source_similarity_tokens:
        raise HTTPException(status_code=400, detail="source transaction cannot produce a similar-match rule")

    now = datetime.utcnow()
    updated_transactions = []
    for transaction in db.query(Transaction).all():
        if not is_semantic_type_compatible(source_transaction, transaction):
            continue

        rule_matched = transaction_matches_rule_keywords(transaction, merchant_keyword, description_keyword)
        product_matched = False if rule_matched else is_similar_transaction(source_transaction, transaction)
        if not rule_matched and not product_matched:
            continue

        raw_json = _raw_json_to_dict(transaction.raw_json)
        transaction.category = target_category
        transaction.type = target_type
        raw_json["category"] = target_category
        raw_json["type"] = target_type
        raw_json["categoryManualOverride"] = True
        raw_json["similarEditApplied"] = True
        raw_json["similarEditSourceTransactionId"] = source_transaction_id
        transaction.raw_json = json.dumps(raw_json, ensure_ascii=False)
        transaction.updated_at = now
        updated_transactions.append(transaction)

    if not updated_transactions:
        db.commit()
        db.refresh(source_transaction)
        return {
            "sourceTransaction": transaction_to_out(source_transaction),
            "updatedTransactions": [],
            "appliedCount": 0,
            "categoryRule": None,
            "categoryRuleAppliedCount": 0,
        }

    db.commit()
    for transaction in updated_transactions:
        db.refresh(transaction)
    db.refresh(source_transaction)

    category_rule = None
    if save_as_rule:
        category_rule = create_or_update_rule_from_transaction(db, source_transaction)
        if category_rule:
            rule_id = category_rule.get("id")
            for transaction in updated_transactions:
                raw_json = _raw_json_to_dict(transaction.raw_json)
                raw_json["categoryRuleId"] = rule_id
                raw_json["categoryRuleMatched"] = True
                transaction.raw_json = json.dumps(raw_json, ensure_ascii=False)
                transaction.updated_at = datetime.utcnow()
            db.commit()
            for transaction in updated_transactions:
                db.refresh(transaction)
            db.refresh(source_transaction)

    return {
        "sourceTransaction": transaction_to_out(source_transaction),
        "updatedTransactions": [transaction_to_out(transaction) for transaction in updated_transactions],
        "appliedCount": len(updated_transactions),
        "categoryRule": category_rule,
        "categoryRuleAppliedCount": len(updated_transactions) if category_rule else 0,
    }


def save_uploaded_transactions(db: Session, transactions: list[dict], file_meta: dict) -> list[dict]:
    now = datetime.utcnow()
    bill_file = BillFile(
        filename=file_meta.get("filename") or "",
        saved_path=file_meta.get("saved_path") or "",
        platform=file_meta.get("platform") or "",
        uploaded_at=now,
        transaction_count=len(transactions),
    )
    db.add(bill_file)

    saved_transactions = []
    for item in transactions:
        transaction_id = item.get("id")
        if not transaction_id:
            continue

        existing = db.get(Transaction, transaction_id)
        if existing is None:
            existing = Transaction(
                id=transaction_id,
                created_at=now,
            )
            db.add(existing)
            _apply_new_uploaded_transaction(existing, item, now)
        else:
            merge_existing_transaction_with_upload(existing, item, now)
        saved_transactions.append(existing)

    apply_refund_pair_metadata(db, now)
    db.commit()

    for transaction in saved_transactions:
        db.refresh(transaction)

    return [transaction_to_out(transaction) for transaction in saved_transactions]


def merge_existing_transaction_with_upload(existing: Transaction, incoming: dict, now: datetime | None = None) -> Transaction:
    now = now or datetime.utcnow()
    existing_raw_json = _raw_json_to_dict(existing.raw_json)
    preserve_core_fields = _should_preserve_existing_user_fields(existing, existing_raw_json)
    refund_semantic_correction = _should_allow_refund_semantic_correction(existing, existing_raw_json, incoming)
    if refund_semantic_correction:
        preserve_core_fields = False

    _set_if_missing(existing, "time", incoming.get("time"))
    _set_if_missing(existing, "source_platform", incoming.get("sourcePlatform"))
    _set_if_missing(existing, "platform", incoming.get("platform"))
    _set_if_missing(existing, "merchant", incoming.get("merchant"))
    _set_if_missing(existing, "transaction_type", incoming.get("transactionType"))
    if _is_missing(existing.amount):
        existing.amount = _to_float(incoming.get("amount"))

    if not preserve_core_fields:
        if refund_semantic_correction:
            _set_if_missing(existing, "description", incoming.get("description"))
            existing.transaction_type = incoming.get("transactionType") or "退款"
            existing.type = "退款"
            existing.category = "退款/抵扣"
        else:
            _set_if_missing(existing, "description", incoming.get("description"))
            _set_if_missing(existing, "type", incoming.get("type"))
            _set_if_missing(existing, "category", incoming.get("category"))

    merged_raw_json = _merge_upload_raw_json(existing_raw_json, incoming, existing, preserve_core_fields)
    existing.raw_json = json.dumps(merged_raw_json, ensure_ascii=False)
    existing.updated_at = now
    return existing


def _apply_new_uploaded_transaction(transaction: Transaction, item: dict, now: datetime) -> None:
    transaction.time = item.get("time")
    transaction.source_platform = item.get("sourcePlatform")
    transaction.platform = item.get("platform")
    transaction.merchant = item.get("merchant")
    transaction.description = item.get("description")
    transaction.transaction_type = item.get("transactionType")
    transaction.type = item.get("type")
    transaction.category = item.get("category")
    transaction.amount = _to_float(item.get("amount"))
    transaction.raw_json = json.dumps(item, ensure_ascii=False)
    transaction.updated_at = now


def _should_preserve_existing_user_fields(existing: Transaction, raw_json: dict) -> bool:
    if _has_manual_edit_marker(raw_json):
        return True
    if bool(raw_json.get("similarEditApplied")):
        return True
    if _has_category_rule_marker(raw_json):
        return True
    return get_transaction_semantic_type(existing) in SEMANTICALLY_PROTECTED_TYPES


def _should_allow_refund_semantic_correction(existing: Transaction, raw_json: dict, incoming: dict) -> bool:
    if _has_manual_edit_marker(raw_json) or bool(raw_json.get("similarEditApplied")) or _has_category_rule_marker(raw_json):
        return False
    if get_transaction_semantic_type(existing) not in {"excluded", "unknown", "refund"}:
        return False
    if existing.type not in {"排除", "待确认", "", None} and existing.category not in {"排除", "待确认", "", None}:
        return False
    if get_transaction_semantic_type(incoming) != "refund":
        return False
    text = _normalize_semantic_text(
        " ".join(
            str(value or "")
            for value in [
                incoming.get("merchant"),
                incoming.get("description"),
                incoming.get("transactionType"),
                incoming.get("type"),
                incoming.get("category"),
                incoming.get("platform"),
                incoming.get("sourcePlatform"),
            ]
        )
    )
    if not re.search(r"退款-|退款|退货|售后退款|退回|原路退回|运费补贴|运费补偿|已退款", text):
        return False
    return not re.search(r"亲情卡|转账|转入|转出|账户转移|自动转入|重复扣款|中国银行", text)


def _merge_upload_raw_json(existing_raw_json: dict, incoming: dict, existing: Transaction, preserve_core_fields: bool) -> dict:
    merged = dict(existing_raw_json or {})
    for key, value in (incoming or {}).items():
        if key in PRESERVED_RAW_JSON_KEYS or _is_preserved_metadata_key(key):
            continue
        if _is_missing(merged.get(key)) and not _is_missing(value):
            merged[key] = value

    for key, value in (existing_raw_json or {}).items():
        if key in PRESERVED_RAW_JSON_KEYS or _is_preserved_metadata_key(key):
            merged[key] = value

    if preserve_core_fields:
        _set_raw_value_if_present(merged, "category", existing.category)
        _set_raw_value_if_present(merged, "type", existing.type)
        _set_raw_value_if_present(merged, "description", existing.description)
        _set_raw_value_if_present(merged, "transactionType", existing.transaction_type)
        if not _has_category_rule_marker(existing_raw_json):
            merged.pop("categoryRuleId", None)
            merged.pop("categoryRuleMatched", None)
    else:
        _set_raw_value_if_present(merged, "category", existing.category)
        _set_raw_value_if_present(merged, "type", existing.type)
        _set_raw_value_if_present(merged, "description", existing.description)
        _set_raw_value_if_present(merged, "transactionType", existing.transaction_type)

    return merged


def _has_manual_edit_marker(raw_json: dict) -> bool:
    if bool(raw_json.get("categoryManualOverride")):
        return True
    return any(_is_preserved_metadata_key(key) and _has_value(value) for key, value in (raw_json or {}).items())


def _has_category_rule_marker(raw_json: dict) -> bool:
    return bool(raw_json.get("categoryRuleMatched")) or _has_value(raw_json.get("categoryRuleId"))


def _is_preserved_metadata_key(key) -> bool:
    normalized = str(key or "").casefold()
    return any(marker in normalized for marker in ["manual", "override", "applied", "rule", "edit"])


def _normalize_semantic_text(value) -> str:
    return str(value or "").strip().casefold()


def _set_if_missing(target, field_name: str, value) -> None:
    if _is_missing(getattr(target, field_name, None)) and not _is_missing(value):
        setattr(target, field_name, value)


def _set_raw_value_if_present(raw_json: dict, key: str, value) -> None:
    if not _is_missing(value):
        raw_json[key] = value


def _is_missing(value) -> bool:
    return value is None or value == ""


def _has_value(value) -> bool:
    return not _is_missing(value)


def _to_float(value) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0


def _raw_json_to_dict(raw_json: str | None) -> dict:
    if not raw_json:
        return {}
    try:
        data = json.loads(raw_json)
    except (TypeError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def _clean_required_text(value, field_name: str) -> str:
    text = str(value or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    return text


def _latest_uploads_by_platform(db: Session) -> dict[str, datetime]:
    latest_uploads = {}
    bill_files = db.query(BillFile).all()
    for bill_file in bill_files:
        platform = bill_file.platform or ""
        uploaded_at = bill_file.uploaded_at
        if not platform or uploaded_at is None:
            continue
        if platform not in latest_uploads or uploaded_at > latest_uploads[platform]:
            latest_uploads[platform] = uploaded_at
    return latest_uploads


def _extract_transaction_month(value: str | None) -> str:
    match = re.match(r"^\s*(\d{4})[-/.](\d{1,2})", str(value or ""))
    if not match:
        return "未知月份"
    return f"{match.group(1)}-{match.group(2).zfill(2)}"


def _month_sort_key(value: str) -> str:
    if value == "未知月份":
        return "0000-00"
    return value


def _format_datetime(value: datetime | None) -> str | None:
    if value is None:
        return None
    return value.isoformat()
