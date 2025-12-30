from strategy.payment_strategy import PaymentStrategy

class BankPayment(PaymentStrategy):
    """Chiến lược thanh toán qua ngân hàng"""
    
    def __init__(self, bank_account: str):
        self.bank_account = bank_account
        self.transaction_log = []
    
    def pay(self, amount: float) -> bool:
        """Thanh toán qua ngân hàng"""
        if amount > 0:
            transaction = {
                "type": "payment",
                "amount": amount,
                "status": "success"
            }
            self.transaction_log.append(transaction)
            print(f"Thanh toán {amount} VND qua tài khoản {self.bank_account} thành công.")
            return True
        return False
    
    def refund(self, amount: float) -> bool:
        """Hoàn tiền qua ngân hàng"""
        if amount > 0:
            transaction = {
                "type": "refund",
                "amount": amount,
                "status": "success"
            }
            self.transaction_log.append(transaction)
            print(f"Hoàn {amount} VND qua tài khoản {self.bank_account}.")
            return True
        return False
    
    def get_payment_method_name(self) -> str:
        return "Chuyển khoản ngân hàng"
    
    def get_transaction_history(self):
        """Lấy lịch sử giao dịch"""
        return self.transaction_log
