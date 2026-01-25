/**
 * KITCHEN MONITOR (MÀN HÌNH BẾP - TỰ ĐỘNG HÓA)
 * File: frontend/src/js/KitchenMonitor.js
 */

const kitchenApp = {
    items: [],
    intervalId: null,
    processingSet: new Set(), // Để tránh gọi API trùng lặp cho cùng 1 món

    // --- CẤU HÌNH THỜI GIAN TỰ ĐỘNG (Đơn vị: Giây) ---
    config: {
        autoMode: true,     // Bật/tắt chế độ tự động
        timeToStart: 10,    // Sau bao lâu thì chuyển từ ORDERED -> COOKING
        timeToCook: 20,     // Nấu trong bao lâu thì chuyển từ COOKING -> READY
        timeToServe: 15     // Để ở trạng thái READY bao lâu thì biến mất (SERVED)
    },

    init() {
        console.log("Kitchen Monitor: Đã khởi động chế độ Tự động.");
        this.fetchData();
        this.startPolling();
    },

    startPolling() {
        if (this.intervalId) clearInterval(this.intervalId);
        // Polling mỗi 2 giây để cập nhật nhanh hơn
        this.intervalId = setInterval(() => {
            if(document.querySelector('.kitchen-board')) {
                this.fetchData();
            }
        }, 2000);
    },

    async fetchData() {
        try {
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
                const status = item.dishStatus; 
                if (['ORDERED', 'COOKING', 'READY'].includes(status)) {
                    newItems.push({
                        id: item.orderItemId, 
                        orderId: order.orderId,
                        tableName: order.table ? order.table.name : 'Mang về',
                        dishName: item.menuItem ? item.menuItem.name : 'Món ???',
                        qty: item.quantity,
                        status: status,
                        // Tính thời gian từ lúc order được tạo
                        startTime: new Date(order.orderTime).getTime()
                    });
                }
            });
        });

        this.items = newItems;
        this.renderBoard();
        
        // Kích hoạt logic tự động nếu được bật
        if (this.config.autoMode) {
            this.autoProcessOrders();
        }
    },

    // --- LOGIC TỰ ĐỘNG CHUYỂN TRẠNG THÁI ---
    autoProcessOrders() {
        const now = Date.now();

        this.items.forEach(item => {
            // Tạo ID duy nhất để không xử lý 1 món 2 lần cùng lúc
            const processKey = `${item.orderId}-${item.id}-${item.status}`;
            if (this.processingSet.has(processKey)) return;

            // Tính số giây đã trôi qua từ lúc tạo Order
            const elapsedSec = Math.floor((now - item.startTime) / 1000);

            // Logic chuyển trạng thái dựa trên tổng thời gian trôi qua
            // 1. Nếu đang ORDERED và đã qua thời gian chờ -> Chuyển sang COOKING
            if (item.status === 'ORDERED' && elapsedSec >= this.config.timeToStart) {
                this.triggerNextState(item, processKey);
            }
            
            // 2. Nếu đang COOKING và tổng thời gian >= (thời gian chờ + thời gian nấu) -> READY
            // Ví dụ: Chờ 10s, Nấu 20s. Tổng 30s thì xong.
            else if (item.status === 'COOKING' && elapsedSec >= (this.config.timeToStart + this.config.timeToCook)) {
                this.triggerNextState(item, processKey);
            }

            // 3. Nếu đang READY và đã để đó đủ lâu -> SERVED (Xong)
            else if (item.status === 'READY' && elapsedSec >= (this.config.timeToStart + this.config.timeToCook + this.config.timeToServe)) {
                this.triggerNextState(item, processKey);
            }
        });
    },

    async triggerNextState(item, processKey) {
        console.log(`Auto-Chef: Đang chuyển món ${item.dishName} (Bàn ${item.tableName}) sang bước tiếp theo...`);
        this.processingSet.add(processKey); // Đánh dấu đang xử lý

        try {
            await this.updateItemStatus(item.orderId, item.id);
        } finally {
            // Xóa đánh dấu sau 1 khoảng thời gian ngắn để đảm bảo API đã xong
            setTimeout(() => {
                this.processingSet.delete(processKey);
            }, 2000);
        }
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
            
            if (item.status === 'COOKING') {
                badgeClass += ' cooking';
                badgeText = 'Đang nấu';
            } else if (item.status === 'READY') {
                badgeClass += ' ready';
                badgeText = 'Sẵn sàng';
            }

            // Vẫn giữ sự kiện click nếu muốn can thiệp thủ công
            const nextAction = `onclick="kitchenApp.updateItemStatus(${item.orderId}, ${item.id})"`;

            return `
            <div class="ticket" id="ticket-${item.id}" ${nextAction} style="cursor:pointer;" title="Tự động chuyển sau vài giây...">
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
                    <div style="height:4px; background:#dfe6e9; margin-top:8px; border-radius:2px; overflow:hidden;">
                        <div style="height:100%; background:#0984e3; width: ${ (elapsedSeconds % 60) * 10 }%; transition: width 1s linear;"></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    async updateItemStatus(orderId, orderItemId) {
        try {
            const res = await fetch(`${API_ORDERS}/${orderId}/items/${orderItemId}/next-state`, {
                method: 'PUT'
            });
            if (res.ok) {
                // Không cần gọi fetchData ngay lập tức vì vòng lặp polling sẽ lo việc đó
                // nhưng gọi luôn để phản hồi nhanh trên UI nếu click tay
                this.fetchData(); 
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