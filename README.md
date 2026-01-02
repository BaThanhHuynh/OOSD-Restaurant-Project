# OOSD-Restaurant-Project
## Restaurant Ordering & Table Management System
### 1. MỤC TIÊU ĐỀ TÀI
#### Xây dựng một hệ thống quản lý nhà hàng bằng Python nhằm hỗ trợ các nghiệp vụ cốt lõi: 
- Quản lý bàn (Table Management)
- Quản lý menu và món ăn
- Gọi món theo bàn (Order Management)
- Theo dõi trạng thái món ăn trong bếp
- Thanh toán và đóng bàn
#### Trọng tâm của đề tài là:    
- Thiết kế hướng đối tượng (Object-Oriented Software Design – OOSD),
- không tập trung vào giao diện đồ họa hay hệ quản trị cơ sở dữ liệu.

### 2. CÔNG NGHỆ & PHẠM VI
- Ngôn ngữ: Python 3.x
- Giao diện người dùng: Console / Command Line Interface (CLI)
- Lưu trữ dữ liệu: In-memory (list, dict)
#### Không sử dụng:
- Framework web (Django, Flask, FastAPI, …)
- ORM
- Database thật (MySQL, PostgreSQL, …)
#### Mục đích: giữ hệ thống nhẹ, rõ thiết kế, dễ phân tích OOP & Design Patterns.

### 3. DOMAIN MODEL (PYTHON OOP)
#### 3.1 Các Entity chính
- Table
- MenuItem
- Order
- OrderItem
- Payment
#### 3.2 Enum (sử dụng enum.Enum)
- TableStatus: AVAILABLE, OCCUPIED, ORDERING, PAID
- MenuItemStatus: AVAILABLE, OUT_OF_STOCK
- OrderStatus: NEW, IN_PROGRESS, COMPLETED
- DishStatus: ORDERED, COOKING, READY, SERVED
- PaymentMethod: CASH, BANK_TRANSFER

### 4. DESIGN PATTERNS ÁP DỤNG
Design Pattern	Mục đích sử dụng
State Pattern	Quản lý vòng đời trạng thái món ăn
Strategy Pattern	Xử lý các hình thức thanh toán
MVC (đơn giản)	Phân tách Controller – Service – Model
Singleton (tuỳ chọn)	Quản lý Repository dùng chung
Python hoàn toàn đáp ứng các nguyên lý OOSD, không ảnh hưởng đến điểm số.

### 5. KIẾN TRÚC HỆ THỐNG
```text
Frontend (CLI)
│
├── Controller
│ │
│ └── Service (Business Logic)
│ │
│ └── Repository (In-memory)
│ │
│ └── Model
│ ├── Entity
│ ├── Enum
│ ├── State
│ └── Strategy
#### Nguyên tắc:
- Frontend chỉ gọi Controller
- Controller không chứa logic nghiệp vụ
- Logic nằm trong Service
- Repository chỉ chịu trách nhiệm lưu trữ

### 6. CẤU TRÚC THƯ MỤC DỰ ÁN
```text
restaurant/
├── main.py
│
├── controller/
│   ├── table_controller.py
│   ├── menu_controller.py
│   ├── order_controller.py
│   └── payment_controller.py
│
├── service/
│   ├── table_service.py
│   ├── menu_service.py
│   ├── order_service.py
│   └── payment_service.py
│
├── model/
│   ├── table.py
│   ├── menu_item.py
│   ├── order.py
│   ├── order_item.py
│   ├── payment.py
│   └── enums.py
│
├── repository/
│   ├── table_repo.py
│   ├── menu_repo.py
│   ├── order_repo.py
│   └── payment_repo.py
│
├── state/
│   ├── dish_state.py
│   ├── ordered_state.py
│   ├── cooking_state.py
│   ├── ready_state.py
│   └── served_state.py
│
└── strategy/
    ├── payment_strategy.py
    ├── cash_payment.py
    └── bank_payment.py

### 7. PHÂN CÔNG CÔNG VIỆC (4 NGƯỜI)
NGƯỜI 1 – BACKEND CORE (TABLE & MENU)
#### Vai trò
#### Backend nền tảng – quản lý dữ liệu và nghiệp vụ cơ bản.
#### Phụ trách
- Model
- Table
- MenuItem
- TableStatus, MenuItemStatus
- Repository
- TableRepository
- MenuRepository
- Service
- TableService
- MenuService
- Controller
- TableController
- MenuController
#### Nghiệp vụ
- Tạo / xoá / cập nhật bàn
- Mở / đóng bàn
- CRUD menu
#### Yêu cầu OOSD
- Encapsulation (thuộc tính private)
- Không thay đổi trạng thái trực tiếp
- Logic đặt trong Service

NGƯỜI 2 – BACKEND LOGIC (ORDER & STATE)
####Người chịu trách nhiệm phần OOSD quan trọng nhất
####Vai trò
####Xử lý nghiệp vụ phức tạp và State Pattern.
####Phụ trách
- Model
- Order
- OrderItem
- OrderStatus
- DishStatus
- State Pattern
- DishState (abstract)
- OrderedState
- CookingState
- ReadyState
- ServedState
- Repository
- OrderRepository
- Service
- OrderService
- Controller
- OrderController

#### Nghiệp vụ
- Tạo order theo bàn
- Thêm món vào order
- Chuyển trạng thái món ăn
#### Yêu cầu OOSD
- Không dùng if–else xử lý trạng thái
- Áp dụng State Pattern đúng chuẩn
- Order độc lập với UI

#### NGƯỜI 3 – BACKEND PAYMENT (STRATEGY PATTERN)
#### Vai trò
#### Đóng vòng nghiệp vụ thanh toán.
#### Phụ trách
- Model
- Payment
- PaymentMethod
- Strategy Pattern
- PaymentStrategy
- CashPayment
- BankTransferPayment
- Repository
- PaymentRepository
- Service
- PaymentService
- Controller
- PaymentController
#### Nghiệp vụ
- Tính tổng tiền order
- Thực hiện thanh toán
- Cập nhật trạng thái:
- Order → COMPLETED
- Table → AVAILABLE

#### NGƯỜI 4 – FRONTEND (CLI USER INTERFACE)
#### Vai trò
##### Xây dựng giao diện console và luồng sử dụng.
#### Phụ trách
- main.py
- Menu console
- Nhập / xuất dữ liệu
- Điều hướng chức năng
####Các màn hình CLI
1.	Quản lý bàn
2.	Quản lý menu
3.	Gọi món
4.	Cập nhật trạng thái món
5.	Thanh toán
6.	Thoát
####Nguyên tắc
•	Không xử lý business logic
•	Chỉ gọi Controller
•	Validate input cơ bản
•	Dễ demo

### 8. SƠ ĐỒ PHÂN QUYỀN GỌI CODE
Frontend (CLI)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Model
•	Frontend không gọi Service
•	Controller không chứa logic phức tạp

### 9. PHÂN CÔNG UML & BÁO CÁO
Hạng mục	Phụ trách
Use Case Diagram Model	Người 4
Class Diagram	Người 1 + Người 2
Interaction model (sequence/activity).	Người 2
Design decisions & patterns applied.	Người 3
Tổng hợp báo cáo	Người 4

