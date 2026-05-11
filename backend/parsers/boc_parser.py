from hashlib import sha1
from io import BytesIO
from decimal import Decimal, InvalidOperation
import re

import pdfplumber


TRANSACTION_START_RE = re.compile(
    r"^20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\s+"
    r"\d{1,2}:\d{2}:\d{2}\s+人民币\s+"
    r"[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})\s+"
    r"[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2})"
)

TABLE_INFO_RE = re.compile(
    r"^(?P<date>20\d{2}[-/.]\d{1,2}[-/.]\d{1,2})\s+"
    r"(?P<time>\d{1,2}:\d{2}:\d{2})\s+人民币\s+"
    r"(?P<amount>[+-]?\s*(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})\s+"
    r"(?P<balance>[+-]?\s*(?:\d{1,3}(?:,\d{3})+|\d+)\.\d{2})\s+"
    r"(?P<rest>.+)$"
)

AMOUNT_RE = re.compile(
    r"人民币\s+"
    r"(?P<amount>[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2}))\s+"
    r"(?P<balance>[+-]?\s*\d+(?:,\d{3})*(?:\.\d{2}))"
)

CHANNEL_RE = re.compile(r"^(?P<name>.+?)\s+(?P<channel>银企对接|网上银行|手机银行|柜台|ATM|自助终端|其他)\s+(?P<tail>.+)$")

NOISE_RE = re.compile(
    r"中国银行交易流水明细清单|交易区间|客户姓名|页数:|借记卡号|"
    r"借方发生数|贷方发生数|行数:|账号：|按收支筛选|按币种筛选|"
    r"打印时间|记账日期.*记账时间|对方卡号/账号|对方开户行|"
    r"-{5,}END-{5,}|温馨提示|第\s*\d+\s*页/共\s*\d+\s*页"
)

BOC_KEYWORDS_RE = re.compile(
    r"中国银行|Bank of China|BANK OF CHINA|账户交易明细|中国银行交易明细|"
    r"交易流水明细清单|电子回单|记账日期|交易日期|对方户名|对方账号|"
    r"收入金额|支出金额|借方|贷方"
)


def parse_boc_file(file_bytes: bytes, filename: str = "") -> list[dict]:
    if not _looks_like_pdf(file_bytes, filename):
        return []

    lines = _extract_pdf_lines(file_bytes)
    text = "\n".join(lines)
    if not _is_boc_text(text, filename):
        return []

    blocks = _build_transaction_blocks(lines)
    transactions = []
    for block in blocks:
        transaction = _parse_transaction_block(block)
        if transaction:
            transactions.append(transaction)

    return transactions


def _looks_like_pdf(file_bytes: bytes, filename: str) -> bool:
    return str(filename or "").lower().endswith(".pdf") or file_bytes.startswith(b"%PDF")


def _extract_pdf_lines(file_bytes: bytes) -> list[str]:
    lines = []
    with pdfplumber.open(BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            for line in page_text.splitlines():
                cleaned = _clean_text(line)
                if cleaned:
                    lines.append(cleaned)
    return lines


def _is_boc_text(text: str, filename: str = "") -> bool:
    return bool(BOC_KEYWORDS_RE.search(f"{filename} {text}"))


def _build_transaction_blocks(lines: list[str]) -> list[list[str]]:
    blocks = []
    current_block = None

    for line in lines:
        if _is_transaction_start(line):
            if current_block:
                blocks.append(current_block)
            current_block = [line]
            continue

        if _is_noise_line(line):
            continue

        if current_block is not None:
            current_block.append(line)

    if current_block:
        blocks.append(current_block)

    return blocks


def _is_transaction_start(line: str) -> bool:
    return bool(TRANSACTION_START_RE.search(_clean_text(line)))


def _is_noise_line(line: str) -> bool:
    return bool(NOISE_RE.search(_clean_text(line)))


def _parse_transaction_block(block: list[str]) -> dict | None:
    source = _clean_text(" ".join(block))
    if not source or not _is_transaction_start(source):
        return None

    table_info = _extract_table_info(source)
    if not table_info:
        return None

    signed_amount = table_info["signed_amount"]
    amount = abs(signed_amount)
    transaction_type = table_info["transaction_name"] or _infer_transaction_name(source, signed_amount)
    transaction_direction = _detect_direction(signed_amount)
    category = _detect_category(transaction_direction)
    merchant = table_info["merchant"] or transaction_type or "中国银行交易"
    description = table_info["description"] or merchant

    transaction = {
        "id": _build_transaction_id(table_info["time"], merchant, description, amount, transaction_direction),
        "time": table_info["time"],
        "sourcePlatform": "中国银行",
        "platform": "中国银行",
        "merchant": merchant,
        "description": description,
        "transactionType": transaction_type,
        "type": transaction_direction,
        "category": category,
        "amount": float(amount),
    }
    if table_info.get("balance") is not None:
        transaction["balance"] = float(table_info["balance"])

    return transaction


def _extract_table_info(line: str) -> dict | None:
    match = TABLE_INFO_RE.search(line)
    if not match:
        return None

    signed_amount = _parse_decimal(match.group("amount"))
    balance = _parse_decimal(match.group("balance"))
    if signed_amount is None or balance is None:
        return None

    time = _normalize_datetime(match.group("date"), match.group("time"))
    rest = _clean_text(match.group("rest"))

    transaction_match = CHANNEL_RE.search(rest)
    if transaction_match:
        transaction_name = _clean_text(transaction_match.group("name"))
        channel = _clean_text(transaction_match.group("channel"))
        tail = _clean_text(transaction_match.group("tail"))
    else:
        transaction_name = _infer_transaction_name(rest, signed_amount)
        channel = ""
        tail = rest

    merchant = _extract_merchant(tail, transaction_name)
    description = _clean_description(" ".join(part for part in [transaction_name, channel, tail] if part))

    return {
        "time": time,
        "signed_amount": signed_amount,
        "balance": balance,
        "transaction_name": transaction_name,
        "merchant": merchant,
        "description": description or merchant,
    }


def _parse_decimal(value: str) -> Decimal | None:
    try:
        return Decimal(str(value or "").replace(",", "").replace(" ", ""))
    except (InvalidOperation, ValueError):
        return None


def _normalize_datetime(date_text: str, time_text: str) -> str:
    date = str(date_text or "").replace("/", "-").replace(".", "-")
    year, month, day = (date.split("-") + ["1", "1"])[:3]
    hour, minute, second = (str(time_text or "00:00:00").split(":") + ["00", "00"])[:3]
    return f"{year}-{month.zfill(2)}-{day.zfill(2)} {hour.zfill(2)}:{minute.zfill(2)}:{second.zfill(2)}"


def _detect_direction(signed_amount: Decimal) -> str:
    if signed_amount > 0:
        return "收入"
    if signed_amount < 0:
        return "支出"
    return "排除"


def _detect_category(transaction_type: str) -> str:
    if transaction_type == "支出":
        return "待确认"
    if transaction_type == "收入":
        return "其他"
    return "排除"


def _extract_merchant(text: str, transaction_name: str = "") -> str:
    value = _clean_text(text)
    value = re.sub(r"-[-\s]{5,}", " ", value)
    value = re.sub(r"\bZ\d+[A-Z]?\b", " ", value, flags=re.IGNORECASE)
    value = re.sub(r"\b\d{6,}(?:\s+N)?\b", " ", value)
    value = re.sub(r"\bN\b", " ", value)
    value = re.sub(
        r"中国银行[^ ]*|中国工商银行|中国农业银行|中国建设银行|交通银行|招商银行|支付宝支付科技有限公司",
        " ",
        value,
    )
    value = re.sub(r"\d{6,}[:：][^ ]*", " ", value)
    value = _clean_text(value)

    if not value or value == "----------":
        return transaction_name or "中国银行交易"

    platform_match = re.search(r"((?:财付通|支付宝|抖音支付)-[^\s]{2,60}(?:\s+[^\s\d-]{1,20})?)", value)
    if platform_match:
        return _collapse_repeated_text(platform_match.group(1))

    named_party = re.search(r"(?:^|\s)([\u4e00-\u9fffA-Za-z·（）()]{2,30})(?:\s|$)", value)
    return _collapse_repeated_text(named_party.group(1) if named_party else value) or transaction_name or "中国银行交易"


def _infer_transaction_name(text: str, signed_amount: Decimal | int | float = 0) -> str:
    value = str(text or "")
    if "手续费" in value:
        return "手续费"
    if re.search(r"工资|薪资", value):
        return "工资"
    if re.search(r"利息|结息", value):
        return "利息"
    if re.search(r"转账|转入|转出|汇款|来账", value):
        return "转账"
    if re.search(r"消费|支付|扣款|缴费", value):
        return "消费"
    if Decimal(str(signed_amount or 0)) == 0:
        return "账户调整"
    return "银行交易"


def _clean_description(value: str) -> str:
    text = _clean_text(value)
    text = re.sub(r"(?:CNY|RMB|人民币|￥|¥)?\s*[+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"中国银行|Bank of China|BANK OF CHINA|账户余额|可用余额|借方|贷方|收入金额|支出金额", " ", text)
    return _clean_text(text)


def _collapse_repeated_text(value: str) -> str:
    parts = [_clean_text(part) for part in str(value or "").split()]
    parts = [part for part in parts if part]
    if len(parts) >= 2 and parts[0] == parts[1]:
        return parts[0]
    if len(parts) >= 2 and parts[1].startswith(parts[0]):
        return parts[1]
    return re.sub(r"(.{2,40})\s+\1", r"\1", " ".join(parts)).strip()


def _clean_text(value) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("\n", " ")).strip()


def _build_transaction_id(time: str, merchant: str, description: str, amount: Decimal, transaction_type: str) -> str:
    raw = f"中国银行|{time}|{merchant}|{description}|{amount}|{transaction_type}"
    digest = sha1(raw.encode("utf-8")).hexdigest()[:16]
    return f"backend-boc-{digest}"
