/**
 * KITCHEN MONITOR (MÀN HÌNH BẾP - TỰ ĐỘNG HÓA)
 * File: frontend/src/js/KitchenMonitor.js
 * Cập nhật: Sửa lỗi tính giờ (dùng orderItemTime) & Hiển thị Note
 */

const kitchenApp = {
    items: [],
    intervalId: null,
    processingSet: new Set(), 

    config: {
        autoMode: true,     
        timeToStart: 10,    
        timeToCook: 20,     
        timeToServe: 15     
    },

    init() {
        console.log("Kitchen Monitor: Đã khởi động chế độ Tự động.");
        this.fetchData();
        this.startPolling();
    },

    startPolling() {
        if (this.intervalId) clearInterval(this.intervalId);
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
                    
                    // [LOGIC MỚI QUAN TRỌNG]
                    // Ưu tiên dùng item.orderItemTime (giờ gọi món).
                    // Nếu null (do dữ liệu cũ), fallback về order.orderTime (giờ mở bàn).
                    const timeSource = item.orderItemTime ? item.orderItemTime : order.orderTime;

                    newItems.push({
                        id: item.orderItemId, 
                        orderId: order.orderId,
                        tableName: order.table ? order.table.name : 'Mang về',
                        dishName: item.menuItem ? item.menuItem.name : 'Món ???',
                        qty: item.quantity,
                        status: status,
                        
                        // [CẬP NHẬT] Dùng timeSource đã xác định ở trên
                        startTime: new Date(timeSource).getTime(),
                        
                        note: item.note || '' 
                    });
                }
            });
        });

        this.items = newItems;
        this.renderBoard();
        
        if (this.config.autoMode) {
            this.autoProcessOrders();
        }
    },

    autoProcessOrders() {
        const now = Date.now();
        this.items.forEach(item => {
            const processKey = `${item.orderId}-${item.id}-${item.status}`;
            if (this.processingSet.has(processKey)) return;

            const elapsedSec = Math.floor((now - item.startTime) / 1000);

            if (item.status === 'ORDERED' && elapsedSec >= this.config.timeToStart) {
                this.triggerNextState(item, processKey);
            } else if (item.status === 'COOKING' && elapsedSec >= (this.config.timeToStart + this.config.timeToCook)) {
                this.triggerNextState(item, processKey);
            } else if (item.status === 'READY' && elapsedSec >= (this.config.timeToStart + this.config.timeToCook + this.config.timeToServe)) {
                this.triggerNextState(item, processKey);
            }
        });
    },

    async triggerNextState(item, processKey) {
        console.log(`Auto-Chef: Đang chuyển món ${item.dishName} (Bàn ${item.tableName}) sang bước tiếp theo...`);
        this.processingSet.add(processKey); 

        try {
            await this.updateItemStatus(item.orderId, item.id);
        } finally {
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

            const nextAction = `onclick="kitchenApp.updateItemStatus(${item.orderId}, ${item.id})"`;

            const noteHtml = item.note 
                ? `<div style="margin-top:5px; padding:4px 8px; background:#fff1f2; border:1px dashed #f43f5e; border-radius:4px; color:#e11d48; font-size:12px; font-weight:600;">
                     <i class='bx bx-note'></i> Note: ${item.note}
                   </div>` 
                : '';

            return `
            <div class="ticket" id="ticket-${item.id}" ${nextAction} style="cursor:pointer;" title="Tự động chuyển sau vài giây...">
                <div class="ticket-header">
                    <strong>${item.tableName}</strong>
                    <span class="${badgeClass}">${badgeText}</span>
                </div>
                <div class="ticket-dish">
                    <h4 style="margin: 8px 0; color: #2d3436;">${item.dishName}</h4>
                    
                    ${noteHtml} <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
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