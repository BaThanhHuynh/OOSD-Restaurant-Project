from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    """Abstract base class cho chiến lược thanh toán"""
    
    @abstractmethod
    def pay(self, amount: float) -> bool:
        """Thực hiện thanh toán"""
        pass
    
    @abstractmethod
    def refund(self, amount: float) -> bool:
        """Hoàn tiền"""
        pass
    
    @abstractmethod
    def get_payment_method_name(self) -> str:
        """Lấy tên phương thức thanh toán"""
        pass
