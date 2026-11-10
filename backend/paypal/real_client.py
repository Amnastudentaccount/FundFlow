import os
import httpx
import base64
from typing import Optional
from paypal.interface import PayPalClient

class RealPayPalClient(PayPalClient):
    def __init__(self):
        self.client_id = os.getenv("PAYPAL_CLIENT_ID")
        self.client_secret = os.getenv("PAYPAL_CLIENT_SECRET")
        self.base_url = os.getenv("PAYPAL_BASE_URL", "https://api-m.sandbox.paypal.com")
        self._access_token: Optional[str] = None

    def _get_access_token(self):
        if self._access_token: return self._access_token
        auth_str = f"{self.client_id}:{self.client_secret}"
        b64_auth = base64.b64encode(auth_str.encode()).decode()
        headers = {"Authorization": f"Basic {b64_auth}", "Content-Type": "application/x-www-form-urlencoded"}
        with httpx.Client(base_url=self.base_url) as client:
            resp = client.post("/v1/oauth2/token", headers=headers, data={"grant_type": "client_credentials"})
            self._access_token = resp.json()["access_token"]
            return self._access_token

    def create_order(self, amount: float, currency: str = "USD") -> dict:
        token = self._get_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {"intent": "AUTHORIZE", "purchase_units": [{"amount": {"currency_code": currency, "value": f"{amount:.2f}"}}]}
        with httpx.Client(base_url=self.base_url) as client:
            resp = client.post("/v2/checkout/orders", headers=headers, json=payload)
            data = resp.json()
            return {"order_id": data["id"], "status": data["status"]}

    def authorize_order(self, order_id: str) -> dict:
        token = self._get_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        with httpx.Client(base_url=self.base_url) as client:
            resp = client.post(f"/v2/checkout/orders/{order_id}/authorize", headers=headers, json={})
            data = resp.json()
            auth_id = data["purchase_units"][0]["payments"]["authorizations"][0]["id"]
            return {"authorization_id": auth_id, "status": data["status"]}

    def capture_authorization(self, authorization_id: str) -> dict:
        token = self._get_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        with httpx.Client(base_url=self.base_url) as client:
            resp = client.post(f"/v2/payments/authorizations/{authorization_id}/capture", headers=headers, json={})
            return {"status": "CAPTURED", "capture_id": resp.json()["id"]}

    def void_authorization(self, authorization_id: str) -> dict:
        token = self._get_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        with httpx.Client(base_url=self.base_url) as client:
            client.post(f"/v2/payments/authorizations/{authorization_id}/void", headers=headers, json={})
            return {"status": "VOIDED"}