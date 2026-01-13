const API_URL = "http://localhost:8080/api/tables";

const tableApp = {
    init: function() {
        this.renderTables();
        // Gán sự kiện cho nút "Thêm bàn" màu xanh ở góc trên
        const addBtn = document.querySelector('.btn-primary-action'); 
        if(addBtn) {
            // Thay vì alert, giờ nó sẽ gọi hàm handleAddTable
            addBtn.onclick = () => this.handleAddTable();
        }
    },

    renderTables: async function() {
        const container = document.querySelector('.table-grid-container');
        if (!container) return;

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Lỗi kết nối Backend");
            const data = await response.json();

            // Map dữ liệu từ Backend sang format hiển thị
            const tables = data.map(t => ({
                id: t.id,
                name: "Bàn " + t.tableNumber,
                capacity: t.capacity,
                status: t.status
            }));

            container.innerHTML = tables.map(table => {
                let statusColor = '';
                let actionBtn = '';
                let borderColor = '';

                // Logic giao diện theo trạng thái
                switch(table.status) {
                    case 'AVAILABLE': 
                        statusColor = '#00b894'; // Xanh lá
                        borderColor = '#00b894';
                        // Nút Mở bàn chiếm toàn bộ chiều rộng
                        actionBtn = `<button style="width:100%; background:#e3fcef; color:#00b894; border:none; padding:8px 0; border-radius:6px; cursor:pointer; font-weight:600; margin-top:10px;" onclick="tableApp.openTable(${table.id})">Mở bàn</button>`;
                        break;
                    
                    case 'OCCUPIED':
                        statusColor = '#d63031'; // Đỏ
                        borderColor = '#fdcb6e'; // Viền vàng cam
                        // Hiện 2 nút: Gọi món (POS) và Thanh toán (Màu tím)
                        actionBtn = `
                            <div style="display:flex; gap:5px; margin-top:10px;">
                                <button style="flex:1; background:#fff3cd; color:#d63031; border:none; padding:8px 0; border-radius:6px; cursor:pointer; font-weight:600;" onclick="app.loadPage('pos-page', 'nav-pos')">
                                    Gọi món
                                </button>
                                <button style="flex:1; background:#6c5ce7; color:white; border:none; padding:8px 0; border-radius:6px; cursor:pointer; font-weight:600;" onclick="tableApp.handleCheckout(${table.id})">
                                    Thanh toán
                                </button>
                            </div>
                        `;
                        break;
                        
                    default:
                        statusColor = '#636e72';
                        borderColor = '#b2bec3';
                        actionBtn = `<div style="margin-top:10px; color:#636e72;">${table.status}</div>`;
                }

                return `
                <div class="table-card" style="position:relative; background:white; padding:20px; border-radius:12px; border: 2px solid ${borderColor}; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
                    
                    <button onclick="tableApp.handleDeleteTable(${table.id})" style="position:absolute; top:10px; right:10px; border:none; background:none; color:#ff7675; cursor:pointer; font-size:18px;">
                        <i class='bx bxs-trash'></i>
                    </button>

                    <div style="font-size:40px; color:${statusColor}; margin-bottom:10px;">
                        <i class='bx bxs-dish'></i>
                    </div>
                    <h3 style="margin:5px 0; color:#2d3436;">${table.name}</h3>
                    <p style="font-size:13px; color:#636e72; margin-bottom:5px;">
                        ${table.capacity} Ghế • <span style="color:${statusColor}; font-weight:bold">${table.status}</span>
                    </p>
                    ${actionBtn}
                </div>
                `;
            }).join('');

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red; text-align:center">Mất kết nối tới Server!</p>`;
        }
    },

    // --- CHỨC NĂNG: THÊM BÀN (CREATE) ---
    handleAddTable: async function() {
        const id = prompt("Nhập ID bàn (VD: 4, 5... không trùng cũ):");
        if(!id) return;
        const number = prompt("Nhập số bàn (VD: 104):");
        const capacity = prompt("Nhập số ghế (VD: 4):");

        const newTable = {
            id: parseInt(id),
            tableNumber: parseInt(number),
            capacity: parseInt(capacity)
        };

        try {
            const res = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTable)
            });
            
            if(res.ok) {
                alert("Thêm bàn thành công!");
                this.renderTables(); // Load lại danh sách
            } else {
                alert("Lỗi: " + await res.text());
            }
        } catch (e) {
            alert("Lỗi kết nối!");
        }
    },

    // --- CHỨC NĂNG: XÓA BÀN (DELETE) ---
    handleDeleteTable: async function(id) {
        if(!confirm("Bạn có chắc chắn muốn xóa bàn này vĩnh viễn?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            
            if(res.ok) {
                this.renderTables(); // Load lại danh sách ngay lập tức
            } else {
                alert("Không thể xóa: " + await res.text());
            }
        } catch (e) {
            alert("Lỗi kết nối!");
        }
    },

    // --- CHỨC NĂNG: MỞ BÀN (UPDATE STATUS -> OCCUPIED) ---
    openTable: async function(id) {
        if(!confirm("Xác nhận khách vào bàn này?")) return;
        try {
            await fetch(`${API_URL}/${id}/open`, { method: 'POST' });
            this.renderTables();
        } catch (e) { alert("Lỗi mạng!"); }
    },

    // --- CHỨC NĂNG: THANH TOÁN (UPDATE STATUS -> AVAILABLE) ---
    handleCheckout: async function(id) {
        if(!confirm("Xác nhận thanh toán và trả bàn về trạng thái trống?")) return;

        try {
            const res = await fetch(`${API_URL}/${id}/checkout`, { method: 'POST' });
            
            if(res.ok) {
                alert("Thanh toán thành công! Bàn đã trống.");
                this.renderTables(); // Load lại để thấy bàn chuyển về màu xanh
            } else {
                alert("Lỗi: " + await res.text());
            }
        } catch (e) {
            alert("Lỗi kết nối!");
        }
    }
};

// Khởi chạy
window.tableManager = tableApp;
// Gọi hàm init để gán sự kiện cho nút Thêm Bàn ngay khi file JS tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy nếu đang ở trang có class table-grid-container
    if(document.querySelector('.table-grid-container')) {
        tableApp.init(); 
    }
});