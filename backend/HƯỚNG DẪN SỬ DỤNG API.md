# 🚀 API QUICK START GUIDE

## 📖 Hướng dẫn nhanh sử dụng API Restaurant

---

## 🎯 LUỒNG HOẠT ĐỘNG CHÍNH

### 1️⃣ Tạo đơn hàng mới cho bàn
```http
POST /api/orders/table/1
```

**Response:**
```json
{
  "orderId": 101,
  "tableId": 1,
  "orderStatus": "ACTIVE",
  "totalAmount": 0.0,
  "items": []
}
```

---

### 2️⃣ Thêm món ăn vào đơn hàng
```http
POST /api/orders/101/items
Content-Type: application/json

{
  "menuItemId": 5,
  "quantity": 2
}
```

**Response:**
```json
{
  "orderId": 101,
  "items": [
    {
      "orderItemId": 201,
      "menuItemName": "Phở Bò",
      "quantity": 2,
      "dishStatus": "ORDERED",  ← Trạng thái ban đầu
      "subtotal": 120000
    }
  ],
  "totalAmount": 120000
}
```

---

### 3️⃣ Chuyển trạng thái món ăn (State Pattern)

#### 🔄 ORDERED → COOKING
```http
PUT /api/orders/101/items/201/next-state
```

**Response:**
```json
{
  "orderItemId": 201,
  "dishStatus": "COOKING",  ← Tự động chuyển trạng thái
  "message": "Món đang được nấu"
}
```

#### 🔄 COOKING → READY
```http
PUT /api/orders/101/items/201/next-state
```

**Response:**
```json
{
  "orderItemId": 201,
  "dishStatus": "READY",  ← Món sẵn sàng
  "message": "Món đã sẵn sàng phục vụ"
}
```

#### 🔄 READY → SERVED
```http
PUT /api/orders/101/items/201/next-state
```

**Response:**
```json
{
  "orderItemId": 201,
  "dishStatus": "SERVED",  ← Đã phục vụ khách
  "message": "Món đã được phục vụ"
}
```

---

## 📊 LUỒNG TRẠNG THÁI MÓN ĂN

```
┌──────────┐   PUT next-state   ┌──────────┐
│ ORDERED  │ ─────────────────► │ COOKING  │
│ Đã đặt   │                    │ Đang nấu │
└──────────┘                    └────┬─────┘
                                     │
                        PUT next-state
                                     │
                                     ▼
                               ┌──────────┐
                               │  READY   │
                               │ Sẵn sàng │
                               └────┬─────┘
                                    │
                       PUT next-state
                                    │
                                    ▼
                              ┌──────────┐
                              │ SERVED   │
                              │ Đã phục vụ│
                              └──────────┘
```

💡 **Lưu ý:** Không cần if-else! State Pattern tự động xử lý chuyển trạng thái.

---

## 🍽️ LUỒNG HOẠT ĐỘNG ĐẦY ĐỦ

### Scenario: Khách vào nhà hàng và đặt món

```
1. Khách ngồi vào bàn số 1
   └─► POST /api/tables/1/occupy

2. Tạo đơn hàng cho bàn 1
   └─► POST /api/orders/table/1

3. Khách đặt món
   ├─► POST /api/orders/101/items (Phở Bò x2)
   └─► POST /api/orders/101/items (Cơm Rang x1)

4. Bếp nhận đơn và bắt đầu nấu
   ├─► PUT /api/orders/101/items/201/next-state (ORDERED → COOKING)
   └─► PUT /api/orders/101/items/202/next-state (ORDERED → COOKING)

5. Món nấu xong
   ├─► PUT /api/orders/101/items/201/next-state (COOKING → READY)
   └─► PUT /api/orders/101/items/202/next-state (COOKING → READY)

6. Phục vụ cho khách
   ├─► PUT /api/orders/101/items/201/next-state (READY → SERVED)
   └─► PUT /api/orders/101/items/202/next-state (READY → SERVED)

7. Khách thanh toán
   └─► POST /api/payments
       {
         "orderId": 101,
         "paymentMethod": "CASH",
         "amountPaid": 200000
       }

8. Khách rời bàn
   └─► PUT /api/tables/1/release
```

---

## 📋 DANH SÁCH API ENDPOINTS

### 🏠 Table Management
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/tables | Lấy danh sách tất cả bàn |
| GET | /api/tables/{id} | Lấy thông tin bàn |
| PUT | /api/tables/{id}/occupy | Đặt bàn (AVAILABLE → OCCUPIED) |
| PUT | /api/tables/{id}/release | Giải phóng bàn (OCCUPIED → AVAILABLE) |

### 📝 Order Management
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/orders/table/{id} | Tạo đơn hàng mới cho bàn |
| POST | /api/orders/{id}/items | Thêm món vào đơn hàng |
| GET | /api/orders/{id} | Xem chi tiết đơn hàng |
| GET | /api/orders/table/{id}/active | Lấy đơn hàng đang active của bàn |
| PUT | /api/orders/{id}/items/{itemId}/next-state | **Chuyển trạng thái món** ⭐ |
| DELETE | /api/orders/{id}/items/{itemId} | Xóa món khỏi đơn hàng |
| PUT | /api/orders/{id}/complete | Hoàn thành đơn hàng |

### 🍲 Menu Management
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/menu | Lấy danh sách menu |
| GET | /api/menu/available | Lấy món đang available |
| GET | /api/menu/{id} | Xem chi tiết món |
| POST | /api/menu | Thêm món mới |
| PUT | /api/menu/{id} | Cập nhật món |

### 💰 Payment Management
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/payments | Tạo thanh toán mới |
| GET | /api/payments/{id} | Xem chi tiết thanh toán |
| GET | /api/payments/order/{orderId} | Lấy thanh toán theo orderId |

---

## 🔑 CÁC TRẠNG THÁI QUAN TRỌNG

### 📊 Order Status
- `ACTIVE` - Đơn hàng đang hoạt động
- `COMPLETED` - Đơn hàng đã hoàn thành
- `CANCELLED` - Đơn hàng đã hủy

### 🍽️ Dish Status (State Pattern)
- `ORDERED` - Món vừa đặt
- `COOKING` - Đang nấu
- `READY` - Sẵn sàng phục vụ
- `SERVED` - Đã phục vụ

### 🪑 Table Status
- `AVAILABLE` - Bàn trống
- `OCCUPIED` - Bàn có khách
- `RESERVED` - Bàn đã đặt trước

### 💳 Payment Method
- `CASH` - Tiền mặt
- `BANK_TRANSFER` - Chuyển khoản
- `CREDIT_CARD` - Thẻ tín dụng

---

## 💡 TIPS & BEST PRACTICES

### ✅ DO's
1. **Luôn kiểm tra bàn trống trước khi tạo order**
   ```http
   GET /api/tables/1
   ```

2. **Sử dụng endpoint next-state để chuyển trạng thái món**
   ```http
   PUT /api/orders/{orderId}/items/{itemId}/next-state
   ```
   Không cần truyền trạng thái mới, API tự động chuyển!

3. **Kiểm tra đơn hàng active trước khi thêm món**
   ```http
   GET /api/orders/table/{tableId}/active
   ```

4. **Hoàn thành đơn hàng trước khi thanh toán**
   ```http
   PUT /api/orders/{id}/complete
   POST /api/payments
   ```

### ❌ DON'Ts
1. ❌ Không tạo nhiều order active cho cùng 1 bàn
2. ❌ Không giải phóng bàn khi đơn hàng chưa complete
3. ❌ Không thêm món khi order đã complete
4. ❌ Không cố gắng chuyển trạng thái món khi đã SERVED

---

## 🧪 TESTING VỚI POSTMAN/CURL

### Example 1: Tạo order và thêm món
```bash
# Tạo order
curl -X POST http://localhost:8080/api/orders/table/1

# Thêm món (orderId = 1)
curl -X POST http://localhost:8080/api/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{"menuItemId": 5, "quantity": 2}'

# Chuyển trạng thái (orderItemId = 1)
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state
```

### Example 2: Kiểm tra trạng thái bàn
```bash
# Xem tất cả bàn
curl http://localhost:8080/api/tables

# Xem bàn số 1
curl http://localhost:8080/api/tables/1

# Đặt bàn số 1
curl -X PUT http://localhost:8080/api/tables/1/occupy
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **ARCHITECTURE_DIAGRAM.md** - Kiến trúc chi tiết, Design Patterns
- **API_USAGE_GUIDE.md** - Hướng dẫn API đầy đủ với examples
- **application.properties** - Cấu hình database và server

---

## ⚙️ CONFIGURATION

### Database
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Server
```properties
server.port=8080
```

### CORS (Frontend connection)
```properties
# Đã cấu hình @CrossOrigin trong controllers
# Frontend có thể gọi API từ bất kỳ origin nào
```

---

## 🎯 KEY FEATURES

✅ **State Pattern** - Tự động chuyển trạng thái món ăn  
✅ **Strategy Pattern** - Linh hoạt phương thức thanh toán  
✅ **RESTful API** - Chuẩn REST, dễ tích hợp  
✅ **Transaction Management** - Đảm bảo tính toàn vẹn dữ liệu  
✅ **Exception Handling** - Xử lý lỗi chuyên nghiệp  
✅ **CORS Enabled** - Hỗ trợ frontend từ mọi origin  

---

**🚀 Ready to use! Chúc bạn phát triển thành công!**
