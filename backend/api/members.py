from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from db.session import get_session
from db.models import Member

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    name: Optional[str] = None


class InviteRequest(BaseModel):
    name: str
    email: str
    role: str


class PayPalConnectRequest(BaseModel):
    member_name: str


@router.post("/connect-paypal")
def connect_paypal(request: PayPalConnectRequest):
    return {"status": "success", "paypal_email": "mock_user@paypal.com"}


@router.post("/login")
def login_member(request: LoginRequest, session: Session = Depends(get_session)):
    member = session.exec(select(Member).where(Member.paypal_email == request.email)).first()
    if member is None:
        if not request.name:
            raise HTTPException(status_code=404, detail="Member not found")
        member = Member(name=request.name, role="OWNER", paypal_email=request.email)
        session.add(member)
        session.commit()
        session.refresh(member)

    return {
        "id": member.id,
        "name": member.name,
        "email": member.paypal_email,
        "role": member.role,
    }


@router.post("/invite")
def invite_member(request: InviteRequest, session: Session = Depends(get_session)):
    member = Member(name=request.name, paypal_email=request.email, role=request.role)
    session.add(member)
    session.commit()
    session.refresh(member)
    return member


@router.get("/")
def get_members(session: Session = Depends(get_session)):
    members = session.exec(select(Member)).all()
    return [
        {
            "id": member.id,
            "name": member.name,
            "role": member.role,
            "paypal_email": member.paypal_email,
        }
        for member in members
    ]


@router.delete("/{member_id}")
def delete_member(member_id: int, session: Session = Depends(get_session)):
    member = session.get(Member, member_id)
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")

    session.delete(member)
    session.commit()
    return {"status": "success", "message": "Member deleted"}
