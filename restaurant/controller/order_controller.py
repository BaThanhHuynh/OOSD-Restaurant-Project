from service.order_service import OrderService
from model.order_item import OrderItem
from model.enums import OrderStatus

class OrderController:
    """Controller xử lý các yêu cầu liên quan đến đơn hàng"""
    
    def __init__(self, order_service: OrderService):
        self.order_service = order_service
    
    def create_new_order(self, table_id: int):
        """Tạo đơn hàng mới cho một bàn"""
        order = self.order_service.create_order(table_id)
        return order
    
    def view_order(self, order_id: int):
        """Xem chi tiết đơn hàng"""
        order = self.order_service.get_order(order_id)
        return order
    
    def add_item_to_order(self, order_id: int, order_item: OrderItem) -> bool:
        """Thêm mục vào đơn hàng"""
        return self.order_service.add_item_to_order(order_id, order_item)
    
    def remove_item_from_order(self, order_id: int, order_item_id: int) -> bool:
        """Xóa mục khỏi đơn hàng"""
        return self.order_service.remove_item_from_order(order_id, order_item_id)
    
    def update_order_status(self, order_id: int, new_status: OrderStatus) -> bool:
        """Cập nhật trạng thái đơn hàng"""
        return self.order_service.change_order_status(order_id, new_status)
    
    def view_all_orders(self):
        """Xem tất cả đơn hàng"""
        orders = self.order_service.get_all_orders()
        return orders
    
    def view_table_orders(self, table_id: int):
        """Xem các đơn hàng của một bàn"""
        orders = self.order_service.get_orders_by_table(table_id)
        return orders
