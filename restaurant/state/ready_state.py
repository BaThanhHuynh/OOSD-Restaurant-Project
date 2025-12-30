from state.dish_state import DishState

class ReadyState(DishState):
    """Trạng thái: Đơn hàng đã sẵn sàng"""
    
    def handle(self, context):
        """Xử lý khi đơn hàng đã được nấu xong"""
        print(f"Đơn hàng {context.order_id} đã sẵn sàng phục vụ.")
        context.state = ReadyState()
    
    def get_status_name(self) -> str:
        return "Ready"
