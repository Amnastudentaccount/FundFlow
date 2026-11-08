from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.session import get_session
from db.models import Pool, TrustLog, Mandate

router = APIRouter()

@router.post("/pause")
def pause_agent(session: Session = Depends(get_session)):
    pool = session.exec(select(Pool)).first()
    pool.agent_status = "PAUSED"
    
    # Saare mandates cancel kar do
    mandates = session.exec(select(Mandate).where(Mandate.status == "ACTIVE")).all()
    for m in mandates:
        m.status = "REVOKED"
        session.add(m)
        
    log = TrustLog(actor="Ayesha", action="KILL SWITCH ACTIVATED", rule_used="Manual Override", reason="User paused AI")
    session.add(pool)
    session.add(log)
    session.commit()
    return {"status": "PAUSED", "voided": len(mandates)}

@router.post("/resume")
def resume_agent(session: Session = Depends(get_session)):
    pool = session.exec(select(Pool)).first()
    pool.agent_status = "ACTIVE"
    session.add(pool)
    session.commit()
    return {"status": "ACTIVE"}