const kitchenApp = {
    orders: [
        { id: 101, tableName: 'Bàn 2', dishName: 'Phở bò', qty: 2, status: 'ORDERED', time: '10:30' },
        { id: 102, tableName: 'Bàn 4', dishName: 'Cơm tấm', qty: 1, status: 'COOKING', time: '10:35' },
        { id: 103, tableName: 'Bàn 1', dishName: 'Trà đào', qty: 3, status: 'READY', time: '10:28' },
    ],

    init() {
        this.renderBoard();
        this.bindEvents();
    },

    renderBoard() {
        this.renderColumn(
            'kitchen-ordered-list',
            this.orders.filter(i => i.status === 'ORDERED'),
            'COOKING',
            'Nấu ngay'
        );

        this.renderColumn(
            'kitchen-cooking-list',
            this.orders.filter(i => i.status === 'COOKING'),
            'READY',
            'Hoàn tất'
        );

        this.renderColumn(
            'kitchen-ready-list',
            this.orders.filter(i => i.status === 'READY'),
            'SERVED',
            'Đã phục vụ'
        );
    },

    renderColumn(elementId, items, nextStatus, btnLabel) {
        const container = document.getElementById(elementId);
        container.innerHTML = items.map(item => `
            <div class="ticket">
                <div class="ticket-header">
                    <strong>${item.tableName}</strong>
                    <span>${item.time}</span>
                </div>
                <h4>
                    ${item.dishName}
                    <span class="qty">x${item.qty}</span>
                </h4>
                <button 
                    class="action-btn"
                    data-id="${item.id}"
                    data-status="${nextStatus}">
                    ${btnLabel} <i class='bx bx-right-arrow-alt'></i>
                </button>
            </div>
        `).join('');
    },

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.action-btn');
            if (!btn) return;

            const id = Number(btn.dataset.id);
            const status = btn.dataset.status;
            this.updateStatus(id, status);
        });
    },

    updateStatus(itemId, newStatus) {
        console.log(`Update item ${itemId} → ${newStatus}`);

        const item = this.orders.find(i => i.id === itemId);
        if (!item) return;

        if (newStatus === 'SERVED') {
            this.orders = this.orders.filter(i => i.id !== itemId);
        } else {
            item.status = newStatus;
        }

        this.renderBoard();
    }
};

// Khởi động app
document.addEventListener('DOMContentLoaded', () => kitchenApp.init());