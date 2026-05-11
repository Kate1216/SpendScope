import json

from models import Transaction
from services.category_rule_service import get_transaction_semantic_type


def get_effective_expense_amount(transaction: Transaction) -> float:
    if get_transaction_semantic_type(transaction) != "expense":
        return 0.0

    raw_json = _raw_json_to_dict(transaction.raw_json)
    net_amount = raw_json.get("netAmount")
    if _has_number_value(net_amount):
        return max(0.0, _to_float(net_amount))
    return max(0.0, _to_float(transaction.amount))


def get_effective_income_amount(transaction: Transaction) -> float:
    if _has_refund_marker(transaction):
        return 0.0
    if get_transaction_semantic_type(transaction) != "income":
        return 0.0
    return max(0.0, _to_float(transaction.amount))


def get_refund_amount(transaction: Transaction) -> float:
    if get_transaction_semantic_type(transaction) != "refund":
        return 0.0
    return max(0.0, _to_float(transaction.amount))


def _has_refund_marker(transaction: Transaction) -> bool:
    raw_json = _raw_json_to_dict(transaction.raw_json)
    return (
        get_transaction_semantic_type(transaction) == "refund"
        or transaction.type == "退款"
        or transaction.transaction_type == "退款"
        or raw_json.get("refundLinked") is not None
        or raw_json.get("refundMatchStatus") in {"matched", "unmatched"}
    )


def _has_number_value(value) -> bool:
    if value in (None, ""):
        return False
    try:
        float(value)
    except (TypeError, ValueError):
        return False
    return True


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
