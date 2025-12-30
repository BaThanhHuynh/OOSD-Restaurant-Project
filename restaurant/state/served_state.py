from state.dish_state import DishState

class ServedState(DishState):
    """Trạng thái: Đơn hàng đã được phục vụ"""
    
    def handle(self, context):
        """Xử lý khi đơn hàng được phục vụ cho khách"""
        print(f"Đơn hàng {context.order_id} đã được phục vụ.")
        context.state = ServedState()
    
    def get_status_name(self) -> str:
        return "Served"
