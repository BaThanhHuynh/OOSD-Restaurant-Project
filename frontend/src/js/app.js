/**
 * Core Application Logic
 * File: frontend/src/js/app.js
 */

const app = {
    // 1. Khởi chạy ứng dụng
    init: function() {
        // Nếu chưa đăng nhập thì dừng lại ngay
        if (!this.checkAuth()) return;

        // Mặc định load trang Quản lý bàn khi vào app
        this.loadPage('tables-page', 'nav-tables');
    },

    // 2. Kiểm tra quyền & Hiển thị Menu Sidebar
    checkAuth: function() {
        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            window.location.href = 'Login.html';
            return false;
        }

        let user;
        try {
            user = JSON.parse(userToken);
        } catch (e) {
            console.error("Lỗi token user:", e);
            localStorage.removeItem('user_token');
            window.location.href = 'Login.html';
            return false;
        }
        
        // Hiển thị thông tin User lên Sidebar
        const userNameEl = document.querySelector('.user-info h4');
        const userRoleEl = document.querySelector('.user-info span');
        
        if(userNameEl) userNameEl.textContent = user.name || user.username;
        if(userRoleEl) {
            const roleName = user.role === 'admin' ? 'Quản lý' : (user.role === 'cashier' ? 'Thu Ngân' : 'Nhân Viên');
            userRoleEl.textContent = roleName;
        }

        // --- XỬ LÝ ẨN/HIỆN MENU THEO QUYỀN ---
        const navAdmin = document.getElementById('nav-admin');       
        const navSettings = document.getElementById('nav-settings'); 
        const navKitchen = document.getElementById('nav-kitchen');   

        // Mặc định hiện tất cả
        if(navAdmin) navAdmin.style.display = 'flex';
        if(navSettings) navSettings.style.display = 'flex';
        if(navKitchen) navKitchen.style.display = 'flex';

        // Logic phân quyền:
        if (user.role === 'staff') {
            // Nhân viên: Ẩn trang Admin Menu
            if(navAdmin) navAdmin.style.display = 'none'; 
        } 
        
        return true; // Xác thực thành công
    },

    // 3. Chuyển Tab
    loadPage: function(pageId, navId) {
        // A. Active menu bên trái
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const navEl = document.getElementById(navId);
        if(navEl) navEl.classList.add('active');

        // B. Ẩn tất cả các trang nội dung
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // C. Hiện trang đích
        const targetPage = document.getElementById(pageId);
        if(targetPage) {
            // [SỬA LỖI]: Luôn dùng flex để giữ bố cục full chiều cao như CSS đã định nghĩa
            targetPage.style.display = 'flex'; 
            setTimeout(() => targetPage.classList.add('active'), 10);
        }

        // D. XỬ LÝ THANH ORDER PANEL
        const orderPanel = document.getElementById('main-order-panel');
        if (orderPanel) {
            if (pageId === 'pos-page') {
                // Vào trang Menu -> Hiện Order Panel
                orderPanel.style.display = 'flex';
                
                // Render lại Menu để đảm bảo dữ liệu mới nhất
                if(window.menuApp) window.menuApp.init(); 
            } else {
                // Các trang khác -> Ẩn Order Panel
                orderPanel.style.display = 'none';
            }
        }

        // E. Khởi tạo module tương ứng (Lazy load)
        switch(pageId) {
            case 'tables-page':
                if(window.tableManager) window.tableManager.renderTables();
                break;
            case 'kitchen-page':
                if(window.kitchenApp) window.kitchenApp.init();
                break;
            case 'menu-admin-page':
                if(window.adminMenuApp) window.adminMenuApp.init();
                break;
            case 'settings-page':
                if(window.settingsApp) window.settingsApp.init();
                break;
            case 'statistics-page':
                if(window.statsApp) window.statsApp.init();
                break;
        }
    },

    logout: function() {
        if(confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('user_token');
            window.location.href = 'Login.html';
        }
    }
};

// Gán vào window
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});