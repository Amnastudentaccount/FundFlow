from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.session import get_session
from db.models import TrustLog
from typing import List

router = APIRouter()

@router.get("/")
def get_trust_log(session: Session = Depends(get_session)):
    # Latest logs sabse upar dikhane ke liye desc order mein fetch karo
    logs = session.exec(select(TrustLog).order_by(TrustLog.time.desc()).limit(50)).all()
    return logs