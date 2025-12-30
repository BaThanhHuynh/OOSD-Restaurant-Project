from model.payment import Payment
from model.enums import PaymentMethod
from repository.payment_repo import PaymentRepository
from strategy.payment_strategy import PaymentStrategy

class PaymentService:
    """Service quản lý thanh toán"""
    
    def __init__(self, payment_repo: PaymentRepository):
        self.payment_repo = payment_repo
        self._payment_counter = 0
        self._payment_strategies = {}
    
    def register_payment_strategy(self, method_name: str, strategy: PaymentStrategy):
        """Đăng ký chiến lược thanh toán"""
        self._payment_strategies[method_name] = strategy
    
    def create_payment(self, order_id: int, amount: float, method: PaymentMethod) -> Payment:
        """Tạo một khoản thanh toán"""
        self._payment_counter += 1
        payment = Payment(self._payment_counter, order_id, amount, method)
        if self.payment_repo.add_payment(payment):
            return payment
        return None
    
    def get_payment(self, payment_id: int) -> Payment:
        """Lấy thông tin thanh toán"""
        return self.payment_repo.get_payment(payment_id)
    
    def process_payment(self, payment_id: int, strategy: PaymentStrategy) -> bool:
        """Xử lý thanh toán"""
        payment = self.payment_repo.get_payment(payment_id)
        if payment and strategy.pay(payment.amount):
            payment.complete_payment()
            return self.payment_repo.update_payment(payment)
        return False
    
    def refund_payment(self, payment_id: int, strategy: PaymentStrategy) -> bool:
        """Hoàn lại khoản thanh toán"""
        payment = self.payment_repo.get_payment(payment_id)
        if payment and payment.is_paid:
            if strategy.refund(payment.amount):
                payment.is_paid = False
                return self.payment_repo.update_payment(payment)
        return False
    
    def get_payments_by_order(self, order_id: int) -> list[Payment]:
        """Lấy các khoản thanh toán của một đơn hàng"""
        return self.payment_repo.get_payments_by_order(order_id)
