// src/js/app.js

const app = {
    // Hàm chuyển đổi giữa các trang (Menu, Bàn, Bếp...)
    loadPage: function(pageId, navId) {
        // 1. Ẩn tất cả các trang
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // 2. Hiện trang được chọn
        const selectedPage = document.getElementById(pageId);
        if(selectedPage) {
            selectedPage.style.display = 'block';
            setTimeout(() => selectedPage.classList.add('active'), 10);
        }

        // 3. Update trạng thái active cho Menu bên trái (Sidebar)
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        const selectedNav = document.getElementById(navId);
        if(selectedNav) selectedNav.classList.add('active');

        // 4. LOGIC ĐẶC BIỆT: Nếu bấm vào tab "Quản lý bàn", hãy tải dữ liệu từ Backend
        if (pageId === 'tables-page') {
            if (window.tableManager) {
                console.log("-> Đang tải dữ liệu bàn từ Server...");
                window.tableManager.loadTables();
            }
        }
    },

    // Hàm submit order (Demo - sẽ phát triển sau)
    submitOrder: function() {
        alert("Chức năng gửi xuống bếp đang được phát triển!");
    }
};

// Mặc định khi mở web lên thì vào trang nào?
document.addEventListener('DOMContentLoaded', () => {
    // Hiện tại mình ưu tiên vào trang Quản lý bàn để test trước nhé
    app.loadPage('tables-page', 'nav-tables');
});