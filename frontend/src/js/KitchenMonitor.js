const kitchenApp = {
    // --- CẤU HÌNH THỜI GIAN (Demo) ---
    WAITING_TIME_MS: 5000,    // 5 giây chờ (trước khi Bếp nhận đơn nấu)
    COOKING_TIME_MS: 30000,   // 30 giây nấu (đếm ngược)
    SERVING_TIME_MS: 15000,   // 15 giây chờ ở trạm "Sẵn sàng" trước khi chuyển thành "Đã lên món"
    
    intervalId: null,

    // Dữ liệu mẫu (Giả lập các món vừa được đặt từ POS)
    orders: [
        // Món 1: Vừa đặt xong (Trạng thái ORDERED)
        { id: 101, tableName: 'Bàn 2', dishName: 'Phở bò', qty: 2, status: 'ORDERED', createTime: Date.now(), cookStartTime: null, readyTime: null },
        
        // Món 2: Đã đặt 3 giây trước
        { id: 102, tableName: 'Bàn 4', dishName: 'Cơm tấm', qty: 1, status: 'ORDERED', createTime: Date.now() - 3000, cookStartTime: null, readyTime: null },
        
        // Món 3: Đang nấu dở (đã nấu được 10 giây)
        { id: 103, tableName: 'Bàn 1', dishName: 'Trà đào', qty: 3, status: 'COOKING', createTime: Date.now() - 15000, cookStartTime: Date.now() - 10000, readyTime: null },
    ],

    init() {
        this.renderBoard();
        this.startRealTimeLoop(); 
    },

    startRealTimeLoop() {
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(() => {
            const now = Date.now();
            let needReRender = false;

            this.orders.forEach(order => {
                const timerElement = document.getElementById(`timer-${order.id}`);
                const badgeElement = document.getElementById(`badge-${order.id}`);

                // --- 1. GIAI ĐOẠN "ORDER MỚI" (Chờ bếp tiếp nhận) ---
                if (order.status === 'ORDERED') {
                    const elapsed = now - order.createTime;
                    
                    if (timerElement) {
                        const waitSecs = Math.floor(elapsed / 1000);
                        timerElement.textContent = `Vừa đặt: ${waitSecs}s trước`;
                        timerElement.style.color = '#636e72';
                    }

                    // TỰ ĐỘNG -> COOKING sau 5s
                    if (elapsed >= this.WAITING_TIME_MS) {
                        order.status = 'COOKING';
                        order.cookStartTime = now;
                        needReRender = true;
                    }
                }

                // --- 2. GIAI ĐOẠN "ĐANG NẤU" (Đếm ngược 30s) ---
                else if (order.status === 'COOKING') {
                    const elapsed = now - order.cookStartTime;
                    const remaining = Math.max(0, Math.ceil((this.COOKING_TIME_MS - elapsed) / 1000));
                    
                    if (timerElement) {
                        timerElement.textContent = `Đang làm: còn ${remaining}s`;
                        timerElement.style.color = '#e67e22'; // Màu cam
                    }
                    if (badgeElement) {
                        badgeElement.className = 'status-badge cooking';
                        badgeElement.textContent = 'Đang làm';
                    }

                    // TỰ ĐỘNG -> READY sau 30s
                    if (elapsed >= this.COOKING_TIME_MS) {
                        order.status = 'READY';
                        order.readyTime = now;
                        needReRender = true;
                    }
                }

                // --- 3. GIAI ĐOẠN "SẴN SÀNG" & "ĐÃ LÊN MÓN" ---
                else if (order.status === 'READY') {
                    const elapsed = now - order.readyTime;
                    const elapsedSecs = Math.floor(elapsed / 1000);

                    // A. Trong 15s đầu: Hiện "Xong cách đây..."
                    if (elapsed < this.SERVING_TIME_MS) {
                        if (timerElement) {
                            timerElement.textContent = `Xong cách đây: ${elapsedSecs}s`;
                            timerElement.style.color = '#27ae60'; // Màu xanh lá
                        }
                        if (badgeElement) {
                            badgeElement.className = 'status-badge ready';
                            badgeElement.textContent = 'Sẵn sàng';
                        }
                    } 
                    // B. Sau 15s: Chuyển thành "Đã lên món"
                    else {
                        if (timerElement) {
                            timerElement.textContent = `Đã lên món cho khách`;
                            timerElement.style.color = '#2980b9'; // Màu xanh dương
                            timerElement.style.fontWeight = 'bold';
                        }
                        if (badgeElement) {
                            badgeElement.className = 'status-badge served';
                            badgeElement.textContent = 'Hoàn tất';
                            badgeElement.style.background = '#dff9fb';
                            badgeElement.style.color = '#2980b9';
                        }
                        
                        // (Tùy chọn) Nếu muốn ẩn luôn khỏi bảng sau 1 phút thì thêm logic ở đây
                    }
                }
            });

            // Vẽ lại bảng nếu có món chuyển cột (VD: từ Ordered -> Cooking -> Ready)
            if (needReRender) {
                this.renderBoard();
            }

        }, 1000);
    },

    renderBoard() {
        // Cột 1: Order Mới
        this.renderColumn('kitchen-ordered-list', this.orders.filter(i => i.status === 'ORDERED'));

        // Cột 2: Đang Nấu
        this.renderColumn('kitchen-cooking-list', this.orders.filter(i => i.status === 'COOKING'));

        // Cột 3: Sẵn Sàng (Bao gồm cả món vừa xong và món đã lên)
        this.renderColumn('kitchen-ready-list', this.orders.filter(i => i.status === 'READY'));
    },

    renderColumn(elementId, items) {
        const container = document.getElementById(elementId);
        if(!container) return;

        if (items.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#b2bec3; padding:20px;">(Trống)</div>`;
            return;
        }

        container.innerHTML = items.map(item => {
            // Xác định class badge ban đầu
            let badgeClass = 'status-badge';
            let badgeText = 'Chờ';
            
            if (item.status === 'COOKING') { 
                badgeClass += ' cooking'; 
                badgeText = 'Đang làm'; 
            } else if (item.status === 'READY') {
                // Logic hiển thị ban đầu (sẽ được update bởi startRealTimeLoop ngay lập tức)
                badgeClass += ' ready';
                badgeText = 'Sẵn sàng';
            }

            return `
            <div class="ticket" id="ticket-${item.id}">
                <div class="ticket-header">
                    <strong>${item.tableName}</strong>
                    <span id="badge-${item.id}" class="${badgeClass}">${badgeText}</span>
                </div>
                
                <div class="ticket-dish">
                    <h4>${item.dishName}</h4>
                    <span class="ticket-qty">x${item.qty}</span>
                </div>
                
                <div class="time-track" style="margin-top: 10px; border-top: 1px dashed #eee; padding-top: 8px;">
                    <i class='bx bx-time-five'></i> 
                    <span id="timer-${item.id}" style="font-weight: 600; font-size: 13px; margin-left: 5px;">
                        Đang cập nhật...
                    </span>
                </div>
            </div>
        `}).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('.kitchen-board')) {
        kitchenApp.init();
    }
});