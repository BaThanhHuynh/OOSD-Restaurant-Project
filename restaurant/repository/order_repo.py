from model.order import Order

class OrderRepository:
    """Repository quản lý các đơn hàng"""
    
    def __init__(self):
        self._orders: dict[int, Order] = {}
    
    def add_order(self, order: Order) -> bool:
        """Thêm một đơn hàng"""
        if order.order_id not in self._orders:
            self._orders[order.order_id] = order
            return True
        return False
    
    def get_order(self, order_id: int) -> Order:
        """Lấy đơn hàng theo ID"""
        return self._orders.get(order_id)
    
    def get_all_orders(self) -> list[Order]:
        """Lấy tất cả các đơn hàng"""
        return list(self._orders.values())
    
    def get_orders_by_table(self, table_id: int) -> list[Order]:
        """Lấy các đơn hàng của một bàn"""
        return [order for order in self._orders.values() if order.table_id == table_id]
    
    def update_order(self, order: Order) -> bool:
        """Cập nhật đơn hàng"""
        if order.order_id in self._orders:
            self._orders[order.order_id] = order
            return True
        return False
    
    def delete_order(self, order_id: int) -> bool:
        """Xóa một đơn hàng"""
        if order_id in self._orders:
            del self._orders[order_id]
            return True
        return False
