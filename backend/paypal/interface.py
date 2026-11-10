from abc import ABC, abstractmethod

class PayPalClient(ABC):
    @abstractmethod
    def create_order(self, amount: float, currency: str = "USD") -> dict:
        pass

    @abstractmethod
    def authorize_order(self, order_id: str) -> dict:
        pass

    @abstractmethod
    def capture_authorization(self, authorization_id: str) -> dict:
        pass

    @abstractmethod
    def void_authorization(self, authorization_id: str) -> dict:
        pass