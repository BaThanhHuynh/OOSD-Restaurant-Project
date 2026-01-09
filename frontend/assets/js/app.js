/**
 * Main App Logic - Đã nâng cấp nút tăng giảm số lượng
 */

// 1. Dữ liệu mẫu (Giữ nguyên)
const DATA = {
    categories: [
        { id: 'all', name: 'Tất cả', icon: 'bx-grid-alt', count: 235 },
        { id: 'food', name: 'Đồ ăn', icon: 'bx-dish', count: 120 },
        { id: 'drinks', name: 'Thức uống', icon: 'bx-coffee-togo', count: 60 },
        { id: 'dessert', name: 'Tráng miệng', icon: 'bx-cake', count: 40 },
        { id: 'pasta', name: 'Món thêm', icon: 'bx-plus-circle', count: 15 },
    ],
    products: [
        { id: 1, name: 'Phở', price: 55000, img: '🍜', cat: 'food', badge: 'Hot' },
        { id: 2, name: 'Bún bò', price: 65000, img: '🍝', cat: 'pasta' },
        { id: 3, name: 'Bún chả Hà Nội', price: 60000, img: '🥟', cat: 'food' },
        { id: 4, name: 'Cơm tấm', price: 45000, img: '🥗', cat: 'food', badge: 'Giảm 15%' },
        { id: 5, name: 'Nước ép cam', price: 35000, img: '🍊', cat: 'drinks' },
        { id: 6, name: 'Bánh flan', price: 20000, img: '🍰', cat: 'dessert' },
        { id: 7, name: 'Gà nướng', price: 120000, img: '🍗', cat: 'food' },
        { id: 8, name: 'Cà phê', price: 25000, img: '☕', cat: 'drinks' },
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
        this.renderCategories();
        this.renderProducts();
        this.renderTablesStatus();
        this.renderCart();
    },

    // Format tiền VNĐ
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
            // Kiểm tra món này có trong giỏ chưa
            const inCart = this.state.cart.find(i => i.id === product.id);

            return `
            <div class="product-card">
                ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
                <div class="card-img-placeholder">
                   <span>${product.img}</span>
                </div>
                <h3>${product.name}</h3>
                <div class="card-footer">
                    <span class="price">${this.formatMoney(product.price)}</span>
                    
                    ${inCart ? `
                        <div class="qty-control-grid">
                            <button class="btn-qty" onclick="app.decreaseQty(${product.id})">
                                <i class='bx bx-minus'></i>
                            </button>
                            <span class="qty-num">${inCart.qty}</span>
                            <button class="btn-qty" onclick="app.addToCart(${product.id})">
                                <i class='bx bx-plus'></i>
                            </button>
                        </div>
                    ` : `
                        <button class="btn-add" onclick="app.addToCart(${product.id})">Thêm món</button>
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
                    <i class='bx bx-cart' style="font-size:40px;"></i>
                    <p>Chưa có món</p>
                </div>`;
            this.updateTotals();
            return;
        }

        container.innerHTML = this.state.cart.map(item => `
            <div class="order-item">
                <div class="item-img">${item.img}</div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <span class="item-price">${this.formatMoney(item.price)}</span>
                </div>
                <div class="item-qty-control" style="background:transparent; color:#1F2937; border:1px solid #e5e7eb;">
                     <i class='bx bx-minus' style="cursor:pointer; padding:2px;" onclick="app.decreaseQty(${item.id})"></i>
                     <span style="margin:0 8px; font-weight:600;">${item.qty}</span>
                     <i class='bx bx-plus' style="cursor:pointer; padding:2px;" onclick="app.addToCart(${item.id})"></i>
                </div>
                <div class="item-total" style="margin-left:auto;">${this.formatMoney(item.price * item.qty)}</div>
                
                <button onclick="app.removeFromCart(${item.id})" style="border:none; background:none; color:#ef4444; margin-left:10px; cursor:pointer;">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `).join('');

        this.updateTotals();
    },

    renderTablesStatus: function() {
        const container = document.getElementById('tables-status-bar');
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

    // --- ACTIONS ---
    filterCategory: function(catId) {
        this.state.currentCat = catId;
        this.renderCategories();
        this.renderProducts();
    },

    // Hàm này vừa là Thêm mới, vừa là Tăng số lượng (+)
    addToCart: function(id) {
        const product = DATA.products.find(p => p.id === id);
        const exist = this.state.cart.find(i => i.id === id);
        
        if (exist) {
            exist.qty++;
        } else {
            this.state.cart.push({...product, qty: 1});
        }
        
        // Cập nhật cả 2 vùng hiển thị để đồng bộ
        this.renderCart();
        this.renderProducts();
    },

    // Hàm giảm số lượng (-)
    decreaseQty: function(id) {
        const exist = this.state.cart.find(i => i.id === id);
        if (exist) {
            exist.qty--;
            // Nếu giảm về 0 thì xóa khỏi giỏ
            if (exist.qty <= 0) {
                this.state.cart = this.state.cart.filter(i => i.id !== id);
            }
        }
        this.renderCart();
        this.renderProducts();
    },

    // Xóa hẳn món khỏi giỏ (nút thùng rác)
    removeFromCart: function(id) {
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.renderCart();
        this.renderProducts();
    },

    updateTotals: function() {
        const subTotal = this.state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subTotal * 0.08; 
        const total = subTotal + tax;

        document.getElementById('sub-total').textContent = this.formatMoney(subTotal);
        document.getElementById('tax-amount').textContent = this.formatMoney(tax);
        document.getElementById('final-total').textContent = this.formatMoney(total);
    },

    submitOrder: function() {
        if(this.state.cart.length === 0) return alert("Vui lòng chọn món trước!");
        alert("Đặt món thành công!");
        this.state.cart = [];
        this.renderCart();
        this.renderProducts(); // Reset lại các nút về trạng thái 'Thêm món'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});