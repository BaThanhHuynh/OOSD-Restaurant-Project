from datetime import datetime
from model.enums import PaymentMethod

class Payment:
    """Model đại diện cho một khoản thanh toán"""
    
    def __init__(self, payment_id: int, order_id: int, amount: float, method: PaymentMethod):
        self.payment_id = payment_id
        self.order_id = order_id
        self.amount = amount
        self.method = method
        self.is_paid = False
        self.created_at = datetime.now()
        self.paid_at = None
    
    def complete_payment(self):
        """Đánh dấu thanh toán đã hoàn thành"""
        self.is_paid = True
        self.paid_at = datetime.now()
    
    def get_payment_status(self) -> str:
        """Lấy trạng thái thanh toán"""
        return "Đã thanh toán" if self.is_paid else "Chưa thanh toán"
    
    def __repr__(self):
        return f"Payment(id={self.payment_id}, order={self.order_id}, amount={self.amount}, method={self.method.value})"
