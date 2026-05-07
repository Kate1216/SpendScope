from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from parsers.alipay_pdf import parse_alipay_pdf


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "spendscope-backend",
    }


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
