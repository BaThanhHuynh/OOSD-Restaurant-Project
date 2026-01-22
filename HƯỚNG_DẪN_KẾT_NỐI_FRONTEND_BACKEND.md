# 🔌 HƯỚNG DẪN KẾT NỐI FRONTEND VỚI BACKEND

## ✅ Cấu hình hiện tại (ĐÃ SẴN SÀNG)

### Backend Configuration
- **Port**: 8080
- **Base URL**: `http://localhost:8080/api`
- **CORS**: Đã được cấu hình với `@CrossOrigin(origins = "*")` trên tất cả controllers
- **Database**: MySQL tại `localhost:3306/restaurant_db`

### Frontend Configuration
- **API Base URL**: `http://localhost:8080/api` (trong file [frontend/src/js/api.js](frontend/src/js/api.js))
- **Endpoints**:
  - Menu: `http://localhost:8080/api/menu`
  - Orders: `http://localhost:8080/api/orders`
  - Tables: `http://localhost:8080/api/tables`
  - Payment: `http://localhost:8080/api/payment`

---

## 🚀 CÁC BƯỚC KHỞI CHẠY

### Bước 1: Khởi động MySQL Database

1. **Mở XAMPP Control Panel**
2. **Start MySQL** (nút Start bên cạnh MySQL)
3. **Kiểm tra database**:
   - Mở phpMyAdmin: http://localhost/phpmyadmin
   - Đảm bảo database tên `restaurant_db` đã tồn tại
   - Nếu chưa có, tạo database mới:
     ```sql
     CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

### Bước 2: Khởi động Backend Spring Boot

**Cách 1: Dùng Maven (Khuyến nghị)**
```powershell
cd "d:\DEV\JAVA\UTH\OOSD\OOSD-Restaurant-Project\backend"
mvn spring-boot:run
```

**Cách 2: Dùng IDE (IntelliJ IDEA / Eclipse)**
- Mở project backend trong IDE
- Chạy file `RestaurantApplication.java`
- Backend sẽ khởi động tại: http://localhost:8080

**Kiểm tra backend đang chạy:**
- Mở trình duyệt và truy cập: http://localhost:8080/api/menu
- Hoặc dùng lệnh:
  ```powershell
  curl http://localhost:8080/api/menu
  ```

**⚠️ Lưu ý quan trọng:**
- Backend phải chạy **liên tục** khi sử dụng frontend
- Cửa sổ terminal/console phải được giữ mở
- Nếu thấy lỗi, kiểm tra:
  - MySQL đã chạy chưa?
  - Port 8080 có bị chiếm bởi ứng dụng khác không?
  - Database `restaurant_db` đã được tạo chưa?

### Bước 3: Khởi động Frontend

**Cách 1: Dùng Live Server Extension (VS Code) - KHUYẾN NGHỊ**
1. Cài đặt extension "Live Server" trong VS Code
2. Mở file [frontend/index.html](frontend/index.html)
3. Click chuột phải → chọn "Open with Live Server"
4. Frontend sẽ mở tại: http://127.0.0.1:5500/frontend/index.html

**Cách 2: Mở trực tiếp file HTML**
1. Vào thư mục `frontend`
2. Double-click file `index.html`
3. Trang sẽ mở trong trình duyệt

**Cách 3: Dùng Python HTTP Server**
```powershell
cd "d:\DEV\JAVA\UTH\OOSD\OOSD-Restaurant-Project\frontend"
python -m http.server 8000
```
Truy cập: http://localhost:8000

**Cách 4: Dùng Node.js http-server**
```powershell
cd "d:\DEV\JAVA\UTH\OOSD\OOSD-Restaurant-Project\frontend"
npx http-server -p 8000
```
Truy cập: http://localhost:8000

---

## 🧪 KIỂM TRA KẾT NỐI

### 1. Test Backend API

Mở trình duyệt và thử các endpoint sau:

```
✅ GET Menu Items:
http://localhost:8080/api/menu

✅ GET All Tables:
http://localhost:8080/api/tables

✅ GET All Orders:
http://localhost:8080/api/orders
```

Hoặc dùng PowerShell:
```powershell
# Test menu endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/menu" -Method GET

# Test tables endpoint
Invoke-RestMethod -Uri "http://localhost:8080/api/tables" -Method GET
```

### 2. Kiểm tra Console trong Frontend

1. Mở frontend trong trình duyệt
2. Nhấn `F12` để mở Developer Tools
3. Vào tab **Console**
4. Kiểm tra:
   - ✅ Không có lỗi CORS
   - ✅ Không có lỗi 404 (Not Found)
   - ✅ Không có lỗi kết nối

### 3. Kiểm tra Network Requests

1. Trong Developer Tools, vào tab **Network**
2. Thao tác trên frontend (load menu, tạo order, v.v.)
3. Xem các request gửi đến:
   - Status Code phải là `200 OK`
   - Response phải có data

---

## ❌ TROUBLESHOOTING - Xử lý lỗi thường gặp

### Lỗi 1: "Failed to fetch" hoặc "Network Error"

**Nguyên nhân**: Backend chưa chạy hoặc URL sai

**Giải pháp**:
1. Kiểm tra backend có đang chạy không (terminal phải hiển thị "Started RestaurantApplication")
2. Kiểm tra URL trong [frontend/src/js/api.js](frontend/src/js/api.js):
   ```javascript
   const API_BASE_URL = "http://localhost:8080/api";
   ```
3. Test trực tiếp: http://localhost:8080/api/menu trong trình duyệt

### Lỗi 2: CORS Error

**Lỗi hiển thị**:
```
Access to fetch at 'http://localhost:8080/api/menu' from origin 'null' 
has been blocked by CORS policy
```

**Giải pháp**:
✅ **Đã được fix sẵn** - Tất cả controllers đã có `@CrossOrigin(origins = "*")`

Nếu vẫn gặp lỗi:
1. Restart backend
2. Dùng Live Server thay vì mở file HTML trực tiếp
3. Xóa cache trình duyệt (Ctrl + Shift + Delete)

### Lỗi 3: Backend không khởi động được

**Lỗi**: `Communications link failure` hoặc `Unknown database 'restaurant_db'`

**Giải pháp**:
1. **Kiểm tra MySQL đã chạy**: Mở XAMPP, nhấn Start MySQL
2. **Tạo database**:
   ```sql
   CREATE DATABASE restaurant_db;
   ```
3. **Kiểm tra kết nối** trong [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
   spring.datasource.username=root
   spring.datasource.password=
   ```

### Lỗi 4: Port 8080 đã được sử dụng

**Lỗi**: `Port 8080 was already in use`

**Giải pháp**:
```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process (thay <PID> bằng số Process ID)
taskkill /PID <PID> /F
```

Hoặc đổi port trong [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
```properties
server.port=8081
```
Nhớ cập nhật frontend [frontend/src/js/api.js](frontend/src/js/api.js):
```javascript
const API_BASE_URL = "http://localhost:8081/api";
```

### Lỗi 5: Maven không được nhận diện

**Lỗi**: `mvn : The term 'mvn' is not recognized`

**Giải pháp**:
1. **Cài đặt Maven**: https://maven.apache.org/download.cgi
2. **Thêm Maven vào PATH**:
   - System Properties → Environment Variables
   - Thêm Maven bin folder vào PATH
3. **Hoặc dùng Maven Wrapper**:
   ```powershell
   cd backend
   .\mvnw spring-boot:run
   ```

---

## 📊 KIẾN TRÚC KẾT NỐI

```
┌─────────────────┐
│   Frontend      │
│   (HTML/JS)     │
│   Port: 5500    │
└────────┬────────┘
         │
         │ HTTP Requests
         │ (AJAX/Fetch API)
         ▼
┌─────────────────┐
│   Backend       │
│  Spring Boot    │
│   Port: 8080    │
└────────┬────────┘
         │
         │ JDBC
         ▼
┌─────────────────┐
│     MySQL       │
│   Database      │
│   Port: 3306    │
└─────────────────┘
```

---

## 📝 ENDPOINTS API CÓ SẴN

### Menu API (`/api/menu`)
- `GET /api/menu` - Lấy tất cả món ăn
- `GET /api/menu/{id}` - Lấy món ăn theo ID
- `POST /api/menu` - Thêm món ăn mới
- `DELETE /api/menu/{id}` - Xóa món ăn

### Orders API (`/api/orders`)
- `GET /api/orders` - Lấy tất cả orders
- `GET /api/orders/{id}` - Lấy order theo ID
- `POST /api/orders` - Tạo order mới
- `PUT /api/orders/{id}/next-state` - Chuyển trạng thái order

### Tables API (`/api/tables`)
- `GET /api/tables` - Lấy tất cả bàn
- `GET /api/tables/{id}` - Lấy bàn theo ID
- `PUT /api/tables/{id}/status` - Cập nhật trạng thái bàn

### Payment API (`/api/payment`)
- `POST /api/payment/{orderId}` - Thanh toán order

---

## ✨ DEMO WORKFLOW

1. **Start XAMPP** → MySQL running ✅
2. **Run backend**: `mvn spring-boot:run` → Backend at :8080 ✅
3. **Open frontend**: Live Server → Frontend at :5500 ✅
4. **Test flow**:
   - Mở trang menu → Load món ăn từ API
   - Tạo order → POST request đến backend
   - Xem orders → GET request từ backend
   - Thanh toán → POST payment request

---

## 🔍 LOG MẪU KHI CHẠY THÀNH CÔNG

**Backend Console (Spring Boot):**
```
Started RestaurantApplication in 5.234 seconds (JVM running for 5.789)
```

**Frontend Console (Browser F12):**
```
✅ No errors
✅ API calls returning 200 OK
✅ Data displaying correctly
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra tất cả 3 services đang chạy (MySQL, Backend, Frontend)
2. Xem logs trong terminal và browser console
3. Test từng endpoint riêng lẻ
4. Đọc kỹ các file hướng dẫn trong thư mục `backend/`

**Files hướng dẫn khác:**
- [backend/HƯỚNG DẪN SỬ DỤNG API.md](backend/HƯỚNG%20DẪN%20SỬ%20DỤNG%20API.md)
- [backend/THÔNG TIN CHI TIẾT CÁC RESPON.md](backend/THÔNG%20TIN%20CHI%20TIẾT%20CÁC%20RESPON.md)
- [backend/ARCHITECTURE_DIAGRAM.md](backend/ARCHITECTURE_DIAGRAM.md)

---

**🎉 Chúc bạn thành công!**
