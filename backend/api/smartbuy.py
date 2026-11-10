from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from db.models import TrustLog
from db.session import get_session
from ai.steward import generate_reasoning
from services.channel3 import search_products

router = APIRouter()


class ProductSearchRequest(BaseModel):
    query: str


@router.post("/search")
async def search_smartbuy_products(request: ProductSearchRequest, session: Session = Depends(get_session)):
    result = await search_products(request.query)
    if result:
        reason = await generate_reasoning(
            "Product Search",
            {"query": request.query, "result_count": len(result)},
        )
        session.add(TrustLog(
            actor="Steward AI",
            action="Product Search",
            amount=0,
            rule_used="Channel3 API",
            reason=reason,
        ))
        session.commit()
    return result
