from datetime import datetime

class Table:
    """Model đại diện cho một bàn trong nhà hàng"""
    
    def __init__(self, table_id: int, capacity: int):
        self.table_id = table_id
        self.capacity = capacity
        self.is_occupied = False
        self.current_order = None
        self.created_at = datetime.now()
    
    def occupy(self):
        """Đánh dấu bàn là đã có người"""
        self.is_occupied = True
    
    def release(self):
        """Giải phóng bàn"""
        self.is_occupied = False
        self.current_order = None
    
    def __repr__(self):
        return f"Table(id={self.table_id}, capacity={self.capacity}, occupied={self.is_occupied})"
