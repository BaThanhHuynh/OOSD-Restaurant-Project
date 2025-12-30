"""
Ứng dụng quản lý nhà hàng - Restaurant Management System
Sử dụng các Design Patterns: MVC, Repository, State, Strategy
"""

from repository.table_repo import TableRepository
from repository.menu_repo import MenuRepository
from repository.order_repo import OrderRepository
from repository.payment_repo import PaymentRepository

from service.table_service import TableService
from service.menu_service import MenuService
from service.order_service import OrderService
from service.payment_service import PaymentService

from controller.table_controller import TableController
from controller.menu_controller import MenuController
from controller.order_controller import OrderController
from controller.payment_controller import PaymentController

from strategy.cash_payment import CashPayment
from strategy.bank_payment import BankPayment

from model.enums import PaymentMethod, OrderStatus


def initialize_system():
    """Khởi tạo hệ thống quản lý nhà hàng"""
    
    # Khởi tạo các Repository
    table_repo = TableRepository()
    menu_repo = MenuRepository()
    order_repo = OrderRepository()
    payment_repo = PaymentRepository()
    
    # Khởi tạo các Service
    table_service = TableService(table_repo)
    menu_service = MenuService(menu_repo)
    order_service = OrderService(order_repo)
    payment_service = PaymentService(payment_repo)
    
    # Khởi tạo các Controller
    table_controller = TableController(table_service)
    menu_controller = MenuController(menu_service)
    order_controller = OrderController(order_service)
    payment_controller = PaymentController(payment_service)
    
    return {
        'table_controller': table_controller,
        'menu_controller': menu_controller,
        'order_controller': order_controller,
        'payment_controller': payment_controller,
        'table_service': table_service,
        'menu_service': menu_service,
        'order_service': order_service,
        'payment_service': payment_service,
        'order_repo': order_repo,
        'payment_repo': payment_repo
    }


def demo():
    """Demo các chức năng của hệ thống"""
    
    print("=" * 60)
    print("ỨNG DỤNG QUẢN LÝ NHÀ HÀNG")
    print("=" * 60)
    
    # Khởi tạo hệ thống
    system = initialize_system()
    
    table_controller = system['table_controller']
    menu_controller = system['menu_controller']
    order_controller = system['order_controller']
    payment_controller = system['payment_controller']
    
    # 1. Tạo các bàn
    print("\n1. TẠO CÁC BÀN:")
    print("-" * 60)
    table_service = system['table_service']
    for i in range(1, 6):
        table_service.create_table(i, 4)
    print("✓ Đã tạo 5 bàn, mỗi bàn 4 chỗ")
    
    # 2. Xem danh sách bàn
    print("\n2. DANH SÁCH CÁC BÀN:")
    print("-" * 60)
    tables = table_controller.list_all_tables()
    for table in tables:
        status = "Đã có người" if table.is_occupied else "Trống"
        print(f"  Bàn {table.table_id}: {status} (Sức chứa: {table.capacity})")
    
    # 3. Thêm các mục vào thực đơn
    print("\n3. THÊM MỤC VÀO THỰC ĐƠN:")
    print("-" * 60)
    menu_controller.add_menu_item(1, "Phở", 50000, "Phở bò nấu với nước dùng ngon")
    menu_controller.add_menu_item(2, "Cơm gà", 40000, "Cơm gà hướng dương")
    menu_controller.add_menu_item(3, "Bánh mì", 25000, "Bánh mì thập cẩm")
    print("✓ Đã thêm 3 mục vào thực đơn")
    
    # 4. Xem thực đơn
    print("\n4. THỰC ĐƠN:")
    print("-" * 60)
    items = menu_controller.view_menu()
    for item in items:
        print(f"  {item.item_id}. {item.name}: {item.price} VND")
    
    # 5. Đặt bàn
    print("\n5. ĐẶT BÀN:")
    print("-" * 60)
    table_controller.book_table(1)
    print("✓ Đã đặt bàn 1")
    
    # 6. Tạo đơn hàng
    print("\n6. TẠO ĐƠN HÀNG:")
    print("-" * 60)
    order = order_controller.create_new_order(1)
    print(f"✓ Đã tạo đơn hàng #{order.order_id} cho bàn 1")
    
    # 7. Thêm mục vào đơn hàng
    print("\n7. THÊM MỤC VÀO ĐƠN HÀNG:")
    print("-" * 60)
    from model.order_item import OrderItem
    
    order_item_1 = OrderItem(1, system['menu_service'].get_menu_item(1), 2, "Ít hành")
    order_item_2 = OrderItem(2, system['menu_service'].get_menu_item(2), 1, "Không cay")
    
    order_controller.add_item_to_order(order.order_id, order_item_1)
    order_controller.add_item_to_order(order.order_id, order_item_2)
    print("✓ Đã thêm 2 mục vào đơn hàng")
    
    # 8. Xem chi tiết đơn hàng
    print("\n8. CHI TIẾT ĐƠN HÀNG:")
    print("-" * 60)
    order = order_controller.view_order(order.order_id)
    print(f"  Đơn hàng #{order.order_id} - Bàn {order.table_id}")
    print(f"  Trạng thái: {order.status.value}")
    for item in order.items:
        print(f"    • {item.menu_item.name} x{item.quantity} = {item.get_total_price()} VND")
    print(f"  Tổng cộng: {order.total_amount} VND")
    
    # 9. Cập nhật trạng thái đơn hàng
    print("\n9. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG:")
    print("-" * 60)
    order_controller.update_order_status(order.order_id, OrderStatus.COOKING)
    order_controller.update_order_status(order.order_id, OrderStatus.READY)
    order_controller.update_order_status(order.order_id, OrderStatus.SERVED)
    print("✓ Đã cập nhật: Pending → Cooking → Ready → Served")
    
    # 10. Thanh toán
    print("\n10. THANH TOÁN:")
    print("-" * 60)
    
    # Khởi tạo chiến lược thanh toán
    cash_strategy = CashPayment()
    bank_strategy = BankPayment("123456789")
    
    payment_service = system['payment_service']
    payment_service.register_payment_strategy("cash", cash_strategy)
    payment_service.register_payment_strategy("bank", bank_strategy)
    
    # Tạo và xử lý thanh toán
    payment = payment_controller.create_payment(
        order.order_id, 
        order.total_amount, 
        PaymentMethod.CASH
    )
    print(f"✓ Tạo khoản thanh toán #{payment.payment_id}")
    
    if payment_controller.process_payment(payment.payment_id, cash_strategy):
        print(f"✓ Thanh toán bằng {cash_strategy.get_payment_method_name()} thành công!")
        print(f"  Tổng tiền: {payment.amount} VND")
    
    # 11. Giải phóng bàn
    print("\n11. GIẢI PHÓNG BÀN:")
    print("-" * 60)
    table_controller.free_table(1)
    print("✓ Đã giải phóng bàn 1")
    
    # 12. Xem danh sách bàn trống
    print("\n12. DANH SÁCH BÀN TRỐNG:")
    print("-" * 60)
    available_tables = table_controller.list_available_tables()
    print(f"✓ Có {len(available_tables)} bàn trống")
    
    print("\n" + "=" * 60)
    print("KẾT THÚC DEMO")
    print("=" * 60)


if __name__ == "__main__":
    demo()
