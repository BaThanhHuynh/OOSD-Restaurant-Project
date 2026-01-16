/**
 * MENU POS LOGIC (BÁN HÀNG)
 * File: frontend/src/js/Menu.js
 */

const menuData = {
    categories: [
        { id: 'all', name: 'Tất cả', icon: 'bx-grid-alt', count: 235 },
        { id: 'food', name: 'Đồ ăn', icon: 'bx-dish', count: 120 },
        { id: 'drinks', name: 'Thức uống', icon: 'bx-coffee-togo', count: 60 },
        { id: 'dessert', name: 'Tráng miệng', icon: 'bx-cake', count: 40 },
    ],
    products: [
        { id: 1, name: 'Phở bò đặc biệt', price: 55000, img: 'src/assets/Pho.jpg', cat: 'food', badge: 'Hot' },
        { id: 2, name: 'Bún bò Huế', price: 65000, img: 'src/assets/Bun_bo.jpg', cat: 'food' },
        { id: 3, name: 'Cơm tấm sườn bì', price: 45000, img: 'src/assets/Com_tam.jpg', cat: 'food', badge: '-15%' },
        { id: 4, name: 'Nước ép cam', price: 35000, img: 'src/assets/Nuoc_cam.jpg', cat: 'drinks' },
        { id: 5, name: 'Trà đào cam sả', price: 40000, img: 'src/assets/Tra_dao.jpg', cat: 'drinks' },
        { id: 6, name: 'Bánh flan', price: 25000, img: 'src/assets/Banh_flan.jpg', cat: 'dessert' },
        { id: 8, name: 'Cà phê sữa', price: 30000, img: 'src/assets/Ca_phe_sua.jpg', cat: 'drinks' },
        { id: 10, name: 'Gà nướng', price: 20000, img: 'src/assets/Ga_nuong.jpg', cat: 'food' },
        { id: 11, name: 'Bún chả Hà Nội', price: 30000, img: 'src/assets/Bun_cha_HN.jpg', cat: 'food' },
    ]
};

const menuApp = {
    state: {
        currentCat: 'all',
        cart: [],
        tables: [
            { id: 1, name: 'Phở', status: 'Đang nấu', items: 4 },
            { id: 2, name: 'Cơm tấm', status: 'Sẵn sàng', items: 2 }
        ]
    },

    init: function() {
        // Chỉ chạy nếu đang ở trang có lưới sản phẩm
        if (!document.getElementById('product-grid')) return;

        this.checkAuth();
        this.renderCategories();
        this.renderProducts();
        this.renderCart();
        this.renderTablesStatus();
    },

    checkAuth: function() {
        const userToken = localStorage.getItem('user_token');
        if (!userToken) {
            window.location.href = 'Login.html';
            return;
        }
        try {
            const userData = JSON.parse(userToken);
            const userNameEl = document.querySelector('.user-info h4');
            const userRoleEl = document.querySelector('.user-info span');
            
            if (userNameEl) userNameEl.textContent = userData.name;
            if (userRoleEl) userRoleEl.textContent = (userData.role === 'admin') ? 'Quản lý' : (userData.role === 'cashier' ? 'Thu ngân' : 'Nhân viên');
        } catch (e) { console.error(e); }
    },

    formatMoney: function(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    },

    // --- RENDER GIAO DIỆN BÁN HÀNG ---
    renderCategories: function() {
        const container = document.getElementById('categories-list');
        if (!container) return;

        container.innerHTML = menuData.categories.map(cat => `
            <div class="cat-item ${this.state.currentCat === cat.id ? 'active' : ''}" 
                 onclick="menuApp.filterCategory('${cat.id}')">
                <div class="cat-icon"><i class='bx ${cat.icon}'></i></div>
                <span class="cat-name">${cat.name}</span>
                <span class="cat-count">${cat.count} món</span>
            </div>
        `).join('');
    },

    renderProducts: function() {
        const container = document.getElementById('product-grid');
        if (!container) return;

        const filtered = this.state.currentCat === 'all' 
            ? menuData.products 
            : menuData.products.filter(p => p.cat === this.state.currentCat);

        container.innerHTML = filtered.map(product => {
            const inCart = this.state.cart.find(i => i.id === product.id);
            const cardAction = !inCart ? `onclick="menuApp.addToCart(${product.id})"` : '';

            return `
            <div class="product-card" ${cardAction}>
                <div class="card-img-placeholder">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/100?text=IMG'">
                </div>
                <h3>${product.name}</h3>
                <div class="card-meta">
                    <span class="price">${this.formatMoney(product.price)}</span>
                    ${product.badge ? `<span class="badge-inline">${product.badge}</span>` : '<span></span>'}
                </div>
                <div class="card-footer">
                    ${inCart ? `
                        <div class="qty-control-grid" onclick="event.stopPropagation()">
                            <button class="btn-qty" onclick="menuApp.decreaseQty(${product.id})"><i class='bx bx-minus'></i></button>
                            <span class="qty-num">${inCart.qty}</span>
                            <button class="btn-qty" onclick="menuApp.addToCart(${product.id})"><i class='bx bx-plus'></i></button>
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
        if (!container) return;
        
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
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://placehold.co/40?text=Err'">
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <span class="item-price">${this.formatMoney(item.price)}</span>
            </div>
            <div class="item-qty-display">x${item.qty}</div>
            <button class="btn-remove-item" onclick="menuApp.removeFromCart(${item.id})">
                <i class='bx bx-trash'></i>
            </button>
        </div>
        `).join('');

        this.updateTotals();
    },

    renderTablesStatus: function() {
        const container = document.getElementById('tables-status-bar');
        if (!container) return;

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

    // --- LOGIC XỬ LÝ ---
    filterCategory: function(catId) {
        this.state.currentCat = catId;
        this.renderCategories();
        this.renderProducts();
    },

    addToCart: function(id) {
        const product = menuData.products.find(p => p.id === id);
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
        const tax = subTotal * 0.05;
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
        alert("Đã gửi order xuống bếp!");
        this.state.cart = [];
        this.renderCart();
        this.renderProducts();
    }
};

window.menuApp = menuApp;
document.addEventListener('DOMContentLoaded', () => { menuApp.init(); });