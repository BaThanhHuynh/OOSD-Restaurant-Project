/**
 * TABLE MANAGER LOGIC
 * File: frontend/src/js/TableManager.js
 * Mô tả: Quản lý trạng thái bàn, mở bàn, xem chi tiết và xử lý thanh toán.
 * Cập nhật: Fix lỗi thanh toán ảo & Phản hồi UI tức thì.
 */

const tableManager = {
    tables: [],
    currentTableId: null,
    currentTableName: null,
    currentOrderTotal: 0, 

    // ============================================================
    // KHỞI TẠO VÀ TẢI DANH SÁCH BÀN
    // ============================================================

    init: async function() {
        if (document.querySelector('.table-grid-container')) {
            await this.loadTables();
        }
    },

    // 1. Tải danh sách bàn từ API
    loadTables: async function() {
        try {
            const res = await fetch(API_TABLES);
            if (!res.ok) throw new Error("Lỗi tải danh sách bàn");
            this.tables = await res.json();
            this.renderTables();
        } catch (error) {
            console.error(error);
            const container = document.querySelector('.table-grid-container');
            if(container) container.innerHTML = `<p style="color:red; text-align:center;">Mất kết nối server!</p>`;
        }
    },

    // 2. Render giao diện lưới bàn
    renderTables: function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        if (this.tables.length === 0) {
            container.innerHTML = `<p style="text-align:center; width:100%;">Chưa có bàn nào.</p>`;
            return;
        }

        container.innerHTML = this.tables.map(table => {
            const statusRaw = table.status ? table.status.toUpperCase() : 'AVAILABLE';
            const isOccupied = (statusRaw === 'OCCUPIED');

            let statusClass = isOccupied ? 'occupied' : 'available';
            let statusText = isOccupied ? 'Đang phục vụ' : 'Bàn trống';
            
            // Logic click: 
            let clickEvent = isOccupied 
                ? `tableManager.openDetailModal(${table.id}, '${table.name}')`
                : `tableManager.openGuestModal(${table.id}, '${table.name}')`;

            return `
                <div class="table-card ${statusClass}" onclick="${clickEvent}">
                    <div class="table-icon"><i class='bx bx-dish'></i></div>
                    <h3 class="table-name">${table.name}</h3>
                    <span class="table-status">${statusText}</span>
                </div>
            `;
        }).join('');
    },

    // ============================================================
    // LOGIC 1: MỞ BÀN (NHẬP SỐ LƯỢNG KHÁCH)
    // ============================================================

    openGuestModal: function(id, name) {
        this.currentTableId = id;
        this.currentTableName = name;
        const input = document.getElementById('guest-count-input');
        if(input) { input.value = 1; input.focus(); }
        document.getElementById('guest-modal').style.display = 'flex';
    },

    closeGuestModal: function() {
        document.getElementById('guest-modal').style.display = 'none';
        this.currentTableId = null;
    },

    confirmOpenTable: async function() {
        const guests = document.getElementById('guest-count-input').value;
        if (guests < 1) { alert("Số lượng khách không hợp lệ"); return; }

        const tableId = this.currentTableId;
        const tableName = this.currentTableName;

        try {
            const res = await fetch(`${API_TABLES}/${tableId}/status?status=occupied`, { method: 'PUT' });
            
            if (res.ok) {
                this.closeGuestModal();
                await this.loadTables(); 
                this.openDetailModal(tableId, tableName);
            } else { 
                alert("Lỗi mở bàn! Vui lòng thử lại."); 
            }
        } catch (e) { 
            console.error(e); 
            alert("Lỗi kết nối đến server!"); 
        }
    },

    goToPosPage: function(id, name) {
        if (!id) { alert("⚠️ Lỗi: Không xác định được bàn!"); return; }

        localStorage.setItem('activeTableId', id);
        localStorage.setItem('activeTableName', name);
        localStorage.setItem('activeTableNumber', name.replace('Bàn ', ''));
        localStorage.setItem('isViewOnly', 'false');

        if (window.app) {
            app.loadPage('pos-page', 'nav-pos');
            if(window.menuApp) window.menuApp.updateHeaderTableInfo();
        }
    },

    // ============================================================
    // LOGIC 2: CHI TIẾT BÀN & DANH SÁCH MÓN ĐÃ GỌI
    // ============================================================

    openDetailModal: async function(tableId, tableName) {
        this.currentTableId = tableId;
        this.currentTableName = tableName;

        document.getElementById('detail-modal-title').innerText = `Chi tiết ${tableName}`;
        const modal = document.getElementById('table-detail-modal');
        const listBody = document.getElementById('detail-order-list');
        const emptyMsg = document.getElementById('detail-empty-msg');
        const totalSpan = document.getElementById('detail-total-amount');

        // Reset UI
        listBody.innerHTML = '';
        emptyMsg.style.display = 'none';
        totalSpan.innerText = '0 ₫';
        modal.style.display = 'flex';

        try {
            const res = await fetch(`${API_ORDERS}/table/${tableId}/active`);
            if (res.ok) {
                const order = await res.json();
                this.renderDetailItems(order, listBody, totalSpan);
                this.currentOrderTotal = order.totalAmount || 0;
            } else {
                emptyMsg.style.display = 'block';
                this.currentOrderTotal = 0;
            }
        } catch (e) {
            console.error(e);
            listBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Lỗi tải dữ liệu order</td></tr>`;
        }

        const btnOrder = document.getElementById('btn-detail-order');
        if(btnOrder) btnOrder.onclick = () => {
            this.closeDetailModal();
            this.goToPosPage(tableId, tableName);
        };
        
        const btnPay = document.getElementById('btn-detail-pay');
        if(btnPay) btnPay.onclick = () => {
            this.closeDetailModal();
            this.openPaymentModal(tableId, tableName);
        };
    },

    closeDetailModal: function() {
        document.getElementById('table-detail-modal').style.display = 'none';
    },

    renderDetailItems: function(order, container, totalElement) {
        const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        
        if (!order || !order.orderItems || order.orderItems.length === 0) {
            if(totalElement) totalElement.innerText = '0 ₫';
            return;
        }

        const html = order.orderItems.map(item => {
            const itemName = item.menuItem ? item.menuItem.name : 'Món đã xóa';
            const itemPrice = item.menuItem ? item.menuItem.price : 0;
            const itemTotal = itemPrice * item.quantity;
            
            let statusBadge = '';
            const dStatus = item.dishStatus || item.status; 
            if(dStatus === 'COOKING') statusBadge = '<br><span style="color:orange; font-size:11px;">(Đang nấu)</span>';
            if(dStatus === 'READY') statusBadge = '<br><span style="color:green; font-size:11px;">(Đã xong)</span>';
            if(dStatus === 'SERVED') statusBadge = '<br><span style="color:#888; font-size:11px;">(Đã phục vụ)</span>';

            return `
                <tr>
                    <td><b>${itemName}</b>${statusBadge}<br><small style="color:#64748b">${fmt.format(itemPrice)}</small></td>
                    <td style="text-align: center;">x${item.quantity}</td>
                    <td style="text-align: right; font-weight:bold;">${fmt.format(itemTotal)}</td>
                </tr>
            `;
        }).join('');

        if(container) container.innerHTML = html;
        if(totalElement) totalElement.innerText = fmt.format(order.totalAmount || 0);
    },

    // ============================================================
    // LOGIC 3: THANH TOÁN (CẬP NHẬT MỚI & UI TỨC THÌ)
    // ============================================================

    openPaymentModal: async function(id, name) {
        this.currentTableId = id;
        this.currentTableName = name; // Cập nhật tên bàn hiện tại
        
        this.currentOrderTotal = 0; 
        document.getElementById('modal-total-display').innerText = '...';
        const checkoutItems = document.getElementById('checkout-order-items');
        if(checkoutItems) checkoutItems.innerHTML = '';

        const modal = document.getElementById('checkout-modal');
        if(modal) {
            modal.style.display = 'flex';
            document.getElementById('modal-table-num').innerText = name.replace('Bàn ', '');

            try {
                const res = await fetch(`${API_ORDERS}/table/${id}/active`);
                if (res.ok) {
                    const order = await res.json();
                    this.currentOrderTotal = order.totalAmount || 0;
                    this.renderCheckoutList(order);
                } else {
                    if(checkoutItems) checkoutItems.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px;">Chưa có món để thanh toán</td></tr>';
                }
            } catch (e) {
                console.error(e);
                if(checkoutItems) checkoutItems.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Lỗi tải dữ liệu</td></tr>';
            }

            const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
            document.getElementById('modal-total-display').innerText = fmt.format(this.currentOrderTotal);

            const cashBtn = document.querySelector('.pay-method[data-method="CASH"]');
            if(cashBtn) this.selectMethod(cashBtn);
        }
    },

    renderCheckoutList: function(order) {
        const container = document.getElementById('checkout-order-items');
        if (!container) return;
        const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        
        if (!order.orderItems || order.orderItems.length === 0) {
            container.innerHTML = '<tr><td colspan="3" style="text-align:center;">Không có món</td></tr>';
            return;
        }
        
        container.innerHTML = order.orderItems.map(item => `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #f1f5f9;">
                    <div style="font-weight:600; font-size:14px;">${item.menuItem.name}</div>
                </td>
                <td style="text-align:center; padding:10px; border-bottom:1px solid #f1f5f9; font-weight:bold;">x${item.quantity}</td>
                <td style="text-align:right; padding:10px; border-bottom:1px solid #f1f5f9;">${fmt.format(item.menuItem.price * item.quantity)}</td>
            </tr>
        `).join('');
    },

    closeModal: function() {
        document.getElementById('checkout-modal').style.display = 'none';
    },

    selectMethod: function(btn) {
        document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const method = btn.getAttribute('data-method');
        const qrSection = document.getElementById('qr-payment-section');
        const scrollContainer = document.getElementById('checkout-body'); 

        if (qrSection) {
            if (method === 'QR') {
                qrSection.style.display = 'block';
                if(scrollContainer) {
                    setTimeout(() => {
                        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
                    }, 100);
                }
            } else {
                qrSection.style.display = 'none';
            }
        }
    },

    confirmCheckout: async function() {
        if (!this.currentTableId) return;
        
        // Chặn thanh toán nếu chưa có dữ liệu đơn hàng hoặc tiền = 0
        if (!this.currentOrderTotal || this.currentOrderTotal <= 0) {
            alert("⚠️ Không tìm thấy đơn hàng hoặc tổng tiền bằng 0. Vui lòng kiểm tra lại!");
            return;
        }

        const activeBtn = document.querySelector('.pay-method.active');
        const method = activeBtn ? activeBtn.getAttribute('data-method') : 'CASH';

        if (!confirm(`Xác nhận thanh toán và hoàn tất bàn này? (${method})`)) return;

        try {
            const paymentData = {
                tableId: this.currentTableId,
                amount: this.currentOrderTotal,
                method: method 
            };

            // Gọi API
            const res = await fetch(`${API_PAYMENT}/pay`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paymentData)
            });

            if (res.ok) {
                alert("✅ Thanh toán thành công!");

                // --- 1. CLEANUP STORAGE ---
                localStorage.removeItem('cart'); 
                localStorage.removeItem('currentOrder');
                localStorage.removeItem('activeTableId');
                localStorage.removeItem('activeTableName');
                localStorage.removeItem('activeTableNumber');
                localStorage.removeItem('isViewOnly');

                // --- 2. RESET STATE (Nếu dùng MenuApp) ---
                if (window.menuApp && window.menuApp.state) {
                    window.menuApp.state.cart = [];
                    const cartContainer = document.getElementById('cart-items');
                    if (cartContainer) {
                        cartContainer.innerHTML = `<div class="empty-cart"><i class='bx bx-basket'></i><p>Chưa có món nào</p></div>`;
                    }
                    ['final-total', 'sub-total', 'tax-amount'].forEach(id => {
                         const el = document.getElementById(id);
                         if(el) el.innerText = '0đ';
                    });
                }

                // --- 3. [QUAN TRỌNG] UI PHẢN HỒI TỨC THÌ (Đổi màu ngay) ---
                // Tìm thẻ bàn đang active dựa trên onclick chứa ID
                const tableCard = document.querySelector(`.table-card[onclick*="tableManager.openDetailModal(${this.currentTableId},"]`);
                
                if (tableCard) {
                    // Đổi class từ occupied (đỏ) sang available (xám/trắng)
                    tableCard.classList.remove('occupied');
                    tableCard.classList.add('available');
                    
                    // Cập nhật text trạng thái
                    const statusSpan = tableCard.querySelector('.table-status');
                    if(statusSpan) statusSpan.innerText = 'Bàn trống';
                    
                    // Cập nhật sự kiện click: Chuyển từ "Xem chi tiết" sang "Mở bàn"
                    const tableName = this.currentTableName || `Bàn ${this.currentTableId}`;
                    tableCard.setAttribute('onclick', `tableManager.openGuestModal(${this.currentTableId}, '${tableName}')`);
                }

                // Đóng modal thanh toán
                this.closeModal();
                
                // --- 4. Load lại dữ liệu từ Server để đồng bộ ---
                await this.loadTables(); 
                
            } else {
                const errorText = await res.text();
                alert(`❌ Lỗi thanh toán: ${errorText}`);
            }
        } catch (e) {
            console.error(e);
            alert("⚠️ Lỗi kết nối đến server! Vui lòng kiểm tra lại mạng.");
        }
    }
};

window.tableManager = tableManager;
document.addEventListener('DOMContentLoaded', () => { tableManager.init(); });