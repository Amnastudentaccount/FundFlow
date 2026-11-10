import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, delete, select

# Database & Models
from db.session import engine, get_session
from db.seed import seed_db
from db.models import Pool, Mandate, TrustLog

# Routers
from api.contributions import router as contrib_router
from api.killswitch import router as kill_router
from api.emergency import router as emergency_router
from api.trustlog import router as trustlog_router
from api.loans import router as loans_router
from api.approvals import router as approvals_router
from api.members import router as members_router
from api.smartbuy import router as smartbuy_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    seed_db()
    yield

app = FastAPI(title="FundFlow Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers add karo
app.include_router(contrib_router, prefix="/api/contributions")
app.include_router(kill_router, prefix="/api/killswitch")
app.include_router(emergency_router, prefix="/api/emergency")
app.include_router(trustlog_router, prefix="/api/trustlog")
app.include_router(loans_router, prefix="/api/loans")
app.include_router(approvals_router, prefix="/api/approvals")
app.include_router(members_router, prefix="/api/members")
app.include_router(smartbuy_router, prefix="/api/smartbuy")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/pool")
def get_pool(session: Session = Depends(get_session)):
    pool = session.exec(select(Pool)).first()
    if pool:
        return {
            "balance": pool.balance, 
            "reserve_floor": pool.reserve_floor, 
            "agent_status": pool.agent_status
        }
    return {"error": "Pool not found"}


@app.post("/api/pool/reset")
def reset_pool(session: Session = Depends(get_session)):
    pool = session.exec(select(Pool)).first()
    if pool is None:
        pool = Pool(balance=0.0)
    else:
        pool.balance = 0.0
    session.add(pool)
    session.exec(delete(TrustLog))
    session.commit()
    session.refresh(pool)
    return {"status": "success", "balance": pool.balance}

# Test route (Frontend mount se PEHLE hona zaroori hai)
@app.post("/api/test/create-mandate")
def create_test_mandate(session: Session = Depends(get_session)):
    mandate = Mandate(max_amount=280.0, seller="TechHub", status="ACTIVE")
    session.add(mandate)
    session.commit()
    return {"status": "Mandate Created", "id": mandate.id}

# Frontend serve karne ke liye (Yeh sabse aakhri mein aayega)
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
