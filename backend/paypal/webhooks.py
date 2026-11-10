from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/paypal")
async def paypal_webhook(request: Request):
    """
    In production, this verifies the PayPal webhook signature 
    and updates the database on PAYMENT.CAPTURE.COMPLETED events.
    """
    body = await request.json()
    # TODO: Verify signature using PAYPAL_WEBHOOK_ID
    return {"status": "received", "event": body.get("event_type")}