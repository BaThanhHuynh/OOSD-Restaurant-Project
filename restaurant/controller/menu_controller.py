from service.menu_service import MenuService

class MenuController:
    """Controller xử lý các yêu cầu liên quan đến thực đơn"""
    
    def __init__(self, menu_service: MenuService):
        self.menu_service = menu_service
    
    def view_menu(self):
        """Xem toàn bộ thực đơn"""
        items = self.menu_service.get_all_menu_items()
        return items
    
    def view_available_menu(self):
        """Xem các mục có sẵn"""
        items = self.menu_service.get_available_items()
        return items
    
    def get_menu_item(self, item_id: int):
        """Lấy thông tin chi tiết một mục"""
        item = self.menu_service.get_menu_item(item_id)
        return item
    
    def add_menu_item(self, item_id: int, name: str, price: float, description: str = ""):
        """Thêm mục vào thực đơn"""
        item = self.menu_service.add_menu_item(item_id, name, price, description)
        return item
    
    def update_item_availability(self, item_id: int, is_available: bool) -> bool:
        """Cập nhật tính sẵn có của mục"""
        return self.menu_service.update_item_status(item_id, is_available)
    
    def update_item_price(self, item_id: int, new_price: float) -> bool:
        """Cập nhật giá của mục"""
        return self.menu_service.update_item_price(item_id, new_price)
