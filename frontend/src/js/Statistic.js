/**
 * frontend/src/js/Statistics.js
 * Module xử lý tính toán số liệu thống kê từ API
 */

const Statistics = {
    // Hàm khởi tạo, được gọi khi người dùng bấm vào tab Thống kê
    init: function() {
        console.log("Đang khởi tạo module Thống kê...");
        this.fetchAndCalculate();
    },

    // Hàm gọi khi bấm nút "Làm mới"
    refreshData: function() {
        // Hiệu ứng loading nhẹ
        document.getElementById('stat-revenue').innerText = '...';
        document.getElementById('stat-total-orders').innerText = '...';
        this.fetchAndCalculate();
    },

    // 1. Lấy dữ liệu từ Backend
    fetchAndCalculate: async function() {
        try {
            // API_ORDERS được định nghĩa trong api.js (http://localhost:8080/api/orders)
            // Nếu chưa có, đảm bảo api.js có dòng: const API_ORDERS = "http://localhost:8080/api/orders";
            const response = await fetch(API_ORDERS);
            
            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }

            const orders = await response.json();
            this.calculateMetrics(orders);

        } catch (error) {
            console.error("Lỗi khi tải thống kê:", error);
            alert("Không thể tải dữ liệu thống kê. Vui lòng kiểm tra kết nối Server.");
        }
    },

    // 2. Tính toán các chỉ số
    calculateMetrics: function(orders) {
        let totalRevenue = 0;       // Tổng doanh thu
        let totalOrders = orders.length; // Tổng số đơn
        let activeOrders = 0;       // Đơn đang phục vụ
        
        // Map dùng để đếm số lượng món: { "Phở Bò": 10, "Trà Đào": 5 }
        let dishFrequency = {}; 

        orders.forEach(order => {
            // --- TÍNH DOANH THU ---
            // Chỉ cộng tiền nếu đơn hàng đã Hoàn tất (COMPLETED) hoặc Bàn đã thanh toán (PAID)
            // Kiểm tra null safe bằng ?.
            const status = order.orderStatus;
            
            // Logic: Nếu order đã hoàn thành, hoặc (nếu có trường tableStatus) bàn đã trả tiền
            if (status === 'COMPLETED' || status === 'PAID') {
                totalRevenue += (order.totalAmount || 0);
            }

            // --- TÍNH ĐƠN ĐANG PHỤC VỤ ---
            // NEW (Mới gọi) hoặc IN_PROGRESS (Đang làm/Đã lên món nhưng chưa thanh toán)
            if (status === 'NEW' || status === 'IN_PROGRESS') {
                activeOrders++;
            }

            // --- TÌM MÓN BÁN CHẠY ---
            if (order.orderItems && Array.isArray(order.orderItems)) {
                order.orderItems.forEach(item => {
                    // Lấy tên món. Cần kiểm tra menuItem có tồn tại không
                    const dishName = item.menuItem ? item.menuItem.name : "Món đã xóa";
                    const qty = item.quantity || 0;

                    if (dishFrequency[dishName]) {
                        dishFrequency[dishName] += qty;
                    } else {
                        dishFrequency[dishName] = qty;
                    }
                });
            }
        });

        // Tìm món có số lượng cao nhất trong Map
        let bestSellerName = "Chưa có dữ liệu";
        let bestSellerQty = 0;

        for (const [name, qty] of Object.entries(dishFrequency)) {
            if (qty > bestSellerQty) {
                bestSellerQty = qty;
                bestSellerName = name;
            }
        }

        // Gửi dữ liệu đi hiển thị
        this.renderToView({
            revenue: totalRevenue,
            totalOrders: totalOrders,
            activeOrders: activeOrders,
            bestName: bestSellerName,
            bestQty: bestSellerQty
        });
    },

    // 3. Hiển thị lên giao diện HTML
    renderToView: function(data) {
        // Định dạng tiền tệ VNĐ (ví dụ: 150.000 ₫)
        const formatter = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        });

        // Gán vào các thẻ ID trong HTML
        const elRevenue = document.getElementById('stat-revenue');
        const elTotal = document.getElementById('stat-total-orders');
        const elActive = document.getElementById('stat-active-orders');
        const elBestName = document.getElementById('stat-best-seller');
        const elBestQty = document.getElementById('stat-best-seller-qty');

        if(elRevenue) elRevenue.innerText = formatter.format(data.revenue);
        if(elTotal) elTotal.innerText = data.totalOrders;
        if(elActive) elActive.innerText = data.activeOrders;
        
        if(elBestName) elBestName.innerText = data.bestName;
        if(elBestQty) elBestQty.innerText = `(${data.bestQty} lượt gọi)`;
    }
};

// Expose ra window để app.js có thể gọi
window.Statistics = Statistics;