from datetime import datetime
import json
import re

from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import CategoryRule, Transaction
from schemas import CategoryRuleCreate, CategoryRulePatch

GENERIC_MERCHANT_KEYWORDS = {"微信支付", "支付宝", "财付通", "银联", "云闪付", "商户消费", "二维码付款", "扫码支付"}
REUSABLE_KEYWORDS = ["地铁", "公交", "公共交通", "轨道交通", "交通卡", "metro", "余额宝", "收益发放", "易方达增金宝", "基金收益", "理财收益"]
YIELD_KEYWORDS = ["余额宝", "收益发放", "易方达增金宝", "基金收益", "理财收益"]


SIMILARITY_STRONG_KEYWORDS = {
    "wanpy",
    "happy100",
    "顽皮",
    "鲜封包",
    "金枪鱼味",
}
SIMILARITY_CATEGORY_KEYWORDS = {
    "猫粮",
    "猫零食",
    "湿粮",
    "宠物湿粮",
    "罐头",
    "妙鲜包",
    "妙鲜",
}
SIMILARITY_WEAK_KEYWORDS = {
    "猫",
    "宠物",
    "零食",
    "包",
    "味",
    "成幼猫",
    "服务",
}
SIMILARITY_IGNORED_KEYWORDS = {
    "余额宝",
    "中国银行",
    "储蓄卡",
    "花呗",
    "支付宝",
    "微信",
    "银行卡",
    "信用卡",
}
SIMILARITY_KNOWN_KEYWORDS = (
    SIMILARITY_STRONG_KEYWORDS
    | SIMILARITY_CATEGORY_KEYWORDS
    | SIMILARITY_WEAK_KEYWORDS
    | SIMILARITY_IGNORED_KEYWORDS
)
# 0.45 keeps the fallback useful for renamed goods while still requiring nearly
# half of the smaller product-token set to match.
SIMILARITY_MIN_OVERLAP_SCORE = 0.45
SIMILARITY_RAW_JSON_FIELDS = [
    "rawDescription",
    "rawMerchant",
    "productName",
    "goodsName",
    "counterparty",
    "itemName",
    "goodsTitle",
    "title",
    "product",
    "memo",
    "remark",
    "note",
    "商品名称",
    "商品说明",
    "交易说明",
    "交易对象",
    "对方账户",
    "收款方",
    "付款方",
    "description",
    "merchant",
    "transactionType",
    "transaction_type",
]
SEMANTIC_RAW_JSON_FIELDS = [
    "rawDescription",
    "rawMerchant",
    "productName",
    "goodsName",
    "counterparty",
    "memo",
    "remark",
    "note",
    "商品名称",
    "商品说明",
    "交易说明",
    "交易对象",
    "收支类型",
    "交易类型",
    "当前状态",
    "交易状态",
    "platform",
    "sourcePlatform",
    "type",
    "category",
    "transactionType",
    "transaction_type",
    "rawType",
    "incomeExpenseType",
    "originalType",
]
SEMANTIC_EXCLUDED_KEYWORDS = {
    "亲情卡",
    "不计收支",
    "排除",
    "还款",
    "退货",
    "售后",
    "运费补贴",
}
SEMANTIC_REFUND_KEYWORDS = {
    "退款",
    "退货",
    "售后",
    "运费补贴",
}
SEMANTIC_TRANSFER_KEYWORDS = {
    "账户转移",
    "自动转入",
    "余额宝自动转入",
    "转账",
    "转入",
    "转出",
}


def category_rule_to_out(rule: CategoryRule) -> dict:
    return {
        "id": rule.id,
        "merchantKeyword": rule.merchant_keyword,
        "descriptionKeyword": rule.description_keyword,
        "targetCategory": rule.target_category,
        "targetType": rule.target_type,
        "createdFromTransactionId": rule.created_from_transaction_id,
        "confidence": rule.confidence,
        "enabled": rule.enabled,
        "createdAt": _format_datetime(rule.created_at),
        "updatedAt": _format_datetime(rule.updated_at),
    }


def list_category_rules(db: Session, enabled_only: bool = True) -> list[dict]:
    query = db.query(CategoryRule)
    if enabled_only:
        query = query.filter(CategoryRule.enabled.is_(True))
    rules = query.order_by(CategoryRule.created_at.desc(), CategoryRule.id.desc()).all()
    return [category_rule_to_out(rule) for rule in rules]


def apply_category_rules(transactions: list[dict], db: Session) -> list[dict]:
    rules = (
        db.query(CategoryRule)
        .filter(CategoryRule.enabled.is_(True))
        .order_by(CategoryRule.updated_at.desc(), CategoryRule.id.desc())
        .all()
    )
    if not rules:
        return transactions

    for transaction in transactions:
        for rule in rules:
            if not _rule_matches_transaction(rule, transaction):
                continue
            if not rule_allows_transaction_semantics(rule, transaction):
                continue

            transaction["category"] = rule.target_category
            if rule.target_type:
                transaction["type"] = rule.target_type
            transaction["categoryRuleId"] = rule.id
            transaction["categoryRuleMatched"] = True
            break

    return transactions


def apply_single_category_rule_to_existing_transactions(db: Session, rule: CategoryRule | dict) -> int:
    rule_model = _coerce_rule_model(db, rule)
    if rule_model is None or not rule_model.enabled:
        return 0
    if not _clean_optional_text(rule_model.merchant_keyword) and not _clean_optional_text(rule_model.description_keyword):
        return 0

    now = datetime.utcnow()
    applied_count = 0
    for transaction in db.query(Transaction).all():
        raw_json = _raw_json_to_dict(transaction.raw_json)
        if _is_manual_other_override(transaction, raw_json):
            continue

        if not _rule_matches_transaction(rule_model, _transaction_to_match_dict(transaction, raw_json)):
            continue
        if not rule_allows_transaction_semantics(rule_model, transaction):
            continue

        transaction.category = rule_model.target_category
        if rule_model.target_type:
            transaction.type = rule_model.target_type
        transaction.raw_json = _merge_rule_metadata(raw_json, rule_model)
        transaction.updated_at = now
        applied_count += 1

    if applied_count:
        db.commit()

    return applied_count


def create_category_rule(db: Session, payload: CategoryRuleCreate) -> dict:
    merchant_keyword = _clean_optional_text(payload.merchantKeyword)
    description_keyword = _clean_optional_text(payload.descriptionKeyword)
    target_category = _clean_required_text(payload.targetCategory, "targetCategory")

    if not merchant_keyword and not description_keyword:
        raise HTTPException(status_code=400, detail="merchantKeyword or descriptionKeyword is required")

    now = datetime.utcnow()
    rule = CategoryRule(
        merchant_keyword=merchant_keyword,
        description_keyword=description_keyword,
        target_category=target_category,
        target_type=_clean_optional_text(payload.targetType),
        created_from_transaction_id=_clean_optional_text(payload.createdFromTransactionId),
        confidence=1.0,
        enabled=True,
        created_at=now,
        updated_at=now,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return category_rule_to_out(rule)


def create_or_update_rule_from_transaction(db: Session, transaction) -> dict | None:
    merchant_keyword, description_keyword = _derive_rule_keywords(transaction)

    if not merchant_keyword and not description_keyword:
        return None

    target_category = _clean_optional_text(getattr(transaction, "category", None))
    target_type = _clean_optional_text(getattr(transaction, "type", None))
    if not target_category or not target_type:
        return None

    now = datetime.utcnow()
    rule = _find_existing_enabled_rule(db, merchant_keyword, description_keyword)

    if rule is None:
        rule = CategoryRule(
            merchant_keyword=merchant_keyword,
            description_keyword=description_keyword,
            confidence=1.0,
            enabled=True,
            created_at=now,
        )
        db.add(rule)

    rule.target_category = target_category
    rule.target_type = target_type
    rule.created_from_transaction_id = getattr(transaction, "id", None)
    rule.updated_at = now

    db.commit()
    db.refresh(rule)
    return category_rule_to_out(rule)


def derive_rule_keywords_for_transaction(transaction) -> tuple[str | None, str | None]:
    return _derive_rule_keywords(transaction)


def transaction_matches_rule_keywords(transaction: Transaction, merchant_keyword: str | None, description_keyword: str | None) -> bool:
    merchant_keyword = _clean_optional_text(merchant_keyword)
    description_keyword = _clean_optional_text(description_keyword)
    if not merchant_keyword and not description_keyword:
        return False
    raw_json = _raw_json_to_dict(transaction.raw_json)
    return _keywords_match_transaction(merchant_keyword, description_keyword, _transaction_to_match_dict(transaction, raw_json))


def get_transaction_semantic_type(transaction) -> str:
    raw_json = _transaction_raw_json(transaction)
    text = _normalize_match_text(_build_transaction_semantic_text(transaction, raw_json))
    transaction_type = _normalize_match_text(_transaction_field_value(transaction, "transaction_type", "transactionType"))
    type_value = _normalize_match_text(_transaction_field_value(transaction, "type", "type"))
    category_value = _normalize_match_text(_transaction_field_value(transaction, "category", "category"))

    if "亲情卡" in text:
        return "excluded"
    if _contains_any(text, SEMANTIC_TRANSFER_KEYWORDS):
        return "transfer"
    if _contains_any(text, SEMANTIC_REFUND_KEYWORDS):
        return "refund"
    if (
        "排除" in type_value
        or "排除" in category_value
        or "排除" in transaction_type
        or "不计收支" in transaction_type
        or _contains_any(text, SEMANTIC_EXCLUDED_KEYWORDS)
    ):
        return "excluded"
    if "退款" in type_value or "退款" in category_value or "退款" in transaction_type:
        return "refund"
    if "收入" in type_value or "收入" in transaction_type:
        return "income"
    if "支出" in type_value or "支出" in transaction_type:
        return "expense"
    return "unknown"


def is_semantic_type_compatible(source_transaction, candidate_transaction) -> bool:
    source_type = get_transaction_semantic_type(source_transaction)
    candidate_type = get_transaction_semantic_type(candidate_transaction)
    if source_type == "unknown" or candidate_type == "unknown":
        return False
    return source_type == candidate_type


def rule_allows_transaction_semantics(rule, transaction) -> bool:
    rule_semantic_type = _rule_target_semantic_type(rule)
    transaction_semantic_type = get_transaction_semantic_type(transaction)
    if rule_semantic_type == "unknown" or transaction_semantic_type == "unknown":
        return False
    if rule_semantic_type == "excluded":
        return transaction_semantic_type in {"excluded", "transfer"}
    return rule_semantic_type == transaction_semantic_type


def build_similarity_searchable_text(transaction) -> str:
    if isinstance(transaction, str):
        return transaction

    if isinstance(transaction, dict):
        raw_json = transaction.get("raw_json")
        if isinstance(raw_json, str):
            raw_json = _raw_json_to_dict(raw_json)
        if not isinstance(raw_json, dict):
            raw_json = {}
        values = [
            transaction.get("description"),
            transaction.get("merchant"),
            transaction.get("transactionType"),
            transaction.get("transaction_type"),
        ]
    else:
        raw_json = _raw_json_to_dict(getattr(transaction, "raw_json", None))
        values = [
            getattr(transaction, "description", None),
            getattr(transaction, "merchant", None),
            getattr(transaction, "transaction_type", None),
        ]

    values.extend(raw_json.get(field) for field in SIMILARITY_RAW_JSON_FIELDS)
    return " ".join(str(value) for value in values if value)


def extract_similarity_tokens(text: str) -> set[str]:
    normalized = _normalize_similarity_text(text)
    tokens = set()

    for keyword in SIMILARITY_KNOWN_KEYWORDS:
        normalized_keyword = _normalize_similarity_text(keyword)
        if normalized_keyword and normalized_keyword in normalized:
            tokens.add(normalized_keyword)

    for match in re.finditer(r"[a-z]+[a-z0-9]*|\d+[a-z]+", normalized):
        token = match.group(0)
        if len(token) >= 3:
            tokens.add(token)

    for match in re.finditer(r"[\u4e00-\u9fff]{2,}", normalized):
        segment = match.group(0)
        max_size = min(6, len(segment))
        for size in range(2, max_size + 1):
            for start in range(0, len(segment) - size + 1):
                token = segment[start : start + size]
                if token not in SIMILARITY_WEAK_KEYWORDS:
                    tokens.add(token)

    return {token for token in tokens if token not in SIMILARITY_IGNORED_KEYWORDS}


def calculate_similarity_score(source_tokens: set[str], candidate_tokens: set[str]) -> float:
    if not source_tokens or not candidate_tokens:
        return 0.0

    source_effective = {token for token in source_tokens if token not in SIMILARITY_WEAK_KEYWORDS}
    candidate_effective = {token for token in candidate_tokens if token not in SIMILARITY_WEAK_KEYWORDS}
    if not source_effective or not candidate_effective:
        return 0.0

    overlap = source_effective & candidate_effective
    if not overlap:
        return 0.0

    weighted_overlap = sum(_similarity_token_weight(token) for token in overlap)
    source_weight = sum(_similarity_token_weight(token) for token in source_effective)
    candidate_weight = sum(_similarity_token_weight(token) for token in candidate_effective)
    return weighted_overlap / min(source_weight, candidate_weight)


def is_similar_transaction(source_transaction, candidate_transaction) -> bool:
    return explain_similarity_match(source_transaction, candidate_transaction)["matched"]


def explain_similarity_match(source_transaction, candidate_transaction) -> dict:
    source_tokens = extract_similarity_tokens(build_similarity_searchable_text(source_transaction))
    candidate_tokens = extract_similarity_tokens(build_similarity_searchable_text(candidate_transaction))
    if not source_tokens or not candidate_tokens:
        return {
            "matched": False,
            "reason": "missing_tokens",
            "sourceTokens": source_tokens,
            "candidateTokens": candidate_tokens,
            "overlapTokens": set(),
            "score": 0.0,
            "strongOverlap": set(),
            "categoryOverlap": set(),
            "effectiveOverlap": set(),
        }

    overlap = source_tokens & candidate_tokens
    strong_overlap = overlap & SIMILARITY_STRONG_KEYWORDS
    category_overlap = overlap & SIMILARITY_CATEGORY_KEYWORDS
    effective_overlap = overlap - SIMILARITY_WEAK_KEYWORDS
    score = calculate_similarity_score(source_tokens, candidate_tokens)

    if strong_overlap and category_overlap:
        matched = True
        reason = "strong_and_category_overlap"
    elif len(effective_overlap) >= 3:
        matched = True
        reason = "effective_overlap_count"
    elif score >= SIMILARITY_MIN_OVERLAP_SCORE:
        matched = True
        reason = "overlap_score"
    elif not strong_overlap:
        matched = False
        reason = "missing_strong_keyword"
    elif not category_overlap:
        matched = False
        reason = "missing_category_keyword"
    else:
        matched = False
        reason = "below_overlap_threshold"

    return {
        "matched": matched,
        "reason": reason,
        "sourceTokens": source_tokens,
        "candidateTokens": candidate_tokens,
        "overlapTokens": overlap,
        "score": score,
        "strongOverlap": strong_overlap,
        "categoryOverlap": category_overlap,
        "effectiveOverlap": effective_overlap,
    }


def _find_existing_enabled_rule(db: Session, merchant_keyword: str | None, description_keyword: str | None) -> CategoryRule | None:
    query = db.query(CategoryRule).filter(CategoryRule.enabled.is_(True))
    if merchant_keyword:
        query = query.filter(CategoryRule.merchant_keyword == merchant_keyword)
    else:
        query = query.filter(CategoryRule.merchant_keyword.is_(None))
    if description_keyword:
        query = query.filter(CategoryRule.description_keyword == description_keyword)
    else:
        query = query.filter(CategoryRule.description_keyword.is_(None))
    return query.order_by(CategoryRule.updated_at.desc(), CategoryRule.id.desc()).first()


def update_category_rule(db: Session, rule_id: int, payload: CategoryRulePatch) -> dict:
    rule = _get_category_rule(db, rule_id)
    updates = payload.model_dump(exclude_unset=True)

    if "merchantKeyword" in updates:
        rule.merchant_keyword = _clean_optional_text(updates["merchantKeyword"])
    if "descriptionKeyword" in updates:
        rule.description_keyword = _clean_optional_text(updates["descriptionKeyword"])
    if "targetCategory" in updates:
        rule.target_category = _clean_required_text(updates["targetCategory"], "targetCategory")
    if "targetType" in updates:
        rule.target_type = _clean_optional_text(updates["targetType"])
    if "enabled" in updates:
        rule.enabled = bool(updates["enabled"])

    if not rule.merchant_keyword and not rule.description_keyword:
        raise HTTPException(status_code=400, detail="merchantKeyword or descriptionKeyword is required")

    rule.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(rule)
    return category_rule_to_out(rule)


def disable_category_rule(db: Session, rule_id: int) -> dict:
    rule = _get_category_rule(db, rule_id)
    rule.enabled = False
    rule.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(rule)
    return category_rule_to_out(rule)


def _get_category_rule(db: Session, rule_id: int) -> CategoryRule:
    rule = db.get(CategoryRule, rule_id)
    if rule is None:
        raise HTTPException(status_code=404, detail="category rule not found")
    return rule


def _coerce_rule_model(db: Session, rule: CategoryRule | dict) -> CategoryRule | None:
    if isinstance(rule, CategoryRule):
        return rule
    rule_id = rule.get("id") if isinstance(rule, dict) else None
    if not rule_id:
        return None
    return db.get(CategoryRule, rule_id)


def _transaction_to_match_dict(transaction: Transaction, raw_json: dict | None = None) -> dict:
    raw_json = raw_json or _raw_json_to_dict(transaction.raw_json)
    return {
        "merchant": transaction.merchant,
        "description": transaction.description,
        "transactionType": transaction.transaction_type,
        "transaction_type": transaction.transaction_type,
        "rawMerchant": raw_json.get("merchant"),
        "rawDescription": raw_json.get("description"),
        "rawTransactionType": raw_json.get("transactionType"),
        "raw_transaction_type": raw_json.get("transaction_type"),
        "rawType": raw_json.get("rawType"),
        "originalType": raw_json.get("originalType"),
        "productName": raw_json.get("productName"),
        "goodsName": raw_json.get("goodsName"),
        "counterparty": raw_json.get("counterparty"),
        "itemName": raw_json.get("itemName"),
        "goodsTitle": raw_json.get("goodsTitle"),
        "title": raw_json.get("title"),
        "product": raw_json.get("product"),
        "memo": raw_json.get("memo"),
        "remark": raw_json.get("remark"),
        "note": raw_json.get("note"),
        "商品名称": raw_json.get("商品名称"),
        "商品说明": raw_json.get("商品说明"),
        "交易说明": raw_json.get("交易说明"),
        "交易对象": raw_json.get("交易对象"),
        "对方账户": raw_json.get("对方账户"),
        "收款方": raw_json.get("收款方"),
        "付款方": raw_json.get("付款方"),
    }


def _raw_json_to_dict(raw_json: str | None) -> dict:
    try:
        data = json.loads(raw_json or "{}")
        if not isinstance(data, dict):
            data = {}
    except Exception:
        data = {}
    return data


def _transaction_raw_json(transaction) -> dict:
    if isinstance(transaction, dict):
        raw_json = transaction.get("raw_json")
        if isinstance(raw_json, dict):
            return raw_json
        if isinstance(raw_json, str):
            return _raw_json_to_dict(raw_json)
        return {}
    return _raw_json_to_dict(getattr(transaction, "raw_json", None))


def _transaction_field_value(transaction, object_field: str, dict_field: str):
    if isinstance(transaction, dict):
        return transaction.get(dict_field) or transaction.get(object_field)
    return getattr(transaction, object_field, None)


def _rule_field_value(rule, object_field: str, dict_field: str):
    if isinstance(rule, dict):
        return rule.get(dict_field) or rule.get(object_field)
    return getattr(rule, object_field, None)


def _rule_target_semantic_type(rule) -> str:
    target_text = _normalize_match_text(
        " ".join(
            str(value or "")
            for value in [
                _rule_field_value(rule, "target_type", "targetType"),
                _rule_field_value(rule, "target_category", "targetCategory"),
            ]
        )
    )
    if _contains_any(target_text, SEMANTIC_TRANSFER_KEYWORDS):
        return "transfer"
    if _contains_any(target_text, SEMANTIC_REFUND_KEYWORDS) or "退款" in target_text:
        return "refund"
    if _contains_any(target_text, SEMANTIC_EXCLUDED_KEYWORDS) or "不计收支" in target_text or "排除" in target_text:
        return "excluded"
    if "收入" in target_text:
        return "income"
    if "支出" in target_text:
        return "expense"
    return "unknown"


def _build_transaction_semantic_text(transaction, raw_json: dict | None = None) -> str:
    raw_json = raw_json or _transaction_raw_json(transaction)
    if isinstance(transaction, dict):
        values = [
            transaction.get("description"),
            transaction.get("merchant"),
            transaction.get("transactionType"),
            transaction.get("transaction_type"),
            transaction.get("type"),
            transaction.get("category"),
            transaction.get("platform"),
            transaction.get("sourcePlatform"),
        ]
    else:
        values = [
            getattr(transaction, "description", None),
            getattr(transaction, "merchant", None),
            getattr(transaction, "transaction_type", None),
            getattr(transaction, "type", None),
            getattr(transaction, "category", None),
            getattr(transaction, "platform", None),
            getattr(transaction, "source_platform", None),
        ]
    values.extend(raw_json.get(field) for field in SEMANTIC_RAW_JSON_FIELDS)
    return " ".join(str(value) for value in values if value)


def _merge_rule_metadata(raw_json: dict, rule: CategoryRule) -> str:
    data = dict(raw_json or {})
    data["category"] = rule.target_category
    if rule.target_type:
        data["type"] = rule.target_type
    data["categoryRuleId"] = rule.id
    data["categoryRuleMatched"] = True
    return json.dumps(data, ensure_ascii=False)


def _is_manual_other_override(transaction: Transaction, raw_json: dict) -> bool:
    return bool(raw_json.get("categoryManualOverride") and transaction.category == "其他")


def _merge_rule_marker(raw_json: str | None, rule_id: int) -> str:
    data = _raw_json_to_dict(raw_json)
    data["categoryRuleId"] = rule_id
    data["categoryRuleMatched"] = True
    return json.dumps(data, ensure_ascii=False)


def _rule_matches_transaction(rule: CategoryRule, transaction: dict) -> bool:
    merchant_keyword = _clean_optional_text(rule.merchant_keyword)
    description_keyword = _clean_optional_text(rule.description_keyword)
    return _keywords_match_transaction(merchant_keyword, description_keyword, transaction)


def _keywords_match_transaction(merchant_keyword: str | None, description_keyword: str | None, transaction: dict) -> bool:
    merchant = _normalize_match_text(transaction.get("merchant"))
    description = _normalize_match_text(transaction.get("description"))
    searchable_text = _normalize_match_text(
        " ".join(
            str(transaction.get(field) or "")
            for field in [
                "merchant",
                "description",
                "transactionType",
                "transaction_type",
                "rawMerchant",
                "rawDescription",
                "rawTransactionType",
                "raw_transaction_type",
                "rawType",
                "originalType",
                "productName",
                "goodsName",
                "counterparty",
                "itemName",
                "goodsTitle",
                "title",
                "product",
                "memo",
                "remark",
                "note",
                "商品名称",
                "商品说明",
                "交易说明",
                "交易对象",
                "对方账户",
                "收款方",
                "付款方",
            ]
        )
    )

    if _is_yield_related_text(f"{merchant_keyword or ''} {description_keyword or ''}") and _is_yield_related_text(searchable_text):
        return True

    merchant_matched = True
    description_matched = True
    if merchant_keyword:
        merchant_matched = _normalize_match_text(merchant_keyword) in merchant or _normalize_match_text(merchant_keyword) in searchable_text
    if description_keyword:
        description_matched = _normalize_match_text(description_keyword) in description or _normalize_match_text(description_keyword) in searchable_text

    return merchant_matched and description_matched


def _derive_rule_keywords(transaction) -> tuple[str | None, str | None]:
    merchant = _clean_optional_text(getattr(transaction, "merchant", None))
    description = _clean_optional_text(getattr(transaction, "description", None))
    combined = _normalize_match_text(f"{merchant or ''} {description or ''}")

    reusable_keyword = _find_reusable_keyword(combined)
    if reusable_keyword:
        return reusable_keyword, None

    if merchant and not _is_generic_merchant(merchant):
        return merchant, None

    if description:
        return None, description

    return merchant, None


def _find_reusable_keyword(value: str) -> str | None:
    for keyword in REUSABLE_KEYWORDS:
        if _normalize_match_text(keyword) in value:
            return keyword
    return None


def _is_yield_related_text(value: str) -> bool:
    normalized = _normalize_match_text(value)
    return any(_normalize_match_text(keyword) in normalized for keyword in YIELD_KEYWORDS)


def _is_generic_merchant(value: str) -> bool:
    normalized = _normalize_match_text(value)
    return any(_normalize_match_text(keyword) == normalized for keyword in GENERIC_MERCHANT_KEYWORDS)


def _normalize_match_text(value) -> str:
    return str(value or "").strip().casefold()


def _contains_any(value: str, keywords: set[str]) -> bool:
    return any(_normalize_match_text(keyword) in value for keyword in keywords)


def _normalize_similarity_text(value) -> str:
    return re.sub(r"[^0-9a-z\u4e00-\u9fff]+", "", str(value or "").casefold())


def _similarity_token_weight(token: str) -> float:
    if token in SIMILARITY_STRONG_KEYWORDS:
        return 3.0
    if token in SIMILARITY_CATEGORY_KEYWORDS:
        return 2.0
    if token in SIMILARITY_WEAK_KEYWORDS:
        return 0.25
    if re.search(r"[a-z]", token) and re.search(r"\d", token):
        return 3.0
    if re.search(r"[a-z]", token):
        return 2.0
    if len(token) >= 4:
        return 1.5
    return 1.0


def _clean_optional_text(value) -> str | None:
    text = str(value or "").strip()
    return text or None


def _clean_required_text(value, field_name: str) -> str:
    text = _clean_optional_text(value)
    if not text:
        raise HTTPException(status_code=400, detail=f"{field_name} is required")
    return text


def _format_datetime(value: datetime | None) -> str | None:
    if value is None:
        return None
    return value.isoformat()
