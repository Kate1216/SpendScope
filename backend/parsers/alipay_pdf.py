from io import BytesIO
from decimal import Decimal, InvalidOperation
import re

import pdfplumber


def parse_alipay_pdf(file_bytes: bytes) -> dict:
    pages_count = 0
    tables_count = 0
    raw_rows = []

    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            pages_count = len(pdf.pages)

            for page in pdf.pages:
                tables = page.extract_tables() or []
                tables_count += len(tables)

                for table in tables:
                    raw_rows.extend(table or [])
    except Exception as exc:
        return {
            "ok": False,
            "parser": "pdfplumber-table",
            "rows": [],
            "error": "支付宝 PDF 表格读取失败",
            "debug": {
                "pages": pages_count,
                "tables": tables_count,
                "rawRows": len(raw_rows),
                "rows": 0,
                "droppedRows": 0,
                "sample": [],
                "rawSample": raw_rows[:20],
                "exception": str(exc),
            },
        }

    rows = []
    dropped_rows = 0

    for raw_row in raw_rows:
        row = _convert_alipay_raw_row(raw_row)
        if row:
            rows.append(row)
        else:
            dropped_rows += 1

    debug = {
        "pages": pages_count,
        "tables": tables_count,
        "rawRows": len(raw_rows),
        "rows": len(rows),
        "droppedRows": dropped_rows,
        "sample": rows[:10],
        "rawSample": raw_rows[:20],
    }

    if not rows:
        return {
            "ok": False,
            "parser": "pdfplumber-table",
            "rows": [],
            "error": "未识别到支付宝交易明细",
            "debug": debug,
        }

    return {
        "ok": True,
        "parser": "pdfplumber-table",
        "rows": rows,
        "debug": debug,
    }


def _convert_alipay_raw_row(raw_row) -> dict | None:
    if not raw_row or len(raw_row) < 8:
        return None

    income_expense = _clean_income_expense(raw_row[0])
    if not income_expense:
        return None

    amount = _clean_amount(raw_row[4])
    if amount is None:
        return None

    trade_time = _clean_trade_time(raw_row[7])
    if trade_time is None:
        return None

    description = _clean_text(raw_row[2])

    return {
        "收/支": income_expense,
        "原始收支": income_expense,
        "交易对方": _clean_text(raw_row[1]),
        "商品说明": description,
        "交易说明": description,
        "收/付款方式": _clean_compact_text(raw_row[3]),
        "金额": amount,
        "交易订单号": _clean_identifier(raw_row[5]),
        "商家订单号": _clean_identifier(raw_row[6]),
        "交易时间": trade_time,
        "平台": "支付宝",
        "sourcePlatform": "支付宝",
        "__sourcePlatform": "支付宝",
    }


def _clean_income_expense(value) -> str | None:
    text = _clean_compact_text(value)

    if text in {"支出", "收入", "不计收支", "收支"}:
        return text
    if "不计" in text and "收支" in text:
        return "不计收支"
    if "支出" in text:
        return "支出"
    if "收入" in text:
        return "收入"

    return None


def _clean_text(value) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("\n", " ")).strip()


def _clean_compact_text(value) -> str:
    return re.sub(r"\s+", "", str(value or ""))


def _clean_identifier(value) -> str:
    return _clean_compact_text(value)


def _clean_amount(value) -> str | None:
    text = _clean_text(value)
    if not text:
        return None

    text = text.replace(",", "")
    match = re.search(r"[-+]?\d+(?:\.\d+)?", text)
    if not match:
        return None

    try:
        amount = Decimal(match.group())
    except InvalidOperation:
        return None

    return f"{amount.quantize(Decimal('0.01'))}"


def _clean_trade_time(value) -> str | None:
    text = _clean_text(value)
    if not text:
        return None

    match = re.search(
        r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?",
        text,
    )
    if not match:
        return None

    year, month, day, hour, minute, second = match.groups()
    date_part = f"{year}-{int(month):02d}-{int(day):02d}"

    if hour is None:
        return f"{date_part} 00:00:00"

    return f"{date_part} {int(hour):02d}:{int(minute):02d}:{int(second or 0):02d}"
