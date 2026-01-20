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
- Thiết kế hướng đối tượng (Object-Oriented Software Design – OOSD).
- Áp dụng triệt để các nguyên lý OOP (Encapsulation, Inheritance, Polymorphism, Abstraction).
- Không tập trung vào giao diện đồ họa (GUI) hay hệ quản trị cơ sở dữ liệu (DB).
### 2. CÔNG NGHỆ & PHẠM VI
- Ngôn ngữ: Java (JDK 17 hoặc 21).
- Giao diện người dùng: Console / Command Line Interface (CLI) - sử dụng Scanner, System.out.
- Lưu trữ dữ liệu: In-memory (sử dụng Java Collections: ArrayList, HashMap, LinkedList).
#### Không sử dụng:
- Framework lớn (Spring Boot, Jakarta EE, Hibernate...).
- Database thật (MySQL, PostgreSQL, SQLite...).
- Các thư viện hỗ trợ UI phức tạp (JavaFX, Swing - trừ khi yêu cầu bắt buộc, nhưng ưu tiên CLI để tập trung logic).
#### Mục đích: giữ hệ thống nhẹ, rõ thiết kế, dễ phân tích OOP & Design Patterns.

### 3. DOMAIN MODEL (JAVA OOP)
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
- Design Pattern	Mục đích sử dụng
- State Pattern	Quản lý vòng đời trạng thái món ăn
- Strategy Pattern	Xử lý các hình thức thanh toán
- MVC (đơn giản)	Phân tách Controller – Service – Model
- Singleton (tuỳ chọn)	Quản lý Repository dùng chung

### 5. KIẾN TRÚC HỆ THỐNG
```text
frontend
│
├── assets
│   │
│   ├── css
│   │   └── style.css
│   │
│   └── js
│       ├── api.js
│       └── app.js
│   
├── pages
└── index.html
```
#### Nguyên tắc:
- Frontend chỉ gọi Controller.
- Controller nhận input, validate cơ bản và gọi Service.
- Mọi logic nghiệp vụ nằm trong Service.
- Repository chỉ chịu trách nhiệm CRUD dữ liệu vào List/Map.
### 6. CẤU TRÚC THƯ MỤC DỰ ÁN
```text
backend\src/
└── com/
    └── restaurant/
        ├── Main.java  (Entry point)
        │
        ├── controller/
        │   ├── TableController.java
        │   ├── MenuController.java
        │   ├── OrderController.java
        │   └── PaymentController.java
        │
        ├── service/
        │   ├── TableService.java
        │   ├── MenuService.java
        │   ├── OrderService.java
        │   └── PaymentService.java
        │
        ├── model/
        │   ├── entity/
        │   │   ├── Table.java
        │   │   ├── MenuItem.java
        │   │   ├── Order.java
        │   │   ├── OrderItem.java
        │   │   └── Payment.java
        │   └── enums/
        │       ├── TableStatus.java
        │       ├── MenuItemStatus.java
        │       ├── OrderStatus.java
        │       ├── DishStatus.java
        │       └── PaymentMethod.java
        │
        ├── repository/
        │   ├── TableRepository.java
        │   ├── MenuRepository.java
        │   ├── OrderRepository.java
        │   └── PaymentRepository.java
        │
        ├── pattern/
        │   ├── state/
        │   │   ├── DishState.java (Interface)
        │   │   ├── OrderedState.java
        │   │   ├── CookingState.java
        │   │   ├── ReadyState.java
        │   │   └── ServedState.java
        │   └── strategy/
        │       ├── PaymentStrategy.java (Interface)
        │       ├── CashPayment.java
        │       └── BankTransferPayment.java
        │
        └── view/ (Optional - Tách code in/out khỏi Main)
            └── ConsoleView.java
```
### 7. PHÂN CÔNG CÔNG VIỆC (4 NGƯỜI)
#### NGƯỜI 1 – BACKEND CORE (TABLE & MENU)
#### Vai trò
#### Backend nền tảng – quản lý dữ liệu và nghiệp vụ cơ bản.
#### Phụ trách
- Model: Table, MenuItem, Enums liên quan.
- Repository: TableRepository, MenuRepository.
- Service: TableService, MenuService.
- Controller: TableController, MenuController.
#### Nghiệp vụ
- Tạo / xoá / cập nhật bàn
- Mở / đóng bàn
- CRUD menu
#### Yêu cầu OOSD
- Encapsulation: Tất cả thuộc tính là private, truy xuất qua Getter/Setter.
- Sử dụng Constructor để khởi tạo đối tượng chuẩn.
#### NGƯỜI 2 – BACKEND LOGIC (ORDER & STATE)
#### Người chịu trách nhiệm phần OOSD quan trọng nhất
#### Vai trò
#### Xử lý nghiệp vụ phức tạp và State Pattern.
#### Phụ trách
Model: Order, OrderItem.
- State Pattern: Interface DishState, Classes: OrderedState, CookingState, ReadyState, ServedState.
- Repository: OrderRepository.
- Service: OrderService.
- Controller: OrderController.
#### Nghiệp vụ
- Tạo order theo bàn
- Thêm món vào order
- Chuyển trạng thái món ăn
#### Yêu cầu OOSD
- Không dùng if–else xử lý trạng thái
- Mỗi trạng thái là một Class riêng biệt implement, interface, DishState.

#### NGƯỜI 3 – BACKEND PAYMENT (STRATEGY PATTERN)
#### Vai trò
#### Đóng vòng nghiệp vụ thanh toán.
#### Phụ trách
- Model: Payment.
- Strategy Pattern: Interface PaymentStrategy (method pay(double amount)), Classes: CashPayment, BankTransferPayment.
- Repository: PaymentRepository.
- Service: PaymentService.
- Controller: PaymentController.
#### Nghiệp vụ
- Tính tổng tiền order
- Thực hiện thanh toán
- Cập nhật trạng thái: Order → COMPLETED, Table → AVAILABLE

#### NGƯỜI 4 – FRONTEND (CLI USER INTERFACE)
#### Vai trò
##### Xây dựng giao diện console và luồng sử dụng.
#### Phụ trách
- main.py
- Menu console
- Nhập / xuất dữ liệu
- Điều hướng chức năng
#### Các màn hình CLI
1.	Quản lý bàn
2.	Quản lý menu
3.	Gọi món
4.	Cập nhật trạng thái món
5.	Thanh toán
6.	Thoát
#### Nguyên tắc
- Frontend không chứa logic nghiệp vụ.
- Frontend không gọi trực tiếp Repository hay Model.
- Frontend chỉ gọi Controller.
### 8. SƠ ĐỒ PHÂN QUYỀN GỌI CODE
``` Text
Frontend (CLI)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Model
```
- Frontend không gọi Service
- Controller không chứa logic phức tạp
### 9. PHÂN CÔNG UML & BÁO CÁO
- Hạng mục	Phụ trách
- Use Case Diagram Model	Người 4
- Class Diagram	Người 1 + Người 2
- Interaction model (sequence/activity).	Người 2
- Design decisions & patterns applied.	Người 3
- Tổng hợp báo cáo	Người 4

    