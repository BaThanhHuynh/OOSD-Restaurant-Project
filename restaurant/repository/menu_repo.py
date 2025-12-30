from model.menu_item import MenuItem

class MenuRepository:
    """Repository quản lý các mục trong thực đơn"""
    
    def __init__(self):
        self._items: dict[int, MenuItem] = {}
    
    def add_item(self, item: MenuItem) -> bool:
        """Thêm một mục vào thực đơn"""
        if item.item_id not in self._items:
            self._items[item.item_id] = item
            return True
        return False
    
    def get_item(self, item_id: int) -> MenuItem:
        """Lấy mục theo ID"""
        return self._items.get(item_id)
    
    def get_all_items(self) -> list[MenuItem]:
        """Lấy tất cả các mục"""
        return list(self._items.values())
    
    def get_available_items(self) -> list[MenuItem]:
        """Lấy các mục có sẵn"""
        from model.enums import DishStatus
        return [item for item in self._items.values() if item.status == DishStatus.AVAILABLE]
    
    def update_item(self, item: MenuItem) -> bool:
        """Cập nhật thông tin mục"""
        if item.item_id in self._items:
            self._items[item.item_id] = item
            return True
        return False
    
    def delete_item(self, item_id: int) -> bool:
        """Xóa một mục"""
        if item_id in self._items:
            del self._items[item_id]
            return True
        return False
