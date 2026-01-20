# 📖 HƯỚNG DẪN SỬ DỤNG API - ORDER MANAGEMENT

> Hướng dẫn đơn giản và thực tế để sử dụng các API endpoints cho quản lý đơn hàng

---

## 🚀 QUICK START

### Base URL
```
http://localhost:8080/api/orders
```

### Yêu cầu
- Spring Boot đang chạy
- Database đã setup (hoặc dùng in-memory)
- Có sẵn Menu items và Tables

---

## 📋 MỤC LỤC

1. [Tạo Order](#1-tạo-order-cho-bàn)
2. [Thêm Món](#2-thêm-món-vào-order)
3. [Chuyển Trạng Thái](#3-chuyển-trạng-thái-món-ăn)
4. [Xem Order](#4-xem-thông-tin-order)
5. [Hoàn Thành Order](#5-hoàn-thành-order)

---

## 1. TẠO ORDER CHO BÀN

### 📍 Endpoint
```http
POST /api/orders/table/{tableId}
```

### 📝 Mô tả
Tạo order mới cho một bàn. Nếu bàn đã có order đang active, sẽ trả về order đó.

### 💻 Example với cURL

```bash
# Tạo order cho bàn số 5
curl -X POST http://localhost:8080/api/orders/table/5
```

### 💻 Example với Postman
- Method: `POST`
- URL: `http://localhost:8080/api/orders/table/5`
- Headers: Không cần
- Body: Không cần

---

## 2. THÊM MÓN VÀO ORDER

### 📍 Endpoint
```http
POST /api/orders/{orderId}/items
```

### 📝 Mô tả
Thêm một món ăn vào order với số lượng chỉ định.

### 💻 Example với cURL

```bash
# Thêm 2 phần Phở Bò (menuItemId = 1) vào order #1
curl -X POST http://localhost:8080/api/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "menuItemId": 1,
    "quantity": 2
  }'
```

### 💻 Example với Postman
- Method: `POST`
- URL: `http://localhost:8080/api/orders/1/items`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "menuItemId": 1,
  "quantity": 2
}
```
### 🔢 Thêm Nhiều Món Cùng Lúc

```bash
curl -X POST http://localhost:8080/api/orders/1/items/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"menuItemId": 1, "quantity": 2},
    {"menuItemId": 3, "quantity": 1},
    {"menuItemId": 5, "quantity": 3}
  ]'
```

---

## 3. CHUYỂN TRẠNG THÁI MÓN ĂN

> ⭐ **Đây là API quan trọng nhất - sử dụng State Pattern**

### 📍 Endpoint
```http
PUT /api/orders/{orderId}/items/{orderItemId}/next-state
```

### 📝 Mô tả
Chuyển món ăn sang trạng thái tiếp theo theo flow:
```
ORDERED → COOKING → READY → SERVED
```

### 💻 Example với cURL

```bash
# Chuyển món #1 trong order #1 sang trạng thái tiếp theo
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state
```

### 💻 Example với Postman
- Method: `PUT`
- URL: `http://localhost:8080/api/orders/1/items/1/next-state`
- Headers: Không cần
- Body: Không cần

### ✅ Response (Ví dụ: ORDERED → COOKING)
```json
{
  "orderId": 1,
  "orderItems": [
    {
      "orderItemId": 1,
      "menuItem": {
        "name": "Phở Bò"
      },
      "dishStatus": "COOKING"  // ✅ Đã chuyển từ ORDERED
    }
  ]
}
```

### 🔄 Quy Trình Hoàn Chỉnh

```bash
# 1. Khách vừa đặt món → ORDERED (tự động)

# 2. Bếp bắt đầu nấu → ORDERED → COOKING
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state

# 3. Món đã sẵn sàng → COOKING → READY
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state

# 4. Phục vụ cho khách → READY → SERVED
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state

# 5. Thử chuyển tiếp → SERVED (Không thay đổi - trạng thái cuối)
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state
```

### 🚀 Chuyển Tất Cả Món Cùng Lúc

```bash
# Chuyển TẤT CẢ các món trong order sang trạng thái tiếp theo
curl -X PUT http://localhost:8080/api/orders/1/items/next-state-all
```

---

## 4. XEM THÔNG TIN ORDER

### 📍 Lấy Order Theo ID

```bash
# Lấy chi tiết order #1
curl http://localhost:8080/api/orders/1
```

**Response:**
```json
{
  "orderId": 1,
  "table": {"id": 5, "name": "Bàn 5"},
  "orderItems": [
    {
      "orderItemId": 1,
      "menuItem": {"name": "Phở Bò", "price": 50000},
      "quantity": 2,
      "dishStatus": "COOKING"
    }
  ],
  "orderStatus": "IN_PROGRESS",
  "totalAmount": 100000.0
}
```

### 📍 Lấy Order Đang Active Của Bàn

```bash
# Lấy order đang active của bàn 5
curl http://localhost:8080/api/orders/table/5/active
```

### 📍 Lấy Tất Cả Orders Của Bàn

```bash
# Lấy tất cả orders (cả đã hoàn thành) của bàn 5
curl http://localhost:8080/api/orders/table/5
```

### 📍 Lấy Tất Cả Orders Đang Xử Lý

```bash
# Lấy tất cả orders đang IN_PROGRESS
curl http://localhost:8080/api/orders/in-progress
```

**Use case:** Màn hình bếp hiển thị tất cả orders đang được nấu.

---

## 5. HOÀN THÀNH ORDER

### 📍 Endpoint
```http
PUT /api/orders/{orderId}/complete
```

### 💻 Example

```bash
# Đánh dấu order #1 hoàn thành
curl -X PUT http://localhost:8080/api/orders/1/complete
```

### ✅ Response
```json
{
  "orderId": 1,
  "orderStatus": "COMPLETED",
  "completedTime": "2026-01-20T11:30:00"
}
```

---

## 6. XÓA MÓN / XÓA ORDER

### 🗑️ Xóa Một Món Khỏi Order

```bash
# Xóa món #1 khỏi order #1
curl -X DELETE http://localhost:8080/api/orders/1/items/1
```

### 🗑️ Xóa Toàn Bộ Order

```bash
# Xóa order #1
curl -X DELETE http://localhost:8080/api/orders/1
```

---

## 📊 USE CASE THỰC TẾ

### Kịch Bản 1: Khách Đặt Món và Theo Dõi

```bash
# Bước 1: Khách vào bàn 5 → Tạo order
curl -X POST http://localhost:8080/api/orders/table/5

# Response: orderId = 1

# Bước 2: Khách gọi 2 phần Phở Bò và 1 Cơm Gà
curl -X POST http://localhost:8080/api/orders/1/items/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"menuItemId": 1, "quantity": 2},
    {"menuItemId": 2, "quantity": 1}
  ]'

# Bước 3: Bếp nhận order → Bắt đầu nấu
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # Phở → COOKING
curl -X PUT http://localhost:8080/api/orders/1/items/2/next-state  # Cơm → COOKING

# Bước 4: Món đã sẵn sàng
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # Phở → READY

# Bước 5: Phục vụ món
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # Phở → SERVED

# Bước 6: Tất cả món đã phục vụ → Hoàn thành order
curl -X PUT http://localhost:8080/api/orders/1/complete
```

### Kịch Bản 2: Màn Hình Bếp

```bash
# Lấy tất cả orders đang cần nấu
curl http://localhost:8080/api/orders/in-progress

# Khi hoàn thành một món
curl -X PUT http://localhost:8080/api/orders/{orderId}/items/{itemId}/next-state
```

---

## 🧪 TESTING CHECKLIST

### ✅ Test Flow Hoàn Chỉnh

```bash
# 1. Tạo order
curl -X POST http://localhost:8080/api/orders/table/5

# 2. Thêm món
curl -X POST http://localhost:8080/api/orders/1/items \
  -H "Content-Type: application/json" \
  -d '{"menuItemId": 1, "quantity": 2}'

# 3. Kiểm tra order
curl http://localhost:8080/api/orders/1

# 4. Chuyển trạng thái 3 lần
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # COOKING
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # READY
curl -X PUT http://localhost:8080/api/orders/1/items/1/next-state  # SERVED

# 5. Hoàn thành
curl -X PUT http://localhost:8080/api/orders/1/complete
```

---

## 🔥 API CHEATSHEET

### Tạo & Quản Lý Order
```bash
POST   /api/orders/table/{tableId}              # Tạo order
GET    /api/orders/{orderId}                    # Xem order
GET    /api/orders/table/{tableId}/active       # Order active của bàn
GET    /api/orders/in-progress                  # Tất cả orders đang xử lý
PUT    /api/orders/{orderId}/complete           # Hoàn thành order
DELETE /api/orders/{orderId}                    # Xóa order
```

### Quản Lý Món Ăn
```bash
POST   /api/orders/{orderId}/items              # Thêm 1 món
POST   /api/orders/{orderId}/items/batch        # Thêm nhiều món
DELETE /api/orders/{orderId}/items/{itemId}     # Xóa món
```

### Chuyển Trạng Thái (State Pattern)
```bash
PUT    /api/orders/{orderId}/items/{itemId}/next-state     # Chuyển 1 món
PUT    /api/orders/{orderId}/items/next-state-all          # Chuyển tất cả
```

---

## 🎨 POSTMAN COLLECTION

### Import vào Postman

1. Tạo Collection mới: "Restaurant Order API"
2. Thêm các requests sau:

```
Restaurant Order API/
├── 1. Create Order for Table
│   POST http://localhost:8080/api/orders/table/5
│
├── 2. Add Item to Order
│   POST http://localhost:8080/api/orders/1/items
│   Body: {"menuItemId": 1, "quantity": 2}
│
├── 3. Change Item State (ORDERED → COOKING)
│   PUT http://localhost:8080/api/orders/1/items/1/next-state
│
├── 4. Get Order Details
│   GET http://localhost:8080/api/orders/1
│
└── 5. Complete Order
    PUT http://localhost:8080/api/orders/1/complete
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. State Pattern Flow
- Món ăn PHẢI đi theo thứ tự: ORDERED → COOKING → READY → SERVED
- Không thể skip state
- SERVED là trạng thái cuối, không thể chuyển tiếp

### 2. Order Status
- `NEW`: Order mới tạo, chưa có món
- `IN_PROGRESS`: Có ít nhất 1 món, chưa hoàn thành
- `COMPLETED`: Tất cả món đã SERVED hoặc đã gọi complete

### 3. Error Handling
- Nếu không tìm thấy resource → 404 Not Found
- Nếu data không hợp lệ → 400 Bad Request
- Success → 200 OK hoặc 201 Created

---

## 💡 TIPS & TRICKS

### Tip 1: Kiểm tra trạng thái hiện tại
```bash
# Trước khi chuyển state, xem món đang ở trạng thái nào
curl http://localhost:8080/api/orders/1 | grep dishStatus
```

### Tip 2: Sử dụng jq để format JSON
```bash
curl http://localhost:8080/api/orders/1 | jq
```

### Tip 3: Tạo script tự động
```bash
#!/bin/bash
# auto-order.sh

ORDER_ID=$(curl -X POST http://localhost:8080/api/orders/table/5 | jq -r '.orderId')
echo "Created order: $ORDER_ID"

curl -X POST http://localhost:8080/api/orders/$ORDER_ID/items \
  -H "Content-Type: application/json" \
  -d '{"menuItemId": 1, "quantity": 2}'
```

---

## 📞 SUPPORT

### Có vấn đề?

1. **API không hoạt động?**
   - Kiểm tra Spring Boot có đang chạy không
   - Check log: `tail -f logs/spring.log`

2. **404 Not Found?**
   - Kiểm tra ID có tồn tại không
   - Verify database có data không

3. **State không chuyển?**
   - Xem log để hiểu State Pattern đang làm gì
   - Kiểm tra dishStatus hiện tại

### Documentation khác
- [ORDER_SERVICE_API.md](ORDER_SERVICE_API.md) - API documentation đầy đủ
- [QUICK_START.md](QUICK_START.md) - Hướng dẫn nhanh
- [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) - Sơ đồ kiến trúc

---

**🎉 Chúc bạn sử dụng API thành công!**

**📅 Last Updated:** January 20, 2026  
**📧 Version:** 1.0.0
