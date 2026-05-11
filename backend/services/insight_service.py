from schemas import InsightCard, InsightGenerateRequest, InsightGenerateResponse


PRIVACY_NOTE = "当前小结基于脱敏统计摘要生成，未使用完整账单明细。"


def _money(value: float) -> str:
    return f"¥{float(value or 0):,.2f}"


def _ratio_text(value: float | None) -> str:
    if value is None:
        return ""
    ratio = float(value)
    if ratio <= 1:
        ratio *= 100
    return f"{ratio:.0f}%"


def generate_local_insight_cards(payload: InsightGenerateRequest) -> InsightGenerateResponse:
    """Generate review cards from anonymized aggregate stats only.

    This service does not call external models, read API keys, or receive raw
    transactions, merchant names, descriptions, order ids, card numbers, names,
    raw_json, or full transaction timestamps.
    """
    if payload.transactionCount <= 0:
        return InsightGenerateResponse(
            cards=[
                InsightCard(
                    title="等待账单数据",
                    text="上传并选择账单后，这里会生成本月消费复盘。",
                    tone="neutral",
                )
            ],
            privacyNote=PRIVACY_NOTE,
        )

    cards: list[InsightCard] = []
    top_category = payload.topCategories[0] if payload.topCategories else None
    top_platform = payload.topPlatforms[0] if payload.topPlatforms else None

    if top_category:
        ratio = _ratio_text(top_category.ratio)
        ratio_part = f"，占净支出的 {ratio}" if ratio else ""
        cards.append(
            InsightCard(
                title="主要支出",
                text=f"本月主要支出集中在{top_category.name}{ratio_part}。",
                tone="neutral",
            )
        )
    else:
        cards.append(
            InsightCard(
                title="主要支出",
                text="当前账单范围内还没有明显的支出分类分布。",
                tone="neutral",
            )
        )

    if top_platform:
        cards.append(
            InsightCard(
                title="平台观察",
                text=f"本月{top_platform.name}是主要记录平台，贡献了 {_money(top_platform.amount)} 净支出。",
                tone="neutral",
            )
        )

    if payload.refundCount > 0 or payload.refundOffset > 0:
        cards.append(
            InsightCard(
                title="退款情况",
                text=f"本月已识别退款抵扣 {_money(payload.refundOffset)}，已从真实支出中扣除。",
                tone="positive",
            )
        )
    else:
        cards.append(
            InsightCard(
                title="退款情况",
                text="本月没有明显退款抵扣记录，退款仍不会被计入收入。",
                tone="neutral",
            )
        )

    daily_peak = payload.dailyPeak or {}
    peak_amount = float(daily_peak.get("amount") or 0) if isinstance(daily_peak, dict) else 0
    peak_label = daily_peak.get("day") if isinstance(daily_peak, dict) else None
    if peak_amount > 0 and peak_label:
        rhythm_text = payload.spendingRhythm or "可以在明细页回看当天的具体交易。"
        cards.append(
            InsightCard(
                title="消费节奏",
                text=f"本月单日净支出最高出现在 {peak_label}，为 {_money(peak_amount)}。{rhythm_text}",
                tone="neutral",
            )
        )
    elif payload.transactionCount > 0:
        cards.append(
            InsightCard(
                title="消费节奏",
                text=f"当前视图内共有 {payload.transactionCount} 笔流水，可结合明细页查看消费集中时段。",
                tone="neutral",
            )
        )

    return InsightGenerateResponse(
        cards=cards[:4],
        privacyNote=PRIVACY_NOTE,
    )
