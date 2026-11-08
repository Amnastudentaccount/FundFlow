import os
from sqlmodel import create_engine, Session

# Docker ke andar DATABASE_URL env variable set hai, local ke liye fallback rakha hai
# Naya psycopg v3 use karne ke liye URL aisa hoga
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://fundflow:fundflow@localhost:5432/fundflow")
# Engine create karo
engine = create_engine(DATABASE_URL, echo=False)

# Dependency function for FastAPI routes
def get_session():
    with Session(engine) as session:
        yield session