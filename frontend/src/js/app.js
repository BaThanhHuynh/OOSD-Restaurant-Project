/**
 * Core Application Logic
 * File: frontend/src/js/app.js
 */

const app = {
    // 1. Khởi chạy ứng dụng
    init: function() {
        // Nếu chưa đăng nhập thì dừng lại ngay
        if (!this.checkAuth()) return;

        if (window.settingsApp) {
            window.settingsApp.init(); 
        }

        // Mặc định load trang Quản lý bàn khi vào app
        this.loadPage('tables-page', 'nav-tables');

        // --- SỰ KIỆN GLOBAL: Click ra ngoài thì đóng User Menu ---
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('user-dropdown-menu');
            const profile = document.querySelector('.user-profile');
            
            // Nếu menu đang mở và click không nằm trong menu hoặc nút profile
            if (dropdown && dropdown.classList.contains('show')) {
                if (!dropdown.contains(e.target) && !profile.contains(e.target)) {
                    dropdown.classList.remove('show');
                    if (profile) profile.classList.remove('active');
                }
            }
        });
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
        localStorage.removeItem('user_token');
        window.location.href = 'Login.html';
        return false;
    }
    
    // --- 1. XỬ LÝ GIAO DIỆN USER ---
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    const userAvatarEl = document.getElementById('user-avatar');
    
    // Mapping tên vai trò hiển thị
    const roleMapping = {
        'admin': 'Quản lý',
        'cashier': 'Thu ngân',
        'staff': 'Nhân viên'
    };
    
    if(userNameEl) userNameEl.textContent = user.name || user.username;
    if(userRoleEl) userRoleEl.textContent = roleMapping[user.role] || user.role;
    if(userAvatarEl) userAvatarEl.textContent = (user.name || "U").charAt(0).toUpperCase();

    // --- 2. PHÂN QUYỀN (QUAN TRỌNG NHẤT) ---
    // Xóa hết các class role cũ (nếu có) để tránh lỗi khi switch tài khoản
    document.body.classList.remove('role-admin', 'role-cashier', 'role-staff');
    
    // Thêm class role hiện tại vào body
    // Ví dụ: <body class="role-admin"> hoặc <body class="role-staff">
    if (user.role) {
        document.body.classList.add(`role-${user.role}`);
    }

    return true; 
},
    // 3. Hàm mới: Bật tắt menu User khi click vào tên
    toggleUserMenu: function(event) {
        // Ngăn chặn sự kiện click lan ra document (tránh bị đóng ngay lập tức)
        if(event) event.stopPropagation();

        const dropdown = document.getElementById('user-dropdown-menu');
        const profile = document.querySelector('.user-profile');
        
        if (dropdown && profile) {
            dropdown.classList.toggle('show');
            profile.classList.toggle('active');
        }
    },

    // 4. Chuyển Tab
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
            targetPage.style.display = 'flex'; 
            setTimeout(() => targetPage.classList.add('active'), 10);
        }

        // D. XỬ LÝ THANH ORDER PANEL
        const orderPanel = document.getElementById('main-order-panel');
        if (orderPanel) {
            if (pageId === 'pos-page') {
                orderPanel.style.display = 'flex';
                if(window.menuApp) window.menuApp.init(); 
            } else {
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