from strategy.payment_strategy import PaymentStrategy

class CashPayment(PaymentStrategy):
    """Chiến lược thanh toán bằng tiền mặt"""
    
    def __init__(self):
        self.cash_drawer = 0
    
    def pay(self, amount: float) -> bool:
        """Thanh toán bằng tiền mặt"""
        if amount > 0:
            self.cash_drawer += amount
            print(f"Thanh toán {amount} VND bằng tiền mặt thành công.")
            return True
        return False
    
    def refund(self, amount: float) -> bool:
        """Hoàn tiền bằng tiền mặt"""
        if amount > 0 and self.cash_drawer >= amount:
            self.cash_drawer -= amount
            print(f"Hoàn {amount} VND cho khách hàng.")
            return True
        return False
    
    def get_payment_method_name(self) -> str:
        return "Tiền mặt"
    
    def get_cash_total(self) -> float:
        """Lấy tổng tiền mặt trong ngăn"""
        return self.cash_drawer
