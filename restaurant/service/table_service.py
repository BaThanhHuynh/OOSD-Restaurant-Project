from model.table import Table
from repository.table_repo import TableRepository

class TableService:
    """Service quản lý bàn trong nhà hàng"""
    
    def __init__(self, table_repo: TableRepository):
        self.table_repo = table_repo
    
    def create_table(self, table_id: int, capacity: int) -> Table:
        """Tạo một bàn mới"""
        table = Table(table_id, capacity)
        if self.table_repo.add_table(table):
            return table
        return None
    
    def get_table(self, table_id: int) -> Table:
        """Lấy thông tin bàn"""
        return self.table_repo.get_table(table_id)
    
    def get_available_tables(self) -> list[Table]:
        """Lấy danh sách các bàn trống"""
        return self.table_repo.get_available_tables()
    
    def occupy_table(self, table_id: int) -> bool:
        """Đánh dấu bàn là đã có người"""
        table = self.table_repo.get_table(table_id)
        if table and not table.is_occupied:
            table.occupy()
            return self.table_repo.update_table(table)
        return False
    
    def release_table(self, table_id: int) -> bool:
        """Giải phóng bàn"""
        table = self.table_repo.get_table(table_id)
        if table and table.is_occupied:
            table.release()
            return self.table_repo.update_table(table)
        return False
    
    def get_all_tables(self) -> list[Table]:
        """Lấy tất cả các bàn"""
        return self.table_repo.get_all_tables()
