from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from db.models import EmergencyBill, Pool, TrustLog
from paypal.mock_client import MockPayPalClient

router = APIRouter()
paypal = MockPayPalClient()

@router.post("/{bill_id}/approve")
def approve_bill(bill_id: int, session: Session = Depends(get_session)):
    # 1. Database mein pending bill dhundo
    bill = session.exec(select(EmergencyBill).where(EmergencyBill.id == bill_id)).first()
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
        
    if bill.status != "PENDING_APPROVAL":
        raise HTTPException(status_code=400, detail="Bill is not pending approval")

    # 2. Pool check karo (Kill Switch aur Reserve Floor)
    pool = session.exec(select(Pool)).first()
    if not pool or pool.agent_status == "PAUSED":
        raise HTTPException(status_code=403, detail="Pool is paused. Cannot approve.")
        
    if (pool.balance - bill.amount) < pool.reserve_floor:
        raise HTTPException(status_code=400, detail="Approving this bill would breach the reserve floor.")

    # 3. PayPal se paise transfer karo (Mock)
    order = paypal.create_order(bill.amount)
    auth = paypal.authorize_order(order["order_id"])
    paypal.capture_authorization(auth["authorization_id"])
    
    # 4. Balance kam karo aur bill ko PAID mark karo
    pool.balance -= bill.amount
    bill.status = "PAID"
    
    # 5. Trust Log mein entry karo ke human ne approve kiya
    log = TrustLog(
        actor="Human Approver", 
        action=f"Approved Bill: {bill.vendor}", 
        amount=bill.amount, 
        reason="Manual human approval override"
    )
    
    session.add(pool)
    session.add(bill)
    session.add(log)
    session.commit()
    
    return {
        "status": "PAID", 
        "message": f"Successfully paid ${bill.amount} to {bill.vendor}",
        "new_balance": pool.balance
    }