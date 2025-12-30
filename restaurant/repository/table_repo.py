from model.table import Table

class TableRepository:
    """Repository quản lý các đối tượng Table"""
    
    def __init__(self):
        self._tables: dict[int, Table] = {}
    
    def add_table(self, table: Table) -> bool:
        """Thêm một bàn vào repository"""
        if table.table_id not in self._tables:
            self._tables[table.table_id] = table
            return True
        return False
    
    def get_table(self, table_id: int) -> Table:
        """Lấy bàn theo ID"""
        return self._tables.get(table_id)
    
    def get_all_tables(self) -> list[Table]:
        """Lấy tất cả các bàn"""
        return list(self._tables.values())
    
    def get_available_tables(self) -> list[Table]:
        """Lấy các bàn trống"""
        return [table for table in self._tables.values() if not table.is_occupied]
    
    def update_table(self, table: Table) -> bool:
        """Cập nhật thông tin bàn"""
        if table.table_id in self._tables:
            self._tables[table.table_id] = table
            return True
        return False
    
    def delete_table(self, table_id: int) -> bool:
        """Xóa một bàn"""
        if table_id in self._tables:
            del self._tables[table_id]
            return True
        return False
