from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from db.session import get_session
from db.models import Pool, TrustLog
from paypal.mock_client import MockPayPalClient

router = APIRouter()
paypal = MockPayPalClient()

class LoanRequest(BaseModel):
    borrower_name: str
    amount: float
    months: int

@router.post("/request")
def request_loan(req: LoanRequest, session: Session = Depends(get_session)):
    pool = session.exec(select(Pool)).first()
    if not pool or pool.agent_status == "PAUSED":
        raise HTTPException(status_code=403, detail="Pool is paused or not found")

    if (pool.balance - req.amount) < pool.reserve_floor:
        raise HTTPException(status_code=400, detail="Cannot lend. Reserve floor breach.")

    # Mock PayPal Payout (Paise udhaar dena)
    order = paypal.create_order(req.amount)
    paypal.authorize_order(order["order_id"])
    
    # Pool balance kam karo
    pool.balance -= req.amount
    
    # Monthly installment calculate karo
    monthly_amount = req.amount / req.months
    
    log = TrustLog(
        actor="Steward AI", 
        action=f"Loan Disbursed to {req.borrower_name}", 
        amount=req.amount, 
        reason=f"Loan for {req.months} months. Installment: ${monthly_amount:.2f}"
    )
    
    session.add(pool)
    session.add(log)
    session.commit()
    
    return {
        "status": "LOAN_DISBURSED", 
        "borrower": req.borrower_name,
        "monthly_installment": round(monthly_amount, 2),
        "remaining_pool_balance": pool.balance
    }