const posApp = {
    loadPage: function(pageId, navId) {
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        const selectedPage = document.getElementById(pageId);
        if(selectedPage) {
            selectedPage.style.display = 'block';
            setTimeout(() => selectedPage.classList.add('active'), 10);
        }

        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        const selectedNav = document.getElementById(navId);
        if(selectedNav) selectedNav.classList.add('active');


        // A. Vào trang Quản lý bàn
        if (pageId === 'tables-page') {
            if (window.tableManager) {
                window.tableManager.renderTables(); 
            }
        }

        // B. Vào trang Order (Menu)
        if (pageId === 'pos-page') {
            const tableNum = localStorage.getItem('activeTableNumber');
            const headerTitle = document.querySelector('.order-header h2');
            
            if (tableNum && headerTitle) {
                headerTitle.innerText = `Order - Bàn ${tableNum}`;
                headerTitle.style.color = "#d63031";
            } else if (headerTitle) {
                headerTitle.innerText = "Order - Khách vãng lai";
                headerTitle.style.color = "";
            }
        }
    },

    submitOrder: function() {
        alert("Chức năng gửi xuống bếp đang được phát triển!");
    }
};


window.app = posApp;

document.addEventListener('DOMContentLoaded', () => {
    posApp.loadPage('tables-page', 'nav-tables');
});