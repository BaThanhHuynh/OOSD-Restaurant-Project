from state.dish_state import DishState

class CookingState(DishState):
    """Trạng thái: Đơn hàng đang được nấu"""
    
    def handle(self, context):
        """Xử lý khi đơn hàng bắt đầu được nấu"""
        print(f"Đơn hàng {context.order_id} đang được nấu.")
        context.state = CookingState()
    
    def get_status_name(self) -> str:
        return "Cooking"
