from enum import Enum

class OrderStatus(Enum):
    """Trạng thái của đơn hàng"""
    PENDING = "pending"
    COOKING = "cooking"
    READY = "ready"
    SERVED = "served"
    CANCELLED = "cancelled"

class PaymentMethod(Enum):
    """Phương thức thanh toán"""
    CASH = "cash"
    BANK = "bank"
    CARD = "card"

class DishStatus(Enum):
    """Trạng thái của món ăn"""
    AVAILABLE = "available"
    NOT_AVAILABLE = "not_available"
    OUT_OF_STOCK = "out_of_stock"
