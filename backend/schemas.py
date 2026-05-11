from typing import Dict, List, Optional

from pydantic import BaseModel


class TransactionOut(BaseModel):
    id: str
    time: Optional[str] = None
    sourcePlatform: Optional[str] = None
    platform: Optional[str] = None
    merchant: Optional[str] = None
    description: Optional[str] = None
    transactionType: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    raw_json: Optional[str] = None
    categoryManualOverride: bool = False


class TransactionPatch(BaseModel):
    merchant: Optional[str] = None
    description: Optional[str] = None
    transactionType: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    categoryManualOverride: bool = False
    saveAsRule: bool = False


class ApplySimilarTransactionRequest(BaseModel):
    category: str
    type: str
    saveAsRule: bool = False


class CategoryRuleCreate(BaseModel):
    merchantKeyword: Optional[str] = None
    descriptionKeyword: Optional[str] = None
    targetCategory: str
    targetType: Optional[str] = None
    createdFromTransactionId: Optional[str] = None


class CategoryRulePatch(BaseModel):
    merchantKeyword: Optional[str] = None
    descriptionKeyword: Optional[str] = None
    targetCategory: Optional[str] = None
    targetType: Optional[str] = None
    enabled: Optional[bool] = None


class InsightTopItem(BaseModel):
    name: str
    amount: float
    ratio: Optional[float] = None


class InsightGenerateRequest(BaseModel):
    month: Optional[str] = None
    totalExpense: float = 0
    totalIncome: float = 0
    refundOffset: float = 0
    transactionCount: int = 0
    expenseCount: int = 0
    refundCount: int = 0
    topCategories: List[InsightTopItem] = []
    topPlatforms: List[InsightTopItem] = []
    dailyPeak: Optional[Dict[str, object]] = None
    spendingRhythm: Optional[str] = None
    unmatchedRefundCount: int = 0


class InsightCard(BaseModel):
    title: str
    text: str
    tone: str = "neutral"


class InsightGenerateResponse(BaseModel):
    provider: str = "local-rule"
    cards: List[InsightCard]
    fallbackUsed: bool = True
    privacyNote: str
