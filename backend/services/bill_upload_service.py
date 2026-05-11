from decimal import Decimal, InvalidOperation
from hashlib import sha1
import re
from typing import Any

from fastapi import UploadFile

from parsers.alipay_pdf import parse_alipay_pdf
from parsers.boc_parser import parse_boc_file
from parsers.wechat_parser import parse_wechat_file
from services.platform_detect import detect_upload_platform


async def process_bill_uploads(files: list[UploadFile]) -> dict:
    file_summaries = []
    transactions = []

    for upload in files or []:
        summary, parsed_transactions = await _process_one_upload(upload)
        file_summaries.append(summary)
        transactions.extend(parsed_transactions)

    return {
        "ok": True,
        "files": file_summaries,
        "transactions": transactions,
    }


async def _process_one_upload(upload: UploadFile) -> tuple[dict, list[dict]]:
    filename = upload.filename or ""
    content_type = upload.content_type or ""

    try:
        file_bytes = await upload.read()
    except Exception as exc:
        return (
            {
                "filename": filename,
                "platform": "未知",
                "status": "error",
                "transactions": 0,
                "error": "failed to read uploaded file",
                "detail": str(exc),
            },
            [],
        )

    platform = detect_upload_platform(filename, content_type, file_bytes)

    if platform == "支付宝" and _is_pdf_upload(filename, content_type):
        parsed = parse_alipay_pdf(file_bytes)
        if parsed.get("ok") is True and isinstance(parsed.get("rows"), list):
            transactions = [_normalize_alipay_row(row, filename, index) for index, row in enumerate(parsed["rows"])]
            return (
                {
                    "filename": filename,
                    "platform": platform,
                    "status": "parsed",
                    "transactions": len(transactions),
                },
                transactions,
            )

        return (
            {
                "filename": filename,
                "platform": platform,
                "status": "error",
                "transactions": 0,
                "error": parsed.get("error") or "failed to parse alipay pdf",
                "debug": parsed.get("debug"),
            },
            [],
        )

    if platform == "微信":
        try:
            transactions = parse_wechat_file(file_bytes, filename)
        except Exception as exc:
            return (
                {
                    "filename": filename,
                    "platform": platform,
                    "status": "failed",
                    "transactions": 0,
                    "error": str(exc),
                },
                [],
            )

        if transactions:
            return (
                {
                    "filename": filename,
                    "platform": platform,
                    "status": "parsed",
                    "transactions": len(transactions),
                },
                transactions,
            )

        return (
            {
                "filename": filename,
                "platform": platform,
                "status": "failed",
                "transactions": 0,
                "error": "no wechat transactions parsed",
            },
            [],
        )

    if platform == "中国银行" and _is_pdf_upload(filename, content_type):
        try:
            transactions = parse_boc_file(file_bytes, filename)
        except Exception as exc:
            return (
                {
                    "filename": filename,
                    "platform": platform,
                    "status": "failed",
                    "transactions": 0,
                    "error": str(exc),
                },
                [],
            )

        if transactions:
            return (
                {
                    "filename": filename,
                    "platform": platform,
                    "status": "parsed",
                    "transactions": len(transactions),
                },
                transactions,
            )

        return (
            {
                "filename": filename,
                "platform": platform,
                "status": "failed",
                "transactions": 0,
                "error": "no boc transactions parsed",
            },
            [],
        )

    return (
        {
            "filename": filename,
            "platform": platform,
            "status": "unsupported",
            "transactions": 0,
        },
        [],
    )


def _is_pdf_upload(filename: str, content_type: str) -> bool:
    return filename.lower().endswith(".pdf") or "pdf" in (content_type or "").lower()


def _normalize_alipay_row(row: dict, filename: str, index: int) -> dict:
    time = _get_row_value(row, ["交易时间", "time", "浜ゆ槗鏃堕棿"]) or ""
    payment_method = _get_row_value(row, ["收/付款方式", "收付款方式", "平台", "platform", "鏀?浠樻鏂瑰紡", "骞冲彴"]) or ""
    merchant = _get_row_value(row, ["交易对方", "merchant", "浜ゆ槗瀵规柟"]) or ""
    description = _get_row_value(row, ["商品说明", "交易说明", "description", "鍟嗗搧璇存槑", "浜ゆ槗璇存槑"]) or merchant
    raw_type = _get_row_value(row, ["收/支", "收支", "原始收支", "type", "鏀?鏀?", "鍘熷鏀舵敮"]) or ""
    category = _get_row_value(row, ["消费类别", "category"]) or "待确认"
    amount = _to_number(_get_row_value(row, ["金额", "amount", "閲戦"]))

    transaction_type = _normalize_transaction_type(raw_type, f"{merchant} {description}")
    normalized_category = category
    if transaction_type == "退款":
        normalized_category = "退款/抵扣"
    elif transaction_type == "排除" and category == "待确认":
        normalized_category = "排除"

    transaction = {
        "time": time,
        "sourcePlatform": "支付宝",
        "platform": payment_method,
        "merchant": merchant,
        "description": description,
        "transactionType": raw_type,
        "type": transaction_type,
        "category": normalized_category,
        "amount": amount,
    }
    transaction["id"] = _build_transaction_id(transaction, filename, index)
    return transaction


def _get_row_value(row: dict, keys: list[str]) -> Any:
    for key in keys:
        if key in row and row[key] not in (None, ""):
            return row[key]

    normalized_lookup = {_normalize_key(key): value for key, value in row.items()}
    for key in keys:
        value = normalized_lookup.get(_normalize_key(key))
        if value not in (None, ""):
            return value

    return ""


def _normalize_key(key: str) -> str:
    return "".join(str(key or "").split()).lower()


def _normalize_transaction_type(value: Any, context: Any = "") -> str:
    text = str(value or "").strip()
    combined = f"{text} {context or ''}"
    if _has_refund_signal(combined):
        return "退款"
    if "不计" in text or "排除" in text:
        return "排除"
    if "退款" in text:
        return "退款"
    if "收入" in text:
        return "收入"
    if "支出" in text:
        return "支出"
    return text or "待确认"


def _has_refund_signal(value: Any) -> bool:
    return bool(re.search(r"退款-|退款|退货|售后退款|退回|原路退回|运费补贴|运费补偿|已退款", str(value or "")))


def _to_number(value: Any) -> float:
    text = str(value or "").replace(",", "").strip()
    if not text:
        return 0

    try:
        return float(Decimal(text))
    except (InvalidOperation, ValueError):
        return 0


def _build_transaction_id(transaction: dict, filename: str, index: int) -> str:
    raw = "|".join(
        [
            filename or "",
            str(index),
            transaction.get("sourcePlatform") or "",
            transaction.get("time") or "",
            transaction.get("merchant") or "",
            transaction.get("description") or "",
            str(transaction.get("amount") or 0),
        ]
    )
    return f"backend-{sha1(raw.encode('utf-8')).hexdigest()[:16]}"
