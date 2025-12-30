from model.payment import Payment

class PaymentRepository:
    """Repository quản lý các khoản thanh toán"""
    
    def __init__(self):
        self._payments: dict[int, Payment] = {}
    
    def add_payment(self, payment: Payment) -> bool:
        """Thêm một khoản thanh toán"""
        if payment.payment_id not in self._payments:
            self._payments[payment.payment_id] = payment
            return True
        return False
    
    def get_payment(self, payment_id: int) -> Payment:
        """Lấy khoản thanh toán theo ID"""
        return self._payments.get(payment_id)
    
    def get_all_payments(self) -> list[Payment]:
        """Lấy tất cả các khoản thanh toán"""
        return list(self._payments.values())
    
    def get_payments_by_order(self, order_id: int) -> list[Payment]:
        """Lấy các khoản thanh toán của một đơn hàng"""
        return [payment for payment in self._payments.values() if payment.order_id == order_id]
    
    def update_payment(self, payment: Payment) -> bool:
        """Cập nhật khoản thanh toán"""
        if payment.payment_id in self._payments:
            self._payments[payment.payment_id] = payment
            return True
        return False
    
    def delete_payment(self, payment_id: int) -> bool:
        """Xóa một khoản thanh toán"""
        if payment_id in self._payments:
            del self._payments[payment_id]
            return True
        return False
