from typing import Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class Member(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str
    paypal_email: str

class Pool(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = "Rahman Family Fund"
    balance: float = 2184.50
    reserve_floor: float = 500.0
    agent_status: str = "ACTIVE"

class Approval(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: str
    member_id: int
    status: str = "PENDING"

class TrustLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    actor: str
    action: str
    amount: float = 0.0
    rule_used: str = ""
    reason: str = ""

# Naye Tables AI aur Kill Switch ke liye
class Mandate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    max_amount: float
    seller: str
    status: str = "ACTIVE" # ACTIVE, REVOKED, USED

class EmergencyBill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vendor: str
    amount: float
    status: str = "PENDING" # PENDING, PAID, REJECTED