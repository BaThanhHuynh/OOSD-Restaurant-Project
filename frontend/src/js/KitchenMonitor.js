/**
 * KITCHEN MONITOR (MÀN HÌNH BẾP - FIX KHỚP DATA)
 * File: frontend/src/js/KitchenMonitor.js
 */

const kitchenApp = {
    items: [],
    intervalId: null,

    init() {
        this.fetchData();
        this.startPolling();
    },

    startPolling() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            if(document.querySelector('.kitchen-board')) {
                this.fetchData();
            }
        }, 3000);
    },

    async fetchData() {
        try {
            // Gọi API lấy danh sách đơn đang làm
            const res = await fetch(`${API_ORDERS}/in-progress`);
            if (!res.ok) return;
            const orders = await res.json();
            this.processData(orders);
        } catch (e) {
            console.error("Lỗi kết nối bếp:", e);
        }
    },

    processData(orders) {
        const newItems = [];

        orders.forEach(order => {
            if (!order.orderItems) return;

            order.orderItems.forEach(item => {
                // [SỬA LỖI Ở ĐÂY]: Dùng item.dishStatus thay vì item.status
                const status = item.dishStatus; 

                if (['ORDERED', 'COOKING', 'READY'].includes(status)) {
                    newItems.push({
                        id: item.orderItemId, // Lưu ý: Backend bạn đặt là orderItemId
                        orderId: order.orderId, // Backend Order cũng dùng orderId
                        
                        tableName: order.table ? order.table.name : 'Mang về',
                        dishName: item.menuItem ? item.menuItem.name : 'Món ???',
                        qty: item.quantity,
                        status: status, // Lưu lại trạng thái để render cột
                        startTime: new Date(order.orderTime).getTime()
                    });
                }
            });
        });

        this.items = newItems;
        this.renderBoard();
    },

    renderBoard() {
        this.renderColumn('kitchen-ordered-list', this.items.filter(i => i.status === 'ORDERED'));
        this.renderColumn('kitchen-cooking-list', this.items.filter(i => i.status === 'COOKING'));
        this.renderColumn('kitchen-ready-list', this.items.filter(i => i.status === 'READY'));
    },

    renderColumn(elementId, items) {
        const container = document.getElementById(elementId);
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#b2bec3; padding:20px; font-style:italic;">(Trống)</div>`;
            return;
        }

        container.innerHTML = items.map(item => {
            const elapsedSeconds = Math.floor((Date.now() - item.startTime) / 1000);
            const timeDisplay = this.formatTime(elapsedSeconds);
            
            let badgeClass = 'status-badge';
            let badgeText = 'Chờ nấu';
            
            // Logic hiển thị màu và chữ
            if (item.status === 'COOKING') {
                badgeClass += ' cooking';
                badgeText = 'Đang nấu';
            } else if (item.status === 'READY') {
                badgeClass += ' ready';
                badgeText = 'Sẵn sàng';
            }

            // Sự kiện bấm để chuyển trạng thái
            const nextAction = `onclick="kitchenApp.updateItemStatus(${item.orderId}, ${item.id})"`;

            return `
            <div class="ticket" id="ticket-${item.id}" ${nextAction} style="cursor:pointer;" title="Chạm để chuyển trạng thái">
                <div class="ticket-header">
                    <strong>${item.tableName}</strong>
                    <span class="${badgeClass}">${badgeText}</span>
                </div>
                <div class="ticket-dish">
                    <h4 style="margin: 8px 0; color: #2d3436;">${item.dishName}</h4>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="ticket-qty" style="background:#2d3436; color:white; padding:2px 8px; border-radius:4px; font-weight:bold;">x${item.qty}</span>
                        <div class="time-track" style="font-size: 12px; color: #636e72;">
                            <i class='bx bx-time-five'></i> ${timeDisplay}
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    async updateItemStatus(orderId, orderItemId) {
        try {
            // Gọi API chuyển trạng thái (State Pattern)
            const res = await fetch(`${API_ORDERS}/${orderId}/items/${orderItemId}/next-state`, {
                method: 'PUT'
            });
            if (res.ok) {
                this.fetchData(); // Load lại ngay sau khi bấm
            } else {
                console.error("Lỗi cập nhật trạng thái");
            }
        } catch (e) {
            console.error("Lỗi kết nối:", e);
        }
    },

    formatTime(seconds) {
        if (seconds < 60) return `${seconds}s trước`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}p trước`;
    }
};

window.kitchenApp = kitchenApp;
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.kitchen-board')) {
        kitchenApp.init();
    }
});