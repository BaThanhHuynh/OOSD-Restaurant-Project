from model.menu_item import MenuItem

class OrderItem:
    """Model đại diện cho một mục trong đơn hàng"""
    
    def __init__(self, order_item_id: int, menu_item: MenuItem, quantity: int, notes: str = ""):
        self.order_item_id = order_item_id
        self.menu_item = menu_item
        self.quantity = quantity
        self.notes = notes
        self.total_price = menu_item.price * quantity
    
    def get_total_price(self) -> float:
        """Tính tổng giá tiền cho mục này"""
        return self.menu_item.price * self.quantity
    
    def update_quantity(self, new_quantity: int):
        """Cập nhật số lượng"""
        if new_quantity > 0:
            self.quantity = new_quantity
            self.total_price = self.get_total_price()
    
    def __repr__(self):
        return f"OrderItem(id={self.order_item_id}, item={self.menu_item.name}, qty={self.quantity})"
