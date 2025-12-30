from abc import ABC, abstractmethod

class DishState(ABC):
    """Abstract base class cho trạng thái của món ăn"""
    
    @abstractmethod
    def handle(self, context):
        """Xử lý trạng thái"""
        pass
    
    @abstractmethod
    def get_status_name(self) -> str:
        """Lấy tên trạng thái"""
        pass
