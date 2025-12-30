from service.payment_service import PaymentService
from model.enums import PaymentMethod
from strategy.payment_strategy import PaymentStrategy

class PaymentController:
    """Controller xử lý các yêu cầu liên quan đến thanh toán"""
    
    def __init__(self, payment_service: PaymentService):
        self.payment_service = payment_service
    
    def create_payment(self, order_id: int, amount: float, method: PaymentMethod):
        """Tạo khoản thanh toán"""
        payment = self.payment_service.create_payment(order_id, amount, method)
        return payment
    
    def get_payment_info(self, payment_id: int):
        """Lấy thông tin thanh toán"""
        payment = self.payment_service.get_payment(payment_id)
        return payment
    
    def process_payment(self, payment_id: int, strategy: PaymentStrategy) -> bool:
        """Xử lý thanh toán"""
        return self.payment_service.process_payment(payment_id, strategy)
    
    def refund_payment(self, payment_id: int, strategy: PaymentStrategy) -> bool:
        """Hoàn tiền"""
        return self.payment_service.refund_payment(payment_id, strategy)
    
    def view_order_payments(self, order_id: int):
        """Xem các khoản thanh toán của đơn hàng"""
        payments = self.payment_service.get_payments_by_order(order_id)
        return payments
