import uuid
from datetime import datetime

class MockPayPalClient:
    def __init__(self):
        self.orders = {} 
        self.auths = {}

    def create_order(self, amount: float, currency: str = "GBP") -> dict:
        order_id = f"MOCK-ORD-{uuid.uuid4().hex[:6].upper()}"
        self.orders[order_id] = {"amount": amount, "status": "CREATED"}
        return {"order_id": order_id, "status": "CREATED"}

    def authorize_order(self, order_id: str) -> dict:
        if order_id in self.orders:
            auth_id = f"MOCK-AUTH-{uuid.uuid4().hex[:6].upper()}"
            self.auths[auth_id] = {"order_id": order_id, "status": "AUTHORIZED"}
            self.orders[order_id]["status"] = "AUTHORIZED"
            return {"authorization_id": auth_id, "status": "AUTHORIZED"}
        return {"error": "Order not found"}

    def capture_authorization(self, auth_id: str) -> dict:
        if auth_id in self.auths:
            self.auths[auth_id]["status"] = "CAPTURED"
            return {"capture_id": f"MOCK-CAP-{uuid.uuid4().hex[:6].upper()}", "status": "CAPTURED"}
        return {"error": "Auth not found"}

    def void_authorization(self, auth_id: str) -> dict:
        if auth_id in self.auths:
            self.auths[auth_id]["status"] = "VOIDED"
            return {"status": "VOIDED"}
        return {"error": "Auth not found"}