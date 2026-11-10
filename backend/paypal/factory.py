import os
from paypal.mock_client import MockPayPalClient
from paypal.real_client import RealPayPalClient

def get_paypal_client():
    if os.getenv("PAYPAL_MOCK_MODE", "true").lower() == "true":
        return MockPayPalClient()
    return RealPayPalClient()