from model.menu_item import MenuItem
from repository.menu_repo import MenuRepository

class MenuService:
    """Service quản lý thực đơn"""
    
    def __init__(self, menu_repo: MenuRepository):
        self.menu_repo = menu_repo
    
    def add_menu_item(self, item_id: int, name: str, price: float, description: str = "") -> MenuItem:
        """Thêm một mục vào thực đơn"""
        item = MenuItem(item_id, name, price, description)
        if self.menu_repo.add_item(item):
            return item
        return None
    
    def get_menu_item(self, item_id: int) -> MenuItem:
        """Lấy thông tin một mục"""
        return self.menu_repo.get_item(item_id)
    
    def get_all_menu_items(self) -> list[MenuItem]:
        """Lấy toàn bộ thực đơn"""
        return self.menu_repo.get_all_items()
    
    def get_available_items(self) -> list[MenuItem]:
        """Lấy các mục có sẵn"""
        return self.menu_repo.get_available_items()
    
    def update_item_status(self, item_id: int, is_available: bool) -> bool:
        """Cập nhật trạng thái của một mục"""
        item = self.menu_repo.get_item(item_id)
        if item:
            if is_available:
                item.set_available()
            else:
                item.set_unavailable()
            return self.menu_repo.update_item(item)
        return False
    
    def update_item_price(self, item_id: int, new_price: float) -> bool:
        """Cập nhật giá của một mục"""
        item = self.menu_repo.get_item(item_id)
        if item and new_price > 0:
            item.price = new_price
            return self.menu_repo.update_item(item)
        return False
