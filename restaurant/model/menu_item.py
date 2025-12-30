from model.enums import DishStatus

class MenuItem:
    """Model đại diện cho một mục trong thực đơn"""
    
    def __init__(self, item_id: int, name: str, price: float, description: str = ""):
        self.item_id = item_id
        self.name = name
        self.price = price
        self.description = description
        self.status = DishStatus.AVAILABLE
    
    def set_available(self):
        """Đánh dấu món ăn là có sẵn"""
        self.status = DishStatus.AVAILABLE
    
    def set_unavailable(self):
        """Đánh dấu món ăn là không có sẵn"""
        self.status = DishStatus.NOT_AVAILABLE
    
    def __repr__(self):
        return f"MenuItem(id={self.item_id}, name={self.name}, price={self.price}, status={self.status.value})"
