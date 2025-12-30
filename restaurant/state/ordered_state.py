from state.dish_state import DishState

class OrderedState(DishState):
    """Trạng thái: Đơn hàng vừa được tạo"""
    
    def handle(self, context):
        """Xử lý khi đơn hàng được đặt"""
        print(f"Đơn hàng {context.order_id} vừa được tạo.")
        context.state = OrderedState()
    
    def get_status_name(self) -> str:
        return "Ordered"
