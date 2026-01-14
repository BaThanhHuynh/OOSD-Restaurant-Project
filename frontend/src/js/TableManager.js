const API_URL = "http://localhost:8080/api/tables";
const API_ORDER = "http://localhost:8080/api/orders";

const tableApp = {
    // 1. Khởi tạo: Vẽ bàn và gắn sự kiện cho nút Thêm bàn
    init: function() {
        this.renderTables();
        const addBtn = document.querySelector('.btn-primary-action'); 
        if(addBtn) {
            addBtn.style.display = 'block'; // Hiện nút Thêm bàn
            // Dùng arrow function để giữ ngữ cảnh 'this'
            addBtn.onclick = () => this.handleAddTable();
        }
    },

    // 2. Hàm chính: Tải và vẽ danh sách bàn
    renderTables: async function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        try {
            // Gọi API lấy danh sách bàn
            const response = await fetch(API_URL);
            const tables = await response.json();

            // --- LOGIC SẮP XẾP (SORTING) ---
            tables.sort((a, b) => {
                // Ưu tiên 1: Trạng thái OCCUPIED (Có khách) lên đầu
                if (a.status === 'OCCUPIED' && b.status === 'AVAILABLE') return -1;
                if (a.status === 'AVAILABLE' && b.status === 'OCCUPIED') return 1;

                // Ưu tiên 2: Nếu cùng trạng thái -> Sắp xếp theo số bàn tăng dần
                return a.tableNumber - b.tableNumber;
            });
            // -------------------------------

            // Tạo HTML cho từng bàn
            container.innerHTML = tables.map(table => {
                let statusColor = '';
                let statusBg = ''; 
                let actionBtn = '';
                let borderColor = '';

                switch(table.status) {
                    case 'AVAILABLE': 
                        statusBg = '#f1f2f6'; 
                        statusColor = '#636e72'; 
                        borderColor = '#b2bec3';
                        
                        actionBtn = `
                            <button style="width:100%; background:#dfe6e9; color:#2d3436; border:none; padding:8px 0; border-radius:6px; cursor:pointer; font-weight:600; margin-top:10px;" 
                                onclick="tableManager.openTable(${table.id})">
                                Mở bàn
                            </button>`;
                        break;
                    
                    case 'OCCUPIED':
                        statusBg = '#e3fcef'; 
                        statusColor = '#00b894'; 
                        borderColor = '#00b894';
                        
                        actionBtn = `
                            <div style="display:flex; flex-direction:column; gap:5px; margin-top:10px;">
                                <div style="display:flex; gap:5px;">
                                    <button onclick="tableManager.goToPos(${table.id}, ${table.tableNumber})" 
                                        style="flex:1; background:#00b894; color:white; border:none; padding:6px 0; border-radius:4px; cursor:pointer; font-weight:600;">
                                        + Gọi món
                                    </button>
                                    
                                    <button onclick="tableManager.viewOrder(${table.id})" 
                                        style="flex:1; background:white; border:1px solid #00b894; color:#00b894; padding:6px 0; border-radius:4px; cursor:pointer;">
                                        Xem/Sửa
                                    </button>
                                </div>
                                <button onclick="tableManager.handleCheckout(${table.id})" 
                                    style="width:100%; background:#636e72; color:white; border:none; padding:6px 0; border-radius:4px; cursor:pointer;">
                                    Thanh toán
                                </button>
                            </div>
                        `;
                        break;
                        
                    default:
                        statusColor = '#636e72';
                        actionBtn = `<span>${table.status}</span>`;
                }

                return `
                <div class="table-card" style="position:relative; background:${statusBg}; padding:20px; border-radius:12px; border: 2px solid ${borderColor}; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                    
                    <button onclick="tableManager.handleDeleteTable(${table.id})" 
                        style="position:absolute; top:5px; right:5px; border:none; background:none; color:#ff7675; cursor:pointer; font-size:16px;">
                        <i class='bx bxs-trash'></i>
                    </button>

                    <div style="font-size:40px; color:${statusColor}; margin-bottom:10px;">
                        <i class='bx bxs-dish'></i>
                    </div>
                    <h3 style="margin:5px 0; color:#2d3436;">Bàn ${table.tableNumber}</h3>
                    <p style="font-size:13px; color:${statusColor}; margin-bottom:5px; font-weight:bold;">${table.status}</p>
                    
                    ${actionBtn}
                </div>
                `;
            }).join('');
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red; text-align:center">Lỗi kết nối Server!</p>`;
        }
    },

    // --- CHỨC NĂNG 1: CHUYỂN HƯỚNG SANG MENU (POS) ---
    goToPos: function(tableId, tableNumber) {
        // 1. Lưu thông tin bàn đang chọn vào bộ nhớ trình duyệt (LocalStorage)
        localStorage.setItem('activeTableId', tableId);
        localStorage.setItem('activeTableNumber', tableNumber);
        
        // 2. Gọi hàm chuyển trang từ file app.js
        if (window.app && typeof window.app.loadPage === 'function') {
            app.loadPage('pos-page', 'nav-pos');
            
            // 3. Cập nhật tiêu đề bên trang Order cho chuyên nghiệp
            const orderHeader = document.querySelector('.order-header h2');
            if(orderHeader) {
                orderHeader.innerText = `Order - Bàn ${tableNumber}`;
                orderHeader.style.color = "#d63031"; // Màu đỏ
            }
        } else {
            console.error("Lỗi: Không tìm thấy biến 'app'. Hãy kiểm tra file app.js!");
            alert("Lỗi chuyển trang! Hãy kiểm tra Console.");
        }
    },

    // --- CÁC HÀM CRUD BÀN

    // Thêm bàn mới
    handleAddTable: async function() {
        const id = prompt("Nhập ID bàn mới (VD: 51):");
        if(!id) return;
        const number = prompt("Nhập số bàn (VD: 205):");
        
        // Gọi API Backend
        await fetch(`${API_URL}/add`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: parseInt(id), tableNumber: parseInt(number), capacity: 4 })
        });
        // Vẽ lại danh sách
        this.renderTables();
    },

    // Xóa bàn vĩnh viễn
    handleDeleteTable: async function(id) {
        if(confirm("Bạn có chắc chắn muốn xóa bàn này vĩnh viễn?")) {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            this.renderTables();
        }
    },

    // Mở bàn (Chuyển từ Xám -> Xanh)
    openTable: async function(id) {
        await fetch(`${API_URL}/${id}/open`, { method: 'POST' });
        this.renderTables(); // Load lại -> Tự động nhảy lên đầu do logic sort
    },

    // Thanh toán (Chuyển từ Xanh -> Xám + Xóa order cũ)
    handleCheckout: async function(id) {
        if(!confirm("Xác nhận thanh toán và trả bàn về trạng thái trống?")) return;
        
        // Bước 1: Xóa danh sách món ăn cũ
        await fetch(`${API_ORDER}/${id}`, { method: 'DELETE' });
        // Bước 2: Cập nhật trạng thái bàn về Available
        await fetch(`${API_URL}/${id}/checkout`, { method: 'POST' });
        
        this.renderTables(); // Load lại -> Tự động nhảy xuống dưới
    },

    // --- CÁC HÀM CRUD MÓN (Dùng cho nút Xem/Sửa) ---

    // Thêm món nhanh bằng tay (Optional - Nút "+ Món" cũ)
    addFood: async function(tableId) {
        const name = prompt("Nhập tên món (VD: Bia, Lẩu...):");
        if(!name) return;
        
        await fetch(`${API_ORDER}/${tableId}/add`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name: name, price: 50000 })
        });
        alert("Đã thêm món: " + name);
    },

    // Xem danh sách món và Xóa món sai
    viewOrder: async function(tableId) {
        const res = await fetch(`${API_ORDER}/${tableId}`);
        const items = await res.json();
        
        if(items.length === 0) {
            alert("Bàn chưa có món nào.");
            return;
        }

        let msg = "DANH SÁCH MÓN (Nhập tên món để xóa):\n";
        items.forEach(item => {
            msg += `- ${item.name} (${item.price}đ)\n`;
        });

        const delName = prompt(msg + "\nNhập tên món muốn xóa (hoặc để trống để thoát):");
        if(delName) {
            await fetch(`${API_ORDER}/${tableId}/remove/${delName}`, { method: 'DELETE' });
            alert("Đã xóa món: " + delName);
        }
    }
};

// --- QUAN TRỌNG: GÁN BIẾN TOÀN CỤC ---
// Dòng này giúp các hàm onclick="tableManager.xyz()" trong HTML hoạt động được
window.tableManager = tableApp;

// Tự động chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => { 
    if(document.querySelector('.table-grid-container')) {
        tableApp.init(); 
    }
});