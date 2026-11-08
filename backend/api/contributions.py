from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from db.session import get_session
from db.models import Pool, TrustLog
from paypal.mock_client import MockPayPalClient
import traceback

router = APIRouter()
paypal = MockPayPalClient()

class ContributionRequest(BaseModel):
    member_name: str
    amount: float

class CaptureRequest(BaseModel):
    order_id: str
    amount: float
    member_name: str

@router.post("/order")
def create_contribution_order(req: ContributionRequest):
    order = paypal.create_order(req.amount)
    return order

@router.post("/capture")
def capture_contribution(req: CaptureRequest, session: Session = Depends(get_session)):
    try:
        auth = paypal.authorize_order(req.order_id)
        if "error" in auth:
            raise HTTPException(status_code=400, detail="Order failed")
            
        capture = paypal.capture_authorization(auth["authorization_id"])
        
        pool = session.exec(select(Pool)).first()
        if not pool:
            raise HTTPException(status_code=404, detail="Pool not found")
            
        pool.balance += req.amount
        
        log = TrustLog(
            actor=req.member_name,
            action="Contribution Captured",
            amount=req.amount,
            reason="Monthly family fund contribution"
        )
        session.add(log)
        session.add(pool)
        session.commit()
        session.refresh(pool)
        
        return {"status": "success", "new_balance": pool.balance}
        
    except Exception as e:
        print("ERROR IN CAPTURE:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))