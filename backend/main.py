from typing import List

from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

import models
from database import Base, SessionLocal, engine
from parsers.alipay_pdf import parse_alipay_pdf
from schemas import ApplySimilarTransactionRequest, CategoryRuleCreate, CategoryRulePatch, InsightGenerateRequest, TransactionPatch
from services.bill_upload_service import process_bill_uploads
from services.category_rule_service import apply_category_rules, create_category_rule, disable_category_rule, list_category_rules, update_category_rule
from services.insight_service import generate_local_insight_cards
from services.transaction_service import apply_similar_transaction_update, list_bills, list_transactions, save_uploaded_transactions, update_transaction


Base.metadata.create_all(bind=engine)

app = FastAPI(openapi_version="3.0.3")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    upload_schema = (
        openapi_schema.get("components", {})
        .get("schemas", {})
        .get("Body_upload_bills_api_bills_upload_post", {})
        .get("properties", {})
        .get("files", {})
    )
    upload_items = upload_schema.get("items")
    if isinstance(upload_items, dict) and upload_items.get("contentMediaType") == "application/octet-stream":
        upload_items.pop("contentMediaType", None)
        upload_items["format"] = "binary"

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "spendscope-backend",
    }


@app.get("/api/transactions")
def get_transactions(month: str | None = None, platform: str | None = None, db: Session = Depends(get_db)):
    return {
        "ok": True,
        "transactions": list_transactions(db, month=month, platform=platform),
    }


@app.get("/api/bills")
def get_bills(month: str | None = None, platform: str | None = None, db: Session = Depends(get_db)):
    return {
        "ok": True,
        "bills": list_bills(db, month=month, platform=platform),
    }


@app.get("/api/category-rules")
def get_category_rules(db: Session = Depends(get_db)):
    return {
        "ok": True,
        "rules": list_category_rules(db),
    }


@app.post("/api/insights/generate")
def generate_insights(payload: InsightGenerateRequest):
    return generate_local_insight_cards(payload)


@app.post("/api/category-rules")
def post_category_rule(payload: CategoryRuleCreate, db: Session = Depends(get_db)):
    return {
        "ok": True,
        "rule": create_category_rule(db, payload),
    }


@app.patch("/api/category-rules/{rule_id}")
def patch_category_rule(rule_id: int, payload: CategoryRulePatch, db: Session = Depends(get_db)):
    return {
        "ok": True,
        "rule": update_category_rule(db, rule_id, payload),
    }


@app.delete("/api/category-rules/{rule_id}")
def delete_category_rule(rule_id: int, db: Session = Depends(get_db)):
    return {
        "ok": True,
        "rule": disable_category_rule(db, rule_id),
    }


@app.patch("/api/transactions/{transaction_id}")
def patch_transaction(transaction_id: str, patch: TransactionPatch, db: Session = Depends(get_db)):
    result = update_transaction(db, transaction_id, patch)
    return {
        "ok": True,
        "transaction": result["transaction"],
        "categoryRule": result.get("categoryRule"),
        "categoryRuleAppliedCount": result.get("categoryRuleAppliedCount", 0),
    }


@app.post("/api/transactions/{transaction_id}/apply-similar")
def apply_similar_transaction(transaction_id: str, payload: ApplySimilarTransactionRequest, db: Session = Depends(get_db)):
    result = apply_similar_transaction_update(
        db,
        source_transaction_id=transaction_id,
        target_category=payload.category,
        target_type=payload.type,
        save_as_rule=payload.saveAsRule,
    )
    return {
        "ok": True,
        "sourceTransaction": result["sourceTransaction"],
        "updatedTransactions": result["updatedTransactions"],
        "appliedCount": result["appliedCount"],
        "categoryRule": result.get("categoryRule"),
        "categoryRuleAppliedCount": result.get("categoryRuleAppliedCount", 0),
    }


@app.post("/api/bills/upload")
async def upload_bills(files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    result = await process_bill_uploads(files)
    parsed_transactions = result.get("transactions", [])
    saved_transactions = []
    cursor = 0

    for file_summary in result.get("files", []):
        count = int(file_summary.get("transactions") or 0)
        file_transactions = parsed_transactions[cursor : cursor + count]
        cursor += count

        if file_summary.get("status") != "parsed" or not file_transactions:
            continue

        file_meta = {
            "filename": file_summary.get("filename") or "",
            "saved_path": file_summary.get("saved_path") or "",
            "platform": file_summary.get("platform") or "",
            "transaction_count": len(file_transactions),
        }
        try:
            file_transactions = apply_category_rules(file_transactions, db)
        except Exception as exc:
            file_summary["categoryRuleError"] = str(exc)
        saved_transactions.extend(save_uploaded_transactions(db, file_transactions, file_meta))

    result["transactions"] = saved_transactions
    return result


@app.post("/api/parse/alipay")
async def parse_alipay(file: UploadFile | None = File(default=None)):
    if file is None:
        return JSONResponse(
            status_code=400,
            content={
                "ok": False,
                "error": "missing file",
            },
        )

    filename = file.filename or ""
    content_type = file.content_type or ""
    is_pdf_name = filename.lower().endswith(".pdf")
    is_pdf_type = "pdf" in content_type.lower()

    if not is_pdf_name or not is_pdf_type:
        return JSONResponse(
            status_code=400,
            content={
                "ok": False,
                "error": "file must be a PDF",
                "filename": filename,
                "contentType": content_type,
            },
        )

    try:
        file_bytes = await file.read()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={
                "ok": False,
                "error": "failed to read uploaded file",
                "filename": filename,
                "contentType": content_type,
            },
        )

    return parse_alipay_pdf(file_bytes)
