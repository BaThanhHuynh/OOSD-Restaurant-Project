/**
 * Main App Logic
 * File: frontend/src/js/Menu.js
 */

const DATA = {
    categories: [
        { id: 'all', name: 'Tất cả', icon: 'bx-grid-alt', count: 235 },
        { id: 'food', name: 'Đồ ăn', icon: 'bx-dish', count: 120 },
        { id: 'drinks', name: 'Thức uống', icon: 'bx-coffee-togo', count: 60 },
        { id: 'dessert', name: 'Tráng miệng', icon: 'bx-cake', count: 40 },
        { id: 'pasta', name: 'Món thêm', icon: 'bx-plus-circle', count: 15 },
    ],
    products: [
        // Lưu ý: Đảm bảo file ảnh tồn tại trong thư mục src/assets/
        { id: 1, name: 'Phở bò đặc biệt', price: 55000, img: 'src/assets/Pho.jpg', cat: 'food', badge: 'Hot' },
        { id: 2, name: 'Bún bò Huế', price: 65000, img: 'src/assets/Bun_bo.jpg', cat: 'pasta' },
        { id: 3, name: 'Bún chả Hà Nội', price: 60000, img: 'src/assets/Bun_cha_HN.jpg', cat: 'food' },
        { id: 4, name: 'Cơm tấm sườn bì', price: 45000, img: 'src/assets/Com_tam.jpg', cat: 'food', badge: '-15%' },
        { id: 5, name: 'Nước ép cam', price: 35000, img: 'src/assets/Nuoc_cam.jpg', cat: 'drinks' },
        { id: 6, name: 'Bánh flan', price: 20000, img: 'src/assets/Banh_flan.jpg', cat: 'dessert' },
        { id: 7, name: 'Gà nướng', price: 120000, img: 'src/assets/Ga_nuong.jpg', cat: 'food' },
        { id: 8, name: 'Cà phê sữa', price: 25000, img: 'src/assets/Ca_phe_sua.jpg', cat: 'drinks' },
        { id: 9, name: 'Trà đào cam sả', price: 40000, img: 'src/assets/Tra_dao.jpg', cat: 'drinks' },
    ]
};

const app = {
    state: {
        currentCat: 'all',
        cart: [],
        tables: [
            { id: 1, name: 'Phở', status: 'Đang nấu', items: 4 },
            { id: 2, name: 'Cơm tấm', status: 'Sẵn sàng', items: 2 },
            { id: 3, name: 'Bún bò', status: 'Lên món', items: 5 },
            { id: 4, name: 'Bún chả Hà Nội', status: 'Tính tiền', items: 3}
        ]
    },

    init: function() {
        // --- 1. KIỂM TRA ĐĂNG NHẬP (MỚI) ---
        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            // Nếu chưa đăng nhập, đá về trang login
            window.location.href = 'login.html';
            return;
        }

        // --- 2. CẬP NHẬT THÔNG TIN USER LÊN SIDEBAR (MỚI) ---
        try {
            const userData = JSON.parse(userToken);
            const userNameEl = document.querySelector('.user-info h4');
            const userRoleEl = document.querySelector('.user-info span');
            
            if (userNameEl) userNameEl.textContent = userData.name || userData.username;
            if (userRoleEl) userRoleEl.textContent = (userData.role === 'admin') ? 'Quản lý' : 'Nhân viên';
        } catch (e) {
            console.error('Lỗi đọc dữ liệu user:', e);
        }

        // --- 3. RENDER GIAO DIỆN ---
        this.renderCategories();
        this.renderProducts();
        this.renderTablesStatus();
        this.renderCart();
    },

    formatMoney: function(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    },

    // --- RENDER FUNCTIONS ---
    renderCategories: function() {
        const container = document.getElementById('categories-list');
        container.innerHTML = DATA.categories.map(cat => `
            <div class="cat-item ${this.state.currentCat === cat.id ? 'active' : ''}" 
                 onclick="app.filterCategory('${cat.id}')">
                <div class="cat-icon"><i class='bx ${cat.icon}'></i></div>
                <span class="cat-name">${cat.name}</span>
                <span class="cat-count">${cat.count} món</span>
            </div>
        `).join('');
    },

    renderProducts: function() {
        const container = document.getElementById('product-grid');
        const filtered = this.state.currentCat === 'all' 
            ? DATA.products 
            : DATA.products.filter(p => p.cat === this.state.currentCat);

        container.innerHTML = filtered.map(product => {
            const inCart = this.state.cart.find(i => i.id === product.id);

            // Nếu đã có trong giỏ, click vào thẻ sẽ không làm gì (để người dùng dùng nút +/-)
            // Nếu chưa có, click vào thẻ sẽ thêm món
            const cardAction = !inCart ? `onclick="app.addToCart(${product.id})"` : '';

            return `
            <div class="product-card" ${cardAction}>
                <div class="card-img-placeholder">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/100?text=No+Img'">
                </div>
                
                <h3>${product.name}</h3>

                <div class="card-meta">
                    <span class="price">${this.formatMoney(product.price)}</span>
                    ${product.badge ? `<span class="badge-inline">${product.badge}</span>` : '<span></span>'}
                </div>

                <div class="card-footer">
                    ${inCart ? `
                        <div class="qty-control-grid" onclick="event.stopPropagation()">
                            <button class="btn-qty" onclick="app.decreaseQty(${product.id})"><i class='bx bx-minus'></i></button>
                            <span class="qty-num">${inCart.qty}</span>
                            <button class="btn-qty" onclick="app.addToCart(${product.id})"><i class='bx bx-plus'></i></button>
                        </div>
                    ` : `
                        <button class="btn-add">Thêm món</button>
                    `}
                </div>
            </div>
        `}).join('');
    },

    renderCart: function() {
        const container = document.getElementById('cart-items');
        
        if (this.state.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; color:#9ca3af; margin-top:50px;">
                    <i class='bx bx-basket' style="font-size:40px; margin-bottom:10px;"></i>
                    <p style="font-size:13px;">Chưa có món nào</p>
                </div>`;
            this.updateTotals();
            return;
        }

        container.innerHTML = this.state.cart.map(item => `
        <div class="order-item">
            <div class="item-img">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/40?text=Error'">
            </div>
            
            <div class="item-info">
                <h4>${item.name}</h4>
                <span class="item-price">${this.formatMoney(item.price)}</span>
            </div>
            
            <div class="item-qty-display">x${item.qty}</div>
            
            <button class="btn-remove-item" onclick="app.removeFromCart(${item.id})">
                <i class='bx bx-trash'></i>
            </button>
        </div>
        `).join('');

        this.updateTotals();
    },

    renderTablesStatus: function() {
        const container = document.getElementById('tables-status-bar');
        if (!container) return; // Phòng trường hợp đang ở trang khác không có status bar

        container.innerHTML = this.state.tables.map(t => `
            <div class="table-status-pill ${t.id === 1 ? 'active' : ''}">
                <div class="ts-badge">T${t.id}</div>
                <div class="ts-info">
                    <strong>${t.name}</strong>
                    <span>${t.items} món • ${t.status}</span>
                </div>
            </div>
        `).join('');
    },

    // --- NAVIGATION ---
    loadPage: function(pageId, navId) {
        // 1. Ẩn tất cả các sections
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // 2. Bỏ active ở menu cũ
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });

        // 3. Hiện trang được chọn
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block'; // Thay đổi từ flex sang block để tránh vỡ layout nếu có
            // Nếu là trang POS, cần set lại display flex cho css .page hoạt động (nếu có set trong css)
            // Tuy nhiên, ở css mới ta set .page { display: flex } nên ở đây cứ để remove display:none là được
            targetPage.style.display = 'flex'; 
            
            setTimeout(() => targetPage.classList.add('active'), 10);
        }

        // 4. Active menu mới
        if (navId) {
            const navEl = document.getElementById(navId);
            if(navEl) navEl.classList.add('active');
        } else {
            if(pageId === 'pos-page') {
                const navPos = document.getElementById('nav-pos');
                if(navPos) navPos.classList.add('active');
            }
        }

        // 5. Logic riêng cho từng trang
        const orderPanel = document.getElementById('main-order-panel');
        
        switch(pageId) {
            case 'pos-page':
                if(orderPanel) orderPanel.style.display = 'flex';
                break;
            case 'tables-page':
                if(orderPanel) orderPanel.style.display = 'none';
                if(typeof tableApp !== 'undefined') tableApp.init();
                break;
            case 'kitchen-page':
                if(orderPanel) orderPanel.style.display = 'none';
                if(typeof kitchenApp !== 'undefined') kitchenApp.init();
                break;
            case 'menu-admin-page':
                if(orderPanel) orderPanel.style.display = 'none';
                if(typeof adminMenuApp !== 'undefined') adminMenuApp.init();
                break;
            case 'settings-page':
                if(orderPanel) orderPanel.style.display = 'none';
                if(typeof settingsApp !== 'undefined') settingsApp.init();
                break;
        }
    },

    // --- ACTIONS ---
    filterCategory: function(catId) {
        this.state.currentCat = catId;
        this.renderCategories();
        this.renderProducts();
    },

    addToCart: function(id) {
        const product = DATA.products.find(p => p.id === id);
        const exist = this.state.cart.find(i => i.id === id);
        
        if (exist) {
            exist.qty++;
        } else {
            this.state.cart.push({...product, qty: 1});
        }
        
        this.renderCart();
        this.renderProducts();
    },

    decreaseQty: function(id) {
        const exist = this.state.cart.find(i => i.id === id);
        if (exist) {
            exist.qty--;
            if (exist.qty <= 0) {
                this.state.cart = this.state.cart.filter(i => i.id !== id);
            }
        }
        this.renderCart();
        this.renderProducts();
    },

    removeFromCart: function(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.renderCart();
        this.renderProducts();
    },

    updateTotals: function() {
        const subTotal = this.state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subTotal * 0.05; // 5% Thuế
        const total = subTotal + tax;

        const subTotalEl = document.getElementById('sub-total');
        const taxEl = document.getElementById('tax-amount');
        const totalEl = document.getElementById('final-total');

        if(subTotalEl) subTotalEl.textContent = this.formatMoney(subTotal);
        if(taxEl) taxEl.textContent = this.formatMoney(tax);  
        if(totalEl) totalEl.textContent = this.formatMoney(total);
    },

    submitOrder: function() {
        if(this.state.cart.length === 0) return alert("Vui lòng chọn món trước!");
        
        // Tại đây sau này sẽ gọi API.createOrder()
        alert("Đặt món thành công! (Dữ liệu chưa gửi về server)");
        
        this.state.cart = [];
        this.renderCart();
        this.renderProducts();
    }
};

// Khởi tạo ứng dụng khi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});