from service.table_service import TableService

class TableController:
    """Controller xử lý các yêu cầu liên quan đến bàn"""
    
    def __init__(self, table_service: TableService):
        self.table_service = table_service
    
    def list_all_tables(self):
        """Lấy danh sách tất cả bàn"""
        tables = self.table_service.get_all_tables()
        return tables
    
    def list_available_tables(self):
        """Lấy danh sách bàn trống"""
        tables = self.table_service.get_available_tables()
        return tables
    
    def get_table_info(self, table_id: int):
        """Lấy thông tin chi tiết của một bàn"""
        table = self.table_service.get_table(table_id)
        return table
    
    def book_table(self, table_id: int) -> bool:
        """Đặt bàn (đánh dấu bàn đã có người)"""
        return self.table_service.occupy_table(table_id)
    
    def free_table(self, table_id: int) -> bool:
        """Giải phóng bàn"""
        return self.table_service.release_table(table_id)
