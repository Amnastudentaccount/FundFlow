from sqlmodel import Session, select
from db.models import Pool

def check_policy(session: Session, amount: float) -> tuple[bool, str]:
    pool = session.exec(select(Pool)).first()
    if not pool:
        return False, "Pool not found"
        
    if pool.agent_status == "PAUSED":
        return False, "Kill Switch is active. All payments paused."
        
    if (pool.balance - amount) < pool.reserve_floor:
        return False, f"Payment blocked. Would breach reserve floor of {pool.reserve_floor}."
        
    return True, "Allowed"