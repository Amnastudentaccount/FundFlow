from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from db.session import get_session
from db.models import Pool, TrustLog, EmergencyBill, Mandate
from policy.engine import check_policy
from paypal.mock_client import MockPayPalClient

router = APIRouter()
paypal = MockPayPalClient()

class BillScanRequest(BaseModel):
    vendor: str
    amount: float

@router.post("/scan")
def scan_and_pay_bill(req: BillScanRequest, session: Session = Depends(get_session)):
    # 1. Policy Engine Check (Rules)
    allowed, reason = check_policy(session, req.amount)
    if not allowed:
        raise HTTPException(status_code=403, detail=reason)
        
    # 2. Auto-Pay Limit Rule
    if req.amount > 150.0:
        bill = EmergencyBill(vendor=req.vendor, amount=req.amount, status="PENDING_APPROVAL")
        session.add(bill)
        session.commit()
        return {"status": "PENDING_APPROVAL", "message": "Bill > $150 requires manual approval."}
        
    # 3. Auto-Pay execution (Mock)
    order = paypal.create_order(req.amount)
    auth = paypal.authorize_order(order["order_id"])
    paypal.capture_authorization(auth["authorization_id"])
    
    # 4. DB Update
    pool = session.exec(select(Pool)).first()
    pool.balance -= req.amount
    
    bill = EmergencyBill(vendor=req.vendor, amount=req.amount, status="PAID")
    log = TrustLog(actor="Steward AI", action="Emergency Payout", amount=req.amount, rule_used="Medical < $150", reason=f"Paid {req.vendor}")
    
    session.add(pool)
    session.add(bill)
    session.add(log)
    session.commit()
    
    return {"status": "PAID", "new_balance": pool.balance}