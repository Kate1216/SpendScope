from io import BytesIO

try:
    import pdfplumber
except ImportError:  # pragma: no cover - backend requirements include pdfplumber
    pdfplumber = None


def detect_upload_platform(filename: str, content_type: str, file_bytes: bytes) -> str:
    text = _build_detection_text(filename, content_type, file_bytes)
    filename_text = str(filename or "").lower()

    if _filename_has_alipay(filename_text):
        return "支付宝"
    if _filename_has_wechat(filename_text):
        return "微信"
    if _filename_has_boc(filename_text):
        return "中国银行"

    if _content_has_alipay(text):
        return "支付宝"
    if _content_has_boc(text):
        return "中国银行"
    if _content_has_wechat(text):
        return "微信"

    return "未知"


def _build_detection_text(filename: str, content_type: str, file_bytes: bytes) -> str:
    parts = [filename or "", content_type or ""]

    # First pass only needs lightweight detection. Some text-like exports expose
    # useful keywords directly in the first bytes; binary PDFs usually rely on filename.
    sample = (file_bytes or b"")[:65536]
    for encoding in ("utf-8", "gb18030"):
        try:
            decoded = sample.decode(encoding, errors="ignore")
        except Exception:
            continue
        if decoded:
            parts.append(decoded)

    if _is_probably_pdf(filename, content_type, file_bytes):
        parts.append(_extract_pdf_detection_text(file_bytes))

    return " ".join(parts).lower()


def _filename_has_alipay(filename_text: str) -> bool:
    filename_keywords = ["支付宝", "alipay"]
    return any(keyword in filename_text for keyword in filename_keywords)


def _content_has_alipay(text: str) -> bool:
    content_keywords = ["支付宝交易明细", "支付宝交易流水证明", "支付宝支付科技有限公司", "交易订单号", "商家订单号"]
    return any(keyword in text for keyword in content_keywords)


def _filename_has_wechat(filename_text: str) -> bool:
    filename_keywords = ["微信", "微信支付", "wechat", "wx"]
    return any(keyword in filename_text for keyword in filename_keywords)


def _content_has_wechat(text: str) -> bool:
    content_keywords = ["微信支付", "财付通", "零钱", "收/支", "交易对方", "当前状态", "交易状态", "商品说明"]
    return any(keyword in text for keyword in content_keywords)


def _filename_has_boc(filename_text: str) -> bool:
    filename_keywords = ["中国银行", "中行", "boc", "bank of china"]
    return any(keyword in filename_text for keyword in filename_keywords)


def _content_has_boc(text: str) -> bool:
    content_keywords = ["中国银行", "bank of china", "交易日期", "交易金额", "余额", "对方户名", "摘要"]
    return any(keyword in text for keyword in content_keywords)


def _is_probably_pdf(filename: str, content_type: str, file_bytes: bytes) -> bool:
    return (
        str(filename or "").lower().endswith(".pdf")
        or "pdf" in str(content_type or "").lower()
        or (file_bytes or b"").startswith(b"%PDF")
    )


def _extract_pdf_detection_text(file_bytes: bytes) -> str:
    if pdfplumber is None or not file_bytes:
        return ""

    try:
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            return "\n".join((page.extract_text() or "") for page in pdf.pages[:2])
    except Exception:
        return ""
