/**
 * TABLE MANAGER LOGIC (FINAL MERGED VERSION)
 * Features: Vertical Modal, QR Code Payment, Auto-Clear Cart Fix
 * File: frontend/src/js/TableManager.js
 */

const tableManager = {
    tables: [],
    currentTableId: null,
    currentTableName: null,
    currentOrderTotal: 0, 

    // Khởi tạo
    init: async function() {
        if (document.querySelector('.table-grid-container')) {
            await this.loadTables();
        }
    },

    // 1. Tải danh sách bàn
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

    // 2. Render giao diện bàn
    renderTables: function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        if (this.tables.length === 0) {
            container.innerHTML = `<p style="text-align:center; width:100%;">Chưa có bàn nào.</p>`;
            return;
        }

        container.innerHTML = this.tables.map(table => {
            let statusClass = table.status === 'occupied' ? 'occupied' : 'available';
            let statusText = table.status === 'occupied' ? 'Đang phục vụ' : 'Bàn trống';
            // Click action
            let clickEvent = table.status === 'occupied' 
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
    // LOGIC 1: MỞ BÀN (NHẬP KHÁCH)
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

        try {
            const res = await fetch(`${API_TABLES}/${this.currentTableId}/status?status=occupied`, { method: 'PUT' });
            if (res.ok) {
                this.closeGuestModal();
                await this.loadTables();
                this.openDetailModal(this.currentTableId, this.currentTableName);
            } else { alert("Lỗi mở bàn!"); }
        } catch (e) { console.error(e); alert("Lỗi kết nối!"); }
    },

    // ============================================================
    // LOGIC 2: CHI TIẾT BÀN
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
            listBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">Lỗi tải dữ liệu</td></tr>`;
        }

        // Gán sự kiện nút
        document.getElementById('btn-detail-order').onclick = () => {
            this.closeDetailModal();
            this.goToPosPage(tableId, tableName);
        };
        document.getElementById('btn-detail-pay').onclick = () => {
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
            const itemTotal = item.menuItem.price * item.quantity;
            const timeStr = new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
            return `
                <tr>
                    <td><b>${item.menuItem.name}</b><br><small style="color:#64748b">${fmt.format(item.menuItem.price)}</small></td>
                    <td style="text-align: center;">x${item.quantity}</td>
                    <td style="text-align: center; color:#666;">${timeStr}</td>
                    <td style="text-align: right; font-weight:bold;">${fmt.format(itemTotal)}</td>
                </tr>
            `;
        }).join('');

        if(container) container.innerHTML = html;
        if(totalElement) totalElement.innerText = fmt.format(order.totalAmount || 0);
    },

    goToPosPage: function(id, name) {
        localStorage.setItem('activeTableId', id);
        localStorage.setItem('activeTableName', name);
        localStorage.setItem('isViewOnly', 'false');
        if (window.app) {
            app.loadPage('pos-page', 'nav-pos');
            if(window.menuApp) window.menuApp.updateHeaderTableInfo();
        }
    },

    // ============================================================
    // LOGIC 3: THANH TOÁN (VERTICAL + QR + RESET DATA FIX)
    // ============================================================

    openPaymentModal: async function(id, name) {
        this.currentTableId = id;
        
        // 1. Reset dữ liệu cũ ngay lập tức để tránh hiện số tiền bàn trước
        this.currentOrderTotal = 0; 
        document.getElementById('modal-total-display').innerText = '...';
        const checkoutItems = document.getElementById('checkout-order-items');
        if(checkoutItems) checkoutItems.innerHTML = '';

        const modal = document.getElementById('checkout-modal');
        if(modal) {
            modal.style.display = 'flex';
            document.getElementById('modal-table-num').innerText = name.replace('Bàn ', '');

            // 2. Fetch dữ liệu mới
            try {
                const res = await fetch(`${API_ORDERS}/table/${id}/active`);
                if (res.ok) {
                    const order = await res.json();
                    this.currentOrderTotal = order.totalAmount || 0;
                    this.renderCheckoutList(order);
                } else {
                    if(checkoutItems) checkoutItems.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:15px;">Chưa có món</td></tr>';
                }
            } catch (e) {
                console.error(e);
                if(checkoutItems) checkoutItems.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Lỗi tải dữ liệu</td></tr>';
            }

            // 3. Cập nhật UI hiển thị tiền
            const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
            document.getElementById('modal-total-display').innerText = fmt.format(this.currentOrderTotal);

            // 4. Mặc định chọn Tiền mặt
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
        // Chọn đúng container để scroll trong modal dọc
        const scrollContainer = document.getElementById('checkout-body'); 

        if (qrSection) {
            if (method === 'QR') {
                qrSection.style.display = 'block';
                // Auto scroll xuống
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

    // --- QUAN TRỌNG: HÀM THANH TOÁN KÈM LOGIC RESET DỮ LIỆU ---
    confirmCheckout: async function() {
        if (!this.currentTableId) return;
        
        const activeBtn = document.querySelector('.pay-method.active');
        const method = activeBtn ? activeBtn.getAttribute('data-method') : 'CASH';

        if (!confirm(`Xác nhận thanh toán và hoàn tất bàn này? (${method})`)) return;

        try {
            const paymentData = {
                tableId: this.currentTableId,
                amount: this.currentOrderTotal,
                method: method 
            };

            const res = await fetch(`${API_PAYMENT}/pay`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paymentData)
            });

            if (res.ok) {
                alert("✅ Thanh toán thành công!");

                // ============================================================
                // [FIX LỖI] CLEANUP DATA (Xóa dữ liệu cũ)
                // ============================================================
                
                // 1. Xóa dữ liệu trong LocalStorage
                localStorage.removeItem('cart'); 
                localStorage.removeItem('currentOrder');
                localStorage.removeItem('activeTableId');
                localStorage.removeItem('activeTableName');

                // 2. Reset biến giỏ hàng trong bộ nhớ Javascript (menuApp)
                if (window.menuApp && window.menuApp.state) {
                    window.menuApp.state.cart = []; // Xóa mảng món ăn trong state
                    
                    // 3. Xóa giao diện danh sách món bên tab Menu (nếu DOM tồn tại)
                    const cartContainer = document.getElementById('cart-items');
                    if (cartContainer) {
                        cartContainer.innerHTML = `
                            <div class="empty-cart">
                                <i class='bx bx-basket'></i>
                                <p>Chưa có món nào</p>
                            </div>`;
                    }

                    // 4. Reset các số tiền về 0đ
                    const finalTotalElement = document.getElementById('final-total');
                    const subTotalElement = document.getElementById('sub-total');
                    const taxElement = document.getElementById('tax-amount');

                    if (finalTotalElement) finalTotalElement.innerText = '0đ';
                    if (subTotalElement) subTotalElement.innerText = '0đ';
                    if (taxElement) taxElement.innerText = '0đ';
                }
                // ============================================================

                this.closeModal();
                await this.loadTables(); 
                
            } else {
                alert("❌ Lỗi thanh toán! Vui lòng thử lại.");
            }
        } catch (e) {
            console.error(e);
            alert("⚠️ Lỗi kết nối đến server!");
        }
    }
};

window.tableManager = tableManager;
document.addEventListener('DOMContentLoaded', () => { tableManager.init(); });