import base64

from fastapi import APIRouter, Depends, File, UploadFile
from sqlmodel import Session

from ai.bill_reader import extract_bill_data
from ai.steward import generate_reasoning
from db.models import TrustLog
from db.session import get_session

router = APIRouter()


@router.post("/scan")
async def scan_bill(file: UploadFile = File(...), session: Session = Depends(get_session)):
    image_bytes = await file.read()
    image_base64 = base64.b64encode(image_bytes).decode("ascii")
    result = await extract_bill_data(image_base64)
    if result:
        amount = result.get("amount", result.get("extracted_amount", 0))
        reason = await generate_reasoning("Bill Scanned", result)
        session.add(TrustLog(
            actor="Steward AI",
            action="Emergency Bill Scanned",
            amount=amount,
            rule_used="Medical Auto-Scan",
            reason=reason,
        ))
        session.commit()
    return result
