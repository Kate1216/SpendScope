from __future__ import annotations

from datetime import datetime
import json
import re
from typing import Iterable

from sqlalchemy.orm import Session

from models import Transaction
from services.category_rule_service import get_transaction_semantic_type


REFUND_MATCH_AMOUNT_TOLERANCE = 0.01
REFUND_MATCH_WINDOW_DAYS = 90
REFUND_METADATA_KEYS = {
    "refundMatched",
    "refundLinked",
    "refundOriginalTransactionId",
    "refundMatchStatus",
    "refundTotalAmount",
    "netAmount",
    "refundTransactionIds",
    "refundPairGeneratedAt",
    "refundPairMatched",
    "refundPairStatus",
    "refundPairRole",
    "refundGroupKey",
    "refundMatchedOriginalTransactionId",
    "refundMatchedRefundTransactionIds",
    "refundMatchedCount",
    "refundedAmount",
    "refundStatus",
    "refundMatchedAt",
    "matchedOriginalMerchant",
    "matchedOriginalDescription",
    "matchedOriginalTime",
    "matchedOriginalAmount",
    "matchedOriginalCategory",
}
REFUND_ORDER_KEYS = [
    "transactionOrderId",
    "merchantOrderId",
    "orderId",
    "tradeNo",
    "outTradeNo",
    "交易订单号",
    "商家订单号",
    "订单号",
]
BANK_OR_DUPLICATE_SOURCE_KEYWORDS = {"中国银行", "银行"}
REFUND_SIGNAL_KEYWORDS = {"退款", "退货", "售后", "运费补贴", "退回", "原路退回", "冲正", "撤销"}
EXCLUDED_SIGNAL_KEYWORDS = {"排除", "不计收支", "亲情卡", "转账", "转入", "转出", "账户转移", "自动转入", "重复扣款"}


def apply_refund_pair_metadata(db: Session, now: datetime | None = None) -> int:
    now = now or datetime.utcnow()
    transactions = db.query(Transaction).all()
    if not transactions:
        return 0

    refund_candidates = sorted(
        [transaction for transaction in transactions if _is_refund_candidate(transaction)],
        key=lambda transaction: _parse_timestamp(transaction.time) or datetime.min,
    )
    expense_candidates = [transaction for transaction in transactions if _is_expense_candidate(transaction)]

    changed_count = 0
    groups_by_expense_id: dict[str, dict] = {}
    matched_refund_ids: set[str] = set()

    for refund in refund_candidates:
        best = _find_best_refund_expense_candidate(refund, expense_candidates, groups_by_expense_id)
        if not best:
            continue

        expense = best["expense"]
        group = groups_by_expense_id.setdefault(
            expense.id,
            {
                "groupKey": f"refund-match-{expense.id}",
                "refunds": [],
                "refundedAmount": 0.0,
            },
        )
        group["refunds"].append(refund)
        group["refundedAmount"] = _round_amount(group["refundedAmount"] + _to_float(refund.amount))
        matched_refund_ids.add(refund.id)

    for transaction in transactions:
        raw_json = _raw_json_to_dict(transaction.raw_json)
        cleaned = _clear_refund_metadata(raw_json)
        if cleaned != raw_json:
            transaction.raw_json = json.dumps(cleaned, ensure_ascii=False)
            transaction.updated_at = now
            changed_count += 1

    for expense_id, group in groups_by_expense_id.items():
        expense = next((item for item in expense_candidates if item.id == expense_id), None)
        if expense is None:
            continue

        refund_ids = [refund.id for refund in group["refunds"]]
        refunded_amount = _round_amount(group["refundedAmount"])
        refund_status = _refund_status(expense.amount, refunded_amount)
        net_amount = max(0.0, _round_amount(_to_float(expense.amount) - refunded_amount))
        status_value = f"{refund_status}_refund"
        changed_count += _merge_refund_metadata(
            expense,
            {
                "refundMatched": True,
                "refundStatus": status_value,
                "refundTotalAmount": refunded_amount,
                "netAmount": net_amount,
                "refundTransactionIds": refund_ids,
                "refundPairGeneratedAt": now.isoformat(),
                "refundPairMatched": True,
                "refundPairStatus": "matched",
                "refundPairRole": "originalExpense",
                "refundGroupKey": group["groupKey"],
                "refundMatchedRefundTransactionIds": refund_ids,
                "refundedAmount": refunded_amount,
                "refundMatchedCount": len(refund_ids),
                "refundMatchedAt": now.isoformat(),
            },
            now,
        )

        for refund in group["refunds"]:
            changed_count += _merge_refund_metadata(
                refund,
                {
                    "refundLinked": True,
                    "refundOriginalTransactionId": expense.id,
                    "refundMatchStatus": "matched",
                    "refundPairGeneratedAt": now.isoformat(),
                    "refundPairMatched": True,
                    "refundPairStatus": "matched",
                    "refundPairRole": "refund",
                    "refundGroupKey": group["groupKey"],
                    "refundMatchedOriginalTransactionId": expense.id,
                    "refundStatus": status_value,
                    "refundMatchedAt": now.isoformat(),
                    "matchedOriginalMerchant": expense.merchant or "",
                    "matchedOriginalDescription": expense.description or "",
                    "matchedOriginalTime": expense.time or "",
                    "matchedOriginalAmount": _to_float(expense.amount),
                    "matchedOriginalCategory": expense.category or "",
                },
                now,
            )

    for refund in refund_candidates:
        if refund.id in matched_refund_ids:
            continue
        changed_count += _merge_refund_metadata(
            refund,
            {
                "refundLinked": False,
                "refundMatchStatus": "unmatched",
                "refundPairGeneratedAt": now.isoformat(),
                "refundPairMatched": False,
                "refundPairStatus": "unmatched",
                "refundPairRole": "unmatchedRefund",
                "refundMatchedAt": now.isoformat(),
            },
            now,
        )

    return changed_count


def _find_best_refund_expense_candidate(
    refund: Transaction,
    expenses: Iterable[Transaction],
    groups_by_expense_id: dict[str, dict],
) -> dict | None:
    refund_amount = _to_float(refund.amount)
    refund_time = _parse_timestamp(refund.time)
    if refund_time is None:
        return None

    candidates = []
    for expense in expenses:
        expense_time = _parse_timestamp(expense.time)
        if expense_time is None or expense_time > refund_time:
            continue
        time_diff_seconds = abs((refund_time - expense_time).total_seconds())
        if time_diff_seconds > REFUND_MATCH_WINDOW_DAYS * 24 * 60 * 60:
            continue

        allocated_amount = _to_float(groups_by_expense_id.get(expense.id, {}).get("refundedAmount"))
        remaining_amount = _to_float(expense.amount) - allocated_amount
        if refund_amount > remaining_amount + REFUND_MATCH_AMOUNT_TOLERANCE:
            continue

        amount_after_refund = allocated_amount + refund_amount
        remaining_after_refund = max(0.0, _to_float(expense.amount) - amount_after_refund)
        candidate = {
            "expense": expense,
            "sourcePriority": _refund_source_priority(refund, expense),
            "amountDiff": abs(_to_float(expense.amount) - refund_amount),
            "remainingAfterRefund": remaining_after_refund,
            "timeDiffSeconds": time_diff_seconds,
            "orderMatch": _has_refund_order_match(refund, expense),
            "similarity": _refund_text_similarity(refund, expense),
        }
        if _is_acceptable_refund_candidate(candidate):
            candidates.append(candidate)

    return sorted(
        candidates,
        key=lambda item: (
            not item["orderMatch"],
            -item["sourcePriority"],
            item["timeDiffSeconds"],
            item["remainingAfterRefund"],
            item["amountDiff"],
            -item["similarity"],
        ),
    )[0] if candidates else None


def _is_acceptable_refund_candidate(candidate: dict) -> bool:
    if candidate["orderMatch"]:
        return True
    if candidate["similarity"] >= 0.18:
        return True
    return (
        candidate["sourcePriority"] >= 2
        and candidate["amountDiff"] <= REFUND_MATCH_AMOUNT_TOLERANCE
        and candidate["similarity"] >= 0.08
    )


def _is_refund_candidate(transaction: Transaction) -> bool:
    return (
        (get_transaction_semantic_type(transaction) == "refund" or _has_refund_signal(transaction))
        and _has_refund_signal(transaction)
        and not _has_hard_excluded_signal(transaction)
        and _to_float(transaction.amount) > 0
        and _parse_timestamp(transaction.time) is not None
    )


def _is_expense_candidate(transaction: Transaction) -> bool:
    return (
        get_transaction_semantic_type(transaction) == "expense"
        and _has_expense_signal(transaction)
        and not _has_excluded_signal(transaction)
        and not _is_bank_or_duplicate_source(transaction)
        and _to_float(transaction.amount) > 0
        and _parse_timestamp(transaction.time) is not None
    )


def _refund_source_priority(refund: Transaction, expense: Transaction) -> int:
    refund_source = _transaction_source(refund)
    expense_source = _transaction_source(expense)
    if refund_source and expense_source and refund_source == expense_source:
        return 2
    if not refund_source or not expense_source or refund_source in {"未知", "未知来源"} or expense_source in {"未知", "未知来源"}:
        return 1
    return 0


def _refund_text_similarity(refund: Transaction, expense: Transaction) -> float:
    refund_tokens = _refund_match_tokens(_normalize_refund_match_text(_transaction_match_text(refund)))
    expense_tokens = _refund_match_tokens(_normalize_refund_match_text(_transaction_match_text(expense)))
    if not refund_tokens or not expense_tokens:
        return 0.0
    intersection = refund_tokens & expense_tokens
    union = refund_tokens | expense_tokens
    return len(intersection) / len(union) if union else 0.0


def _has_refund_order_match(refund: Transaction, expense: Transaction) -> bool:
    refund_orders = _refund_order_tokens(refund)
    expense_orders = _refund_order_tokens(expense)
    return bool(refund_orders and expense_orders and refund_orders & expense_orders)


def _refund_order_tokens(transaction: Transaction) -> set[str]:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    tokens = set()
    for key in REFUND_ORDER_KEYS:
        value = re.sub(r"\s+", "", str(raw_json.get(key) or ""))
        if len(value) >= 8:
            tokens.add(value)
    return tokens


def _transaction_match_text(transaction: Transaction) -> str:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    values = [
        transaction.merchant,
        transaction.description,
        transaction.transaction_type,
        raw_json.get("merchant"),
        raw_json.get("description"),
        raw_json.get("transactionType"),
        raw_json.get("productName"),
        raw_json.get("goodsName"),
        raw_json.get("counterparty"),
        raw_json.get("itemName"),
        raw_json.get("goodsTitle"),
        raw_json.get("title"),
        raw_json.get("product"),
        raw_json.get("memo"),
        raw_json.get("remark"),
        raw_json.get("note"),
        raw_json.get("商品名称"),
        raw_json.get("商品说明"),
        raw_json.get("交易说明"),
        raw_json.get("交易对象"),
    ]
    return " ".join(str(value) for value in values if value)


def _transaction_semantic_text(transaction: Transaction) -> str:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    values = [
        transaction.source_platform,
        transaction.platform,
        transaction.merchant,
        transaction.description,
        transaction.transaction_type,
        transaction.type,
        transaction.category,
    ]
    values.extend(str(value) for value in raw_json.values() if value not in (None, ""))
    return " ".join(str(value) for value in values if value)


def _has_refund_signal(transaction: Transaction) -> bool:
    text = _transaction_semantic_text(transaction)
    return _contains_any(text, REFUND_SIGNAL_KEYWORDS) or transaction.type == "退款" or transaction.transaction_type == "退款"


def _has_expense_signal(transaction: Transaction) -> bool:
    return transaction.type == "支出" or transaction.transaction_type == "支出"


def _has_excluded_signal(transaction: Transaction) -> bool:
    return _contains_any(_transaction_semantic_text(transaction), EXCLUDED_SIGNAL_KEYWORDS)


def _has_hard_excluded_signal(transaction: Transaction) -> bool:
    return _contains_any(_transaction_semantic_text(transaction), {"亲情卡", "转账", "转入", "转出", "账户转移", "自动转入", "重复扣款", "中国银行"})


def _is_bank_or_duplicate_source(transaction: Transaction) -> bool:
    return _contains_any(_transaction_source(transaction), BANK_OR_DUPLICATE_SOURCE_KEYWORDS)


def _normalize_refund_match_text(value: str) -> str:
    text = str(value or "")
    text = re.sub(r"退款|退货|售后退款|退回|已退|返钱|返款|冲正|撤销|原路退回|运费险|退运费|运费赔付|赔付|补偿", " ", text)
    text = re.sub(r"中国银行|银行卡|储蓄卡|信用卡|支付宝支付科技有限公司|财付通支付科技有限公司|财付通|支付宝|微信支付|微信", " ", text)
    text = re.sub(r"交易|订单|商户|付款|收款|支出|收入|成功|业务|网上快捷支付|快捷支付|扫码支付|二维码支付", " ", text)
    text = re.sub(r"[^\u4e00-\u9fa5A-Za-z0-9]", " ", text)
    return re.sub(r"\s+", " ", text).strip().casefold()


def _refund_match_tokens(text: str) -> set[str]:
    tokens = {token for token in str(text or "").split() if len(token) >= 2}
    chinese = re.sub(r"[^\u4e00-\u9fa5]", "", str(text or ""))
    for index in range(0, max(0, len(chinese) - 1)):
        tokens.add(chinese[index : index + 2])
    return tokens


def _merge_refund_metadata(transaction: Transaction, metadata: dict, now: datetime) -> int:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    updated = dict(raw_json)
    updated.update(metadata)
    if updated == raw_json:
        return 0
    transaction.raw_json = json.dumps(updated, ensure_ascii=False)
    transaction.updated_at = now
    return 1


def _clear_refund_metadata(raw_json: dict) -> dict:
    return {key: value for key, value in (raw_json or {}).items() if key not in REFUND_METADATA_KEYS}


def _refund_status(original_amount, refunded_amount) -> str:
    return "full" if _to_float(original_amount) - _to_float(refunded_amount) <= REFUND_MATCH_AMOUNT_TOLERANCE else "partial"


def _transaction_source(transaction: Transaction) -> str:
    return str(transaction.source_platform or transaction.platform or "").strip()


def _parse_timestamp(value) -> datetime | None:
    text = str(value or "").strip().replace("/", "-")
    match = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?", text)
    if not match:
        return None
    year, month, day, hour, minute, second = match.groups()
    normalized = (
        f"{int(year):04d}-{int(month):02d}-{int(day):02d} "
        f"{int(hour or 0):02d}:{int(minute or 0):02d}:{int(second or 0):02d}"
    )
    return datetime.strptime(normalized, "%Y-%m-%d %H:%M:%S")


def _contains_any(value: str, keywords: set[str]) -> bool:
    normalized = str(value or "").casefold()
    return any(str(keyword).casefold() in normalized for keyword in keywords)


def _round_amount(value) -> float:
    return round(_to_float(value) + 1e-9, 2)


def _to_float(value) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def _raw_json_to_dict(raw_json: str | None) -> dict:
    if not raw_json:
        return {}
    try:
        data = json.loads(raw_json)
    except (TypeError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}
