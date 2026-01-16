const API_URL = "http://localhost:8080/api/tables";
const API_ORDER = "http://localhost:8080/api/orders";

const tableApp = {
    currentCheckoutTableId: null, // Lưu ID bàn đang được thanh toán

    init: function() {
        this.renderTables();
        
        // Logic ẩn/hiện nút "Thêm bàn" (Chỉ Admin mới thấy)
        const user = JSON.parse(localStorage.getItem('user_token') || '{}');
        const addBtn = document.querySelector('.btn-primary-action'); 
        
        if(addBtn) {
            if (user.role === 'admin') {
                addBtn.style.display = 'flex'; // Dùng flex để căn giữa icon
                addBtn.onclick = () => this.handleAddTable();
            } else {
                addBtn.style.display = 'none'; 
            }
        }
    },

    renderTables: async function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        // --- KIỂM TRA QUYỀN THANH TOÁN ---
        // Chỉ Thu ngân (cashier) hoặc Admin mới được thấy nút Thanh toán
        const user = JSON.parse(localStorage.getItem('user_token') || '{}');
        const canCheckout = (user.role === 'cashier' || user.role === 'admin'); 

        try {
            const response = await fetch(API_URL);
            const tables = await response.json();

            // Sắp xếp: Bàn có khách (OCCUPIED) lên đầu, sau đó đến số bàn
            tables.sort((a, b) => {
                if (a.status === 'OCCUPIED' && b.status === 'AVAILABLE') return -1;
                if (a.status === 'AVAILABLE' && b.status === 'OCCUPIED') return 1;
                return a.tableNumber - b.tableNumber;
            });

            container.innerHTML = tables.map(table => {
                let cardClass = 'table-card'; 
                let actionBtn = '';
                let statusText = 'Bàn trống';

                // --- TRƯỜNG HỢP 1: BÀN TRỐNG (AVAILABLE) ---
                if (table.status === 'AVAILABLE') {
                    // Nút Mở bàn
                    actionBtn = `
                        <button class="btn-table-action btn-open" onclick="tableManager.openTable(${table.id})">
                            <i class='bx bx-door-open'></i> Mở bàn
                        </button>`;
                } 
                
                // --- TRƯỜNG HỢP 2: CÓ KHÁCH (OCCUPIED) ---
                else if (table.status === 'OCCUPIED') {
                    cardClass += ' occupied'; // Thêm class để CSS đổi màu nền
                    statusText = 'Đang phục vụ';
                    
                    // Nhóm nút: Gọi món + Xem
                    let buttonsHtml = `
                        <div style="display:flex; gap:8px; width:100%;">
                            <button class="btn-table-action btn-order" onclick="tableManager.goToPos(${table.id}, ${table.tableNumber})">
                                <i class='bx bx-plus'></i> Gọi món
                            </button>
                            <button class="btn-table-action btn-view" onclick="tableManager.viewOrder(${table.id})">
                                Xem
                            </button>
                        </div>
                    `;

                    // Nếu có quyền Thanh toán thì hiện thêm nút
                    if (canCheckout) {
                        buttonsHtml += `
                            <button class="btn-table-action btn-pay" onclick="tableManager.openCheckoutModal(${table.id}, ${table.tableNumber})">
                                <i class='bx bx-money'></i> Thanh toán
                            </button>
                        `;
                    }

                    actionBtn = `<div style="display:flex; flex-direction:column; width:100%; margin-top:10px;">${buttonsHtml}</div>`;
                }

                // Nút Xóa bàn (Chỉ Admin thấy)
                let deleteBtn = '';
                if(user.role === 'admin') {
                    deleteBtn = `
                    <button class="btn-delete-table" onclick="tableManager.handleDeleteTable(${table.id})" title="Xóa bàn này">
                        <i class='bx bxs-trash'></i>
                    </button>`;
                }

                // HTML cho mỗi thẻ bàn
                return `
                <div class="${cardClass}">
                    ${deleteBtn}
                    <div style="font-size:40px; margin-bottom:5px;"><i class='bx bxs-dish'></i></div>
                    <h3>Bàn ${table.tableNumber}</h3>
                    <p class="status-text">${statusText}</p>
                    ${actionBtn}
                </div>`;
            }).join('');
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red; text-align:center">Lỗi kết nối Server!</p>`;
        }
    },

    // --- CÁC HÀM XỬ LÝ MODAL THANH TOÁN ---
    
    // 1. Mở Modal và load danh sách món
    openCheckoutModal: async function(tableId, tableNumber) {
        this.currentCheckoutTableId = tableId;
        
        // Reset lựa chọn phương thức thanh toán về mặc định (Tiền mặt)
        const allMethods = document.querySelectorAll('.pay-method');
        allMethods.forEach(btn => btn.classList.remove('active'));
        if(allMethods.length > 0) allMethods[0].classList.add('active'); // Mặc định chọn cái đầu tiên

        // Cập nhật số bàn
        const modalTableNum = document.getElementById('modal-table-num');
        if(modalTableNum) modalTableNum.textContent = tableNumber;
        
        // Hiện Modal
        const modal = document.getElementById('checkout-modal');
        if(modal) modal.style.display = 'flex';
        
        // Load danh sách món ăn
        const listContainer = document.getElementById('modal-order-list');
        if(listContainer) listContainer.innerHTML = '<p>Đang tải dữ liệu...</p>';

        try {
            const res = await fetch(`${API_ORDER}/${tableId}`);
            const items = await res.json();
            let total = 0;

            if (items.length === 0) {
                if(listContainer) listContainer.innerHTML = '<p style="text-align:center; color:#999;">Chưa có món nào.</p>';
                const totalEl = document.getElementById('modal-total');
                if(totalEl) totalEl.textContent = '0đ';
            } else {
                if(listContainer) {
                    listContainer.innerHTML = items.map(item => {
                        total += item.price;
                        return `
                            <div class="bill-item">
                                <span>${item.name}</span>
                                <strong>${item.price.toLocaleString('vi-VN')}đ</strong>
                            </div>`;
                    }).join('');
                }
                const totalEl = document.getElementById('modal-total');
                if(totalEl) totalEl.textContent = total.toLocaleString('vi-VN') + 'đ';
            }
        } catch (e) {
            console.error(e);
            if(listContainer) listContainer.innerHTML = 'Lỗi tải món ăn';
        }
    },

    // 2. Hàm xử lý khi bấm chọn phương thức thanh toán
    selectMethod: function(btnElement) {
        // Bỏ active ở tất cả các nút
        const allBtns = document.querySelectorAll('.pay-method');
        allBtns.forEach(btn => btn.classList.remove('active'));
        
        // Active nút vừa bấm
        btnElement.classList.add('active');
    },

    // 3. Đóng Modal
    closeModal: function() {
        const modal = document.getElementById('checkout-modal');
        if(modal) modal.style.display = 'none';
        this.currentCheckoutTableId = null;
    },

    // 4. Xác nhận thanh toán (Checkout)
    confirmCheckout: async function() {
        if (!this.currentCheckoutTableId) return;

        const id = this.currentCheckoutTableId;

        // Lấy phương thức thanh toán đang chọn (để log hoặc gửi server sau này)
        const activeMethodBtn = document.querySelector('.pay-method.active');
        const paymentMethod = activeMethodBtn ? activeMethodBtn.innerText.trim() : 'Unknown';

        // Có thể thêm confirm lần nữa nếu muốn
        if(!confirm(`Xác nhận thanh toán bàn này bằng [${paymentMethod}]?`)) return;
        
        try {
            // Bước 1: Xóa danh sách món (Backend xóa Order)
            await fetch(`${API_ORDER}/${id}`, { method: 'DELETE' });
            
            // Bước 2: Cập nhật trạng thái bàn về AVAILABLE
            await fetch(`${API_URL}/${id}/checkout`, { method: 'POST' });

            alert("Thanh toán thành công!");
            this.closeModal();
            this.renderTables(); // Load lại giao diện bàn
        } catch (e) {
            alert("Lỗi khi thanh toán: " + e);
        }
    },

    // --- CÁC HÀM CRUD CƠ BẢN & ĐIỀU HƯỚNG ---

    goToPos: function(tableId, tableNumber) {
        localStorage.setItem('activeTableId', tableId);
        localStorage.setItem('activeTableNumber', tableNumber);
        if (window.app && typeof window.app.loadPage === 'function') {
            app.loadPage('pos-page', 'nav-pos');
        }
    },

    handleAddTable: async function() {
        const id = prompt("Nhập ID bàn mới (VD: 10):");
        if(!id) return;
        const number = prompt("Nhập số bàn (VD: 101):");
        
        await fetch(`${API_URL}/add`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: parseInt(id), tableNumber: parseInt(number), capacity: 4 })
        });
        this.renderTables();
    },

    handleDeleteTable: async function(id) {
        if(confirm("Bạn có chắc muốn xóa bàn này vĩnh viễn?")) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            this.renderTables();
        }
    },

    openTable: async function(id) {
        await fetch(`${API_URL}/${id}/open`, { method: 'POST' });
        this.renderTables();
    },

    viewOrder: async function(tableId) {
        const res = await fetch(`${API_ORDER}/${tableId}`);
        const items = await res.json();
        
        if(items.length === 0) {
            alert("Bàn này chưa gọi món nào.");
            return;
        }
        
        let msg = "DANH SÁCH MÓN ĐANG GỌI:\n";
        items.forEach(i => msg += `- ${i.name} (${i.price.toLocaleString()}đ)\n`);
        alert(msg);
    }
};

// Gán vào window để HTML gọi được
window.tableManager = tableApp;

// Chạy khi tải trang (nếu đang ở trang có lưới bàn)
document.addEventListener('DOMContentLoaded', () => { 
    if(document.querySelector('.table-grid-container')) {
        tableApp.init(); 
    }
});