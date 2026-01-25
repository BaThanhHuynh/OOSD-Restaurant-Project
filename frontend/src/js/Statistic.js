/**
 * frontend/src/js/Statistics.js
 * Module xử lý thống kê nâng cao
 */

const Statistics = {
    // Cờ kiểm tra đang tải
    isLoading: false,

    init: function() {
        console.log("Khởi tạo module Thống kê...");
        this.fetchAndCalculate();
    },

    refreshData: function() {
        if (this.isLoading) return;
        
        // Hiệu ứng UX khi refresh
        const btn = document.querySelector('.btn-refresh i');
        if(btn) btn.classList.add('fa-spin');
        
        this.fetchAndCalculate().finally(() => {
            if(btn) btn.classList.remove('fa-spin');
        });
    },

    fetchAndCalculate: async function() {
        this.isLoading = true;
        try {
            // API_ORDERS từ api.js
            const response = await fetch(API_ORDERS);
            if (!response.ok) throw new Error('Không thể tải dữ liệu đơn hàng');

            const orders = await response.json();
            
            // Xử lý dữ liệu
            this.processData(orders);

        } catch (error) {
            console.error("Lỗi thống kê:", error);
            document.getElementById('top-products-list').innerHTML = 
                `<p style="color:red; text-align:center;">Lỗi kết nối: ${error.message}</p>`;
        } finally {
            this.isLoading = false;
        }
    },

    processData: function(orders) {
        // --- 1. Tổng hợp chỉ số cơ bản ---
        let totalRevenue = 0;
        let activeOrdersCount = 0;
        let validOrdersCount = 0; // Đơn tính vào doanh thu (Đã xong/Đã trả)

        // Map tần suất món ăn
        let dishMap = {};

        orders.forEach(order => {
            const status = order.orderStatus; // NEW, IN_PROGRESS, COMPLETED, PAID, CANCELLED

            // Tính doanh thu (chỉ tính đơn đã hoàn tất/thanh toán)
            if (status === 'COMPLETED' || status === 'PAID') {
                totalRevenue += (order.totalAmount || 0);
                validOrdersCount++;
            }

            // Đếm đơn đang phục vụ
            if (status === 'NEW' || status === 'IN_PROGRESS' || status === 'COOKING' || status === 'READY' || status === 'SERVED') {
                activeOrdersCount++;
            }

            // Thống kê món ăn (tất cả các đơn trừ đơn hủy)
            if (status !== 'CANCELLED' && order.orderItems) {
                order.orderItems.forEach(item => {
                    const name = item.menuItem ? item.menuItem.name : "Món đã xóa";
                    const qty = item.quantity || 0;
                    dishMap[name] = (dishMap[name] || 0) + qty;
                });
            }
        });

        // Tính AOV (Giá trị trung bình đơn)
        const avgOrderValue = validOrdersCount > 0 ? (totalRevenue / validOrdersCount) : 0;

        // --- 2. Xử lý Top Món Ăn ---
        // Chuyển Map thành Array -> Sort giảm dần -> Lấy top 5
        const sortedDishes = Object.entries(dishMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        // --- 3. Lấy danh sách đơn gần đây (đảo ngược mảng để lấy mới nhất) ---
        // Copy mảng để không ảnh hưởng mảng gốc, sau đó reverse và lấy 6 đơn đầu
        const recentOrders = [...orders].reverse().slice(0, 6);

        // --- 4. Render ra View ---
        this.renderOverview({
            revenue: totalRevenue,
            totalOrders: orders.length, // Tổng tất cả các đơn trong DB
            active: activeOrdersCount,
            aov: avgOrderValue
        });

        this.renderTopProducts(sortedDishes);
        this.renderRecentOrders(recentOrders);
    },

    // Render 4 ô chỉ số
    renderOverview: function(data) {
        const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        
        const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.innerText = val;
        };

        setTxt('stat-revenue', fmt.format(data.revenue));
        setTxt('stat-orders', data.totalOrders);
        setTxt('stat-aov', fmt.format(data.aov));
        setTxt('stat-active', data.active);
    },

    // Render danh sách Top món ăn
    renderTopProducts: function(topList) {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        if (topList.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Chưa có dữ liệu món ăn</p>';
            return;
        }

        // Tìm số lượng lớn nhất để tính % cho thanh progress
        const maxQty = topList[0][1]; 

        let html = '';
        topList.forEach(([name, qty]) => {
            const percent = (qty / maxQty) * 100;
            html += `
                <div class="top-item">
                    <div class="rank-badge"><i class="fas fa-trophy"></i></div>
                    <div class="item-info">
                        <span class="item-name">${name}</span>
                        <div class="progress-bg">
                            <div class="progress-bar" style="width: ${percent}%"></div>
                        </div>
                    </div>
                    <div class="item-qty">${qty}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    // Render bảng đơn hàng gần đây
    renderRecentOrders: function(orders) {
        const container = document.getElementById('recent-orders-list');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<tr><td colspan="3" class="text-center">Chưa có đơn hàng</td></tr>';
            return;
        }

        const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        
        let html = '';
        orders.forEach(order => {
            let statusClass = 'st-new';
            let statusLabel = 'Mới';
            let color = '#3498db';

            switch(order.orderStatus) {
                case 'COMPLETED': 
                case 'PAID': 
                    statusClass = 'st-paid'; statusLabel = 'Đã xong'; color = '#27ae60'; 
                    break;
                case 'CANCELLED': 
                    statusClass = 'st-cancel'; statusLabel = 'Đã hủy'; color = '#e74c3c'; 
                    break;
                case 'IN_PROGRESS':
                case 'COOKING': 
                    statusClass = 'st-new'; statusLabel = 'Đang làm'; color = '#f39c12'; 
                    break;
            }

            html += `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td style="color: #2c3e50; font-weight:600;">${fmt.format(order.totalAmount || 0)}</td>
                    <td>
                        <span class="status-dot" style="background:${color}"></span>
                        <span style="color:${color}; font-size:12px; font-weight:600;">${statusLabel}</span>
                    </td>
                </tr>
            `;
        });
        container.innerHTML = html;
    }
};

window.Statistics = Statistics;