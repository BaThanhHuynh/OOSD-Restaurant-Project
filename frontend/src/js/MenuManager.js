/**
 * ADMIN MENU MANAGER LOGIC (QUẢN TRỊ)
 * File: frontend/src/js/MenuManager.js
 * Chức năng: Hiển thị danh sách bảng, Thêm, Sửa, Xóa món ăn
 */

const adminMenuApp = {
    // Dữ liệu mẫu cho Admin (thường sẽ gọi API)
    products: [
        { id: 1, name: 'Phở bò đặc biệt', price: 55000, category: 'Đồ ăn', status: 'Còn hàng' },
        { id: 2, name: 'Bún bò Huế', price: 65000, category: 'Đồ ăn', status: 'Còn hàng' },
        { id: 3, name: 'Cơm tấm sườn bì', price: 45000, category: 'Đồ ăn', status: 'Hết hàng' },
        { id: 4, name: 'Nước ép cam', price: 35000, category: 'Thức uống', status: 'Còn hàng' },
        { id: 5, name: 'Trà đào cam sả', price: 40000, category: 'Thức uống', status: 'Còn hàng' },
    ],

    init: function() {
        // Chỉ chạy nếu đang ở trang Admin có bảng quản lý
        if (document.querySelector('.admin-container')) {
            this.renderTable();
            this.bindEvents();
        }
    },

    // Render bảng danh sách món
    renderTable: function() {
        const tbody = document.getElementById('admin-menu-table');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => {
            // Màu sắc trạng thái
            const statusColor = product.status === 'Còn hàng' ? '#27ae60' : '#c0392b';
            
            return `
            <tr>
                <td>#${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.price.toLocaleString('vi-VN')}đ</td>
                <td><span style="background:#f1f2f6; padding:4px 8px; border-radius:4px; font-size:12px;">${product.category}</span></td>
                <td style="color:${statusColor}; font-weight:600;">${product.status}</td>
                <td>
                    <button class="btn-icon edit" onclick="adminMenuApp.editProduct(${product.id})" title="Sửa">
                        <i class='bx bx-edit-alt'></i>
                    </button>
                    <button class="btn-icon delete" onclick="adminMenuApp.deleteProduct(${product.id})" title="Xóa">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            </tr>
            `;
        }).join('');
    },

    bindEvents: function() {
        const addBtn = document.querySelector('.btn-primary-action');
        if(addBtn && addBtn.innerText.includes('Thêm món')) {
            addBtn.onclick = () => this.addProduct();
        }
    },

    // --- CÁC CHỨC NĂNG CRUD (GIẢ LẬP) ---

    addProduct: function() {
        // Sau này sẽ hiện Modal form, giờ dùng prompt cho nhanh
        const name = prompt("Nhập tên món mới:");
        if (!name) return;
        const price = prompt("Nhập giá tiền:");
        
        const newId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        
        this.products.push({
            id: newId,
            name: name,
            price: parseInt(price) || 0,
            category: 'Món mới',
            status: 'Còn hàng'
        });
        
        this.renderTable();
        alert("Đã thêm món thành công!");
    },

    editProduct: function(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        const newName = prompt("Sửa tên món:", product.name);
        if (newName) {
            product.name = newName;
            this.renderTable();
        }
    },

    deleteProduct: function(id) {
        if (confirm("Bạn có chắc chắn muốn xóa món này không?")) {
            this.products = this.products.filter(p => p.id !== id);
            this.renderTable();
        }
    }
};

// Gán biến toàn cục để HTML gọi được
window.adminMenuApp = adminMenuApp;

// Tự động chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    adminMenuApp.init();
});