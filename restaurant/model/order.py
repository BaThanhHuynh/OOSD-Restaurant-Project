from datetime import datetime
from model.enums import OrderStatus
from model.order_item import OrderItem

class Order:
    """Model đại diện cho một đơn hàng"""
    
    def __init__(self, order_id: int, table_id: int):
        self.order_id = order_id
        self.table_id = table_id
        self.status = OrderStatus.PENDING
        self.items: list[OrderItem] = []
        self.total_amount = 0.0
        self.created_at = datetime.now()
        self.completed_at = None
    
    def add_item(self, order_item: OrderItem):
        """Thêm mục vào đơn hàng"""
        self.items.append(order_item)
        self._calculate_total()
    
    def remove_item(self, order_item_id: int):
        """Xóa mục khỏi đơn hàng"""
        self.items = [item for item in self.items if item.order_item_id != order_item_id]
        self._calculate_total()
    
    def _calculate_total(self):
        """Tính tổng tiền của đơn hàng"""
        self.total_amount = sum(item.get_total_price() for item in self.items)
    
    def change_status(self, new_status: OrderStatus):
        """Thay đổi trạng thái đơn hàng"""
        self.status = new_status
        if new_status == OrderStatus.SERVED:
            self.completed_at = datetime.now()
    
    def __repr__(self):
        return f"Order(id={self.order_id}, table={self.table_id}, status={self.status.value}, total={self.total_amount})"
