/**
 * TABLE MANAGER LOGIC (QUẢN LÝ BÀN)
 * File: frontend/src/js/TableManager.js
 */

const tableManager = {
    tables: [],

    init: async function() {
        if (document.querySelector('.table-grid-container')) {
            await this.loadTables();
        }
    },

    // 1. Tải danh sách bàn từ API
    loadTables: async function() {
        try {
            const res = await fetch(API_TABLES);
            if (!res.ok) throw new Error("Lỗi tải bàn");
            
            this.tables = await res.json();
            this.renderTables();
        } catch (error) {
            console.error(error);
            document.querySelector('.table-grid-container').innerHTML = 
                `<p style="color:red; text-align:center;"> Mất kết nối đến Server!</p>`;
        }
    },

    // 2. Vẽ giao diện bàn
    renderTables: function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        if (this.tables.length === 0) {
            container.innerHTML = `<p style="text-align:center; width:100%;">Chưa có bàn nào.</p>`;
            return;
        }

        container.innerHTML = this.tables.map(table => {
            let statusClass = '';
            let statusText = '';
            let actionButtons = '';

            if (table.status === 'occupied') {
                // CÓ KHÁCH
                statusClass = 'occupied';
                statusText = 'Đang phục vụ';
                actionButtons = `
                    <div class="table-actions-group">
                        <button class="btn-action btn-order" onclick="tableManager.openOrder(${table.id}, '${table.name}')">
                            Gọi món
                        </button>
                        <button class="btn-action btn-view" onclick="tableManager.viewOrder(${table.id}, '${table.name}')">
                            Xem
                        </button>
                    </div>
                    <button class="btn-action btn-pay" onclick="tableManager.openPaymentModal(${table.id}, '${table.name}')">
                        Thanh toán
                    </button>
                `;
            } else {
                // BÀN TRỐNG
                statusClass = 'available';
                statusText = 'Bàn trống';
                actionButtons = `
                    <button class="btn-action btn-open" onclick="tableManager.openTable(${table.id})">
                        <i class='bx bx-door-open'></i> Mở bàn
                    </button>
                `;
            }

            return `
                <div class="table-card ${statusClass}" id="table-${table.id}">
                    <div class="table-icon"><i class='bx bx-dish'></i></div>
                    <h3 class="table-name">${table.name}</h3>
                    <span class="table-status">${statusText}</span>
                    <div class="table-actions">${actionButtons}</div>
                </div>
            `;
        }).join('');
    },

    // 3. Mở bàn (Chuyển trạng thái sang occupied)
    openTable: async function(id) {
        try {
            // Gọi API cập nhật trạng thái
            const res = await fetch(`${API_TABLES}/${id}/status?status=occupied`, {
                method: 'PUT'
            });
            
            if (res.ok) {
                // Chỉ cần load lại danh sách để bàn đổi màu đỏ là đủ
                await this.loadTables(); 
            } else {
                alert("Lỗi mở bàn!");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối!");
        }
    },

    // 4. Chuyển sang trang Gọi món (POS) - CHẾ ĐỘ GỌI MÓN
    openOrder: function(id, name) {
        // Lưu thông tin bàn
        localStorage.setItem('activeTableId', id);
        localStorage.setItem('activeTableNumber', name.replace('Bàn ', ''));
        localStorage.setItem('activeTableName', name);
        localStorage.setItem('isViewOnly', 'false'); 

        // Chuyển trang
        if (window.app) {
            app.loadPage('pos-page', 'nav-pos');
            if(window.menuApp) {
                window.menuApp.updateViewMode(); 
                window.menuApp.updateHeaderTableInfo();
            }
        }
    },

    // 5. Xem đơn hàng - CHẾ ĐỘ CHỈ XEM (READ ONLY)
    viewOrder: function(id, name) {
        localStorage.setItem('activeTableId', id);
        localStorage.setItem('activeTableNumber', name.replace('Bàn ', ''));
        localStorage.setItem('activeTableName', name);
        localStorage.setItem('isViewOnly', 'true');

        // Chuyển trang
        if (window.app) {
            app.loadPage('pos-page', 'nav-pos');
            if(window.menuApp) {
                window.menuApp.updateViewMode();
                window.menuApp.updateHeaderTableInfo();
            }
        }
    },

    // 6. Mở Modal Thanh toán
    openPaymentModal: async function(id, name) {
        // Lưu ID bàn cần thanh toán
        this.currentPayTableId = id;
        
        // Hiện Modal
        const modal = document.getElementById('checkout-modal');
        if(modal) {
            modal.style.display = 'flex';
            document.getElementById('modal-table-num').innerText = name.replace('Bàn ', '');
        }
    },

    closeModal: function() {
        const modal = document.getElementById('checkout-modal');
        if(modal) modal.style.display = 'none';
    },

    selectMethod: function(btn) {
        document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    },

    // 7. Xác nhận Thanh toán -> Trả bàn về trống
    confirmCheckout: async function() {
        if (!this.currentPayTableId) return;

        if (!confirm("Xác nhận thanh toán và đóng bàn này?")) return;

        try {
            // Gọi API thanh toán (Backend sẽ lo việc reset bàn)
            const paymentData = {
                tableId: this.currentPayTableId,
                amount: 0, // Tạm thời 0đ, sau này tính thật
                method: 'CASH'
            };

            const res = await fetch(`http://localhost:8080/api/payment/pay`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(paymentData)
            });

            if (res.ok) {
                alert(" Thanh toán thành công!");
                this.closeModal();
                this.loadTables(); // Load lại để thấy bàn xanh (trống) lại
            } else {
                alert("Lỗi thanh toán!");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối!");
        }
    }
};

window.tableManager = tableManager;

// Tự động chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    tableManager.init();
});