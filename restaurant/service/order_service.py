from model.order import Order
from model.order_item import OrderItem
from model.enums import OrderStatus
from repository.order_repo import OrderRepository

class OrderService:
    """Service quản lý các đơn hàng"""
    
    def __init__(self, order_repo: OrderRepository):
        self.order_repo = order_repo
        self._order_counter = 0
    
    def create_order(self, table_id: int) -> Order:
        """Tạo một đơn hàng mới"""
        self._order_counter += 1
        order = Order(self._order_counter, table_id)
        if self.order_repo.add_order(order):
            return order
        return None
    
    def get_order(self, order_id: int) -> Order:
        """Lấy thông tin đơn hàng"""
        return self.order_repo.get_order(order_id)
    
    def add_item_to_order(self, order_id: int, order_item: OrderItem) -> bool:
        """Thêm mục vào đơn hàng"""
        order = self.order_repo.get_order(order_id)
        if order:
            order.add_item(order_item)
            return self.order_repo.update_order(order)
        return False
    
    def remove_item_from_order(self, order_id: int, order_item_id: int) -> bool:
        """Xóa mục khỏi đơn hàng"""
        order = self.order_repo.get_order(order_id)
        if order:
            order.remove_item(order_item_id)
            return self.order_repo.update_order(order)
        return False
    
    def change_order_status(self, order_id: int, new_status: OrderStatus) -> bool:
        """Thay đổi trạng thái đơn hàng"""
        order = self.order_repo.get_order(order_id)
        if order:
            order.change_status(new_status)
            return self.order_repo.update_order(order)
        return False
    
    def get_all_orders(self) -> list[Order]:
        """Lấy tất cả đơn hàng"""
        return self.order_repo.get_all_orders()
    
    def get_orders_by_table(self, table_id: int) -> list[Order]:
        """Lấy các đơn hàng của một bàn"""
        return self.order_repo.get_orders_by_table(table_id)
