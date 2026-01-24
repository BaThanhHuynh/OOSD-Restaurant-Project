/**
 * MENU POS LOGIC (BÁN HÀNG)
 * File: frontend/src/js/Menu.js
 */

// Cấu hình danh mục
const categoriesConfig = [
    { id: 'all', name: 'Tất cả', icon: 'bx-grid-alt' },
    { id: 'food', name: 'Đồ ăn', icon: 'bx-dish' },
    { id: 'drinks', name: 'Thức uống', icon: 'bx-coffee-togo' },
    { id: 'dessert', name: 'Tráng miệng', icon: 'bx-cake' }
];

const menuApp = {
    state: {
        products: [],
        currentCat: 'all',
        cart: [],
        tables: []
    },

    init: function () {
        if (!document.getElementById('product-grid')) return;

        this.checkAuth();
        this.fetchMenuData();
        this.renderCart();

        // [FIX] Chỉ update header nếu có activeTableId
        const tableId = localStorage.getItem('activeTableId');
        if (tableId && tableId !== 'null') {
            this.updateHeaderTableInfo();
        }

        this.updateViewMode();

        // [MỚI] Tạo sẵn Modal cảnh báo View Mode
        this.createViewOnlyModal();
    },

    // --- [MỚI] TẠO MODAL CẢNH BÁO CHẾ ĐỘ XEM ---
    createViewOnlyModal: function () {
        if (document.getElementById('view-mode-modal')) return;

        const modalHTML = `
        <div id="view-mode-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:3000; align-items:center; justify-content:center; backdrop-filter:blur(2px);">
            <div style="background:white; width:400px; padding:30px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2); text-align:center; animation: zoomIn 0.2s ease;">
                <div style="width:60px; height:60px; background:#fef3c7; color:#d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:30px;">
                    <i class='bx bx-info-circle'></i>
                </div>
                <h3 style="margin-bottom:10px; color:#333;">Chế độ Chỉ Xem</h3>
                <p style="color:#666; font-size:14px; line-height:1.5; margin-bottom:25px;">
                    Bạn đang ở chế độ xem thực đơn. Để gọi món, vui lòng nhấn vào nút Đặt món.
                </p>
                <div style="display:flex; gap:10px;">
                    <button onclick="document.getElementById('view-mode-modal').style.display='none'" 
                            style="flex:1; padding:12px; border:1px solid #ddd; background:white; color:#555; border-radius:10px; font-weight:600; cursor:pointer;">
                        Tiếp tục xem
                    </button>
                    <button onclick="menuApp.switchToTableManager()" 
                            style="flex:1; padding:12px; border:none; background:#10b981; color:white; border-radius:10px; font-weight:600; cursor:pointer; box-shadow:0 4px 10px rgba(16,185,129,0.3);">
                        Đặt món
                    </button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Hàm chuyển hướng về trang Quản lý bàn
    switchToTableManager: function () {
        document.getElementById('view-mode-modal').style.display = 'none';
        if (window.app) {
            app.loadPage('tables-page', 'nav-tables');
        }
    },

    updateViewMode: function () {
        const isViewOnly = localStorage.getItem('isViewOnly') === 'true';
        const orderPanel = document.getElementById('main-order-panel');
        const posPage = document.getElementById('pos-page');

        if (isViewOnly) {
            if (orderPanel) orderPanel.style.display = 'none';
            if (posPage) {
                posPage.style.width = '100%';
                posPage.style.paddingRight = '20px';
            }
        } else {
            if (orderPanel) orderPanel.style.display = 'flex';
            if (posPage) {
                posPage.style.width = '';
                posPage.style.paddingRight = '';
            }
        }
    },

    fetchMenuData: async function () {
        try {
            const res = await fetch(API_MENU);
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error("Dữ liệu lỗi");

            this.state.products = data;
            this.renderCategories();
            this.renderProducts();
        } catch (error) {
            console.error("Lỗi tải menu:", error);
            const gridEl = document.getElementById('product-grid');
            if (gridEl) gridEl.innerHTML = `<p style="color:red; text-align:center; padding:20px;">❌ Mất kết nối Server!</p>`;
        }
    },

    checkAuth: function () {
        const userToken = localStorage.getItem('user_token');
        if (!userToken) return;
        try {
            const userData = JSON.parse(userToken);
            const userNameEl = document.querySelector('.user-info h4');
            const userRoleEl = document.querySelector('.user-info span');
            if (userNameEl) userNameEl.textContent = userData.name;
            if (userRoleEl) userRoleEl.textContent = (userData.role === 'admin') ? 'Quản lý' : 'Nhân viên';
        } catch (e) { console.error(e); }
    },

    updateHeaderTableInfo: function () {
        const tableNum = localStorage.getItem('activeTableNumber');
        const headerTitle = document.querySelector('.order-header h2');
        if (tableNum && headerTitle) {
            headerTitle.innerText = `Order - Bàn ${tableNum}`;
            headerTitle.style.color = "#d63031";
        }
    },

    formatMoney: function (amount) {
        return (parseFloat(amount) || 0).toLocaleString('vi-VN') + 'đ';
    },

    renderCategories: function () {
        const container = document.getElementById('categories-list');
        if (!container) return;
        const catsWithCount = categoriesConfig.map(cat => {
            let count = (cat.id === 'all')
                ? this.state.products.length
                : this.state.products.filter(p => p.categoryId === cat.id).length;
            return { ...cat, count };
        });
        container.innerHTML = catsWithCount.map(cat => `
            <div class="cat-item ${this.state.currentCat === cat.id ? 'active' : ''}" 
                 onclick="menuApp.filterCategory('${cat.id}')" style="cursor: pointer;">
                <div class="cat-icon"><i class='bx ${cat.icon}'></i></div>
                <span class="cat-name">${cat.name}</span>
                <span class="cat-count">${cat.count} món</span>
            </div>
        `).join('');
    },

    renderProducts: function () {
        const container = document.getElementById('product-grid');
        if (!container) return;
        const filtered = this.state.currentCat === 'all'
            ? this.state.products
            : this.state.products.filter(p => p.categoryId === this.state.currentCat);

        if (filtered.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#999; padding:20px;">📭 Không có món nào.</p>`;
            return;
        }

        container.innerHTML = filtered.map(product => {
            const inCart = this.state.cart.find(i => i.id === product.id);
            const imgSrc = product.imageUrl || 'src/assets/Nha_hang.jpg';

            return `
            <div class="product-card" onclick="menuApp.addToCart(${product.id})" style="cursor: pointer;">
                <div class="card-img-placeholder">
                    <img src="${imgSrc}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='src/assets/Nha_hang.jpg'">
                </div>
                <h3>${product.name}</h3>
                <div class="card-meta">
                    <span class="price">${this.formatMoney(product.price)}</span>
                    ${product.badge ? `<span class="badge-inline">${product.badge}</span>` : ''}
                </div>
                <div class="card-footer">
                    ${inCart ? `
                        <div class="qty-control-grid" onclick="event.stopPropagation()">
                            <button class="btn-qty" onclick="menuApp.decreaseQty(${product.id})"><i class='bx bx-minus'></i></button>
                            <span class="qty-num">${inCart.qty}</span>
                            <button class="btn-qty" onclick="menuApp.addToCart(${product.id})"><i class='bx bx-plus'></i></button>
                        </div>
                    ` : `<button class="btn-add">Thêm món</button>`}
                </div>
            </div>`;
        }).join('');
    },

    renderCart: function () {
        const container = document.getElementById('cart-items');
        if (!container) return;
        if (this.state.cart.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#9ca3af; margin-top:50px;"><i class='bx bx-basket' style="font-size:40px; margin-bottom:10px;"></i><p style="font-size:13px;">Chưa chọn món nào</p></div>`;
            this.updateTotals();
            return;
        }
        container.innerHTML = this.state.cart.map(item => `
            <div class="order-item">
                <div class="item-img"><img src="${item.imageUrl || 'src/assets/Nha_hang.jpg'}" onerror="this.src='src/assets/Nha_hang.jpg'"></div>
                <div class="item-info"><h4>${item.name}</h4><span class="item-price">${this.formatMoney(item.price)}</span></div>
                <div class="item-qty-display">x${item.qty}</div>
                <button class="btn-remove-item" onclick="menuApp.removeFromCart(${item.id})"><i class='bx bx-trash'></i></button>
            </div>
        `).join('');
        this.updateTotals();
    },

    filterCategory: function (catId) {
        this.state.currentCat = catId;
        this.renderCategories();
        this.renderProducts();
    },

    addToCart: function (id) {
        // [SỬA ĐỔI] Thay alert bằng Modal xịn xò
        const isViewOnly = localStorage.getItem('isViewOnly') === 'true';
        if (isViewOnly) {
            // Hiện Modal thay vì Alert
            const modal = document.getElementById('view-mode-modal');
            if (modal) modal.style.display = 'flex';
            return;
        }

        const product = this.state.products.find(p => p.id === id);
        if (!product) return;
        const exist = this.state.cart.find(i => i.id === id);
        if (exist) exist.qty++; else this.state.cart.push({ ...product, qty: 1 });
        this.renderCart();
        this.renderProducts();
    },

    decreaseQty: function (id) {
        const isViewOnly = localStorage.getItem('isViewOnly') === 'true';
        if (isViewOnly) return;
        const exist = this.state.cart.find(i => i.id === id);
        if (exist) {
            exist.qty--;
            if (exist.qty <= 0) this.state.cart = this.state.cart.filter(i => i.id !== id);
        }
        this.renderCart();
        this.renderProducts();
    },

    removeFromCart: function (id) {
        const isViewOnly = localStorage.getItem('isViewOnly') === 'true';
        if (isViewOnly) return;
        this.state.cart = this.state.cart.filter(i => i.id !== id);
        this.renderCart();
        this.renderProducts();
    },

    updateTotals: function () {
        const subTotal = this.state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subTotal * 0.05;
        const total = subTotal + tax;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = this.formatMoney(val);
        };
        setVal('sub-total', subTotal);
        setVal('tax-amount', tax);
        setVal('final-total', total);
    },

    submitOrder: async function () {
        // 1. Kiểm tra giỏ hàng
        if (this.state.cart.length === 0) {
            alert("Vui lòng chọn món trước!");
            return;
        }

        // 2. Kiểm tra bàn
        const tableIdStr = localStorage.getItem('activeTableId');
        const tableNumber = localStorage.getItem('activeTableNumber');

        if (!tableIdStr) {
            alert("Vui lòng chọn bàn từ trang 'Quản lý bàn' trước!");
            // Chuyển hướng người dùng về trang chọn bàn
            if (window.app) app.loadPage('tables-page', 'nav-tables');
            return;
        }
        const tableId = parseInt(tableIdStr); // Chuyển về số nguyên

        if (!confirm(`Xác nhận gọi ${this.state.cart.length} món cho bàn ${tableNumber}?`)) return;

        try {
            // --- BƯỚC 1: TÌM HOẶC TẠO ORDER ---
            let orderId;

            // Gọi API kiểm tra xem bàn này đã có Order đang mở chưa
            let activeOrderRes = await fetch(`${API_ORDERS}/table/${tableId}/active`);

            if (activeOrderRes.ok) {
                const activeOrder = await activeOrderRes.json();
                orderId = activeOrder.id || activeOrder.orderId;
                console.log("✅ Tìm thấy Order đang mở:", orderId);
            } else {
                // Nếu chưa có (404), gọi API tạo Order mới
                console.log("📝 Tạo Order mới cho bàn", tableId);
                const createRes = await fetch(`${API_ORDERS}/table/${tableId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!createRes.ok) {
                    // Lấy thông báo lỗi chi tiết từ backend
                    let errorMessage = "Không thể tạo đơn hàng mới cho bàn này.";
                    try {
                        const errorText = await createRes.text();
                        if (errorText) {
                            errorMessage += `\n\nChi tiết lỗi: ${errorText}`;
                        }
                    } catch (e) {
                        // Không parse được error text
                    }

                    // Hiển thị lỗi chi tiết
                    alert(
                        `❌ ${errorMessage}\n\n` +
                        `Nguyên nhân có thể:\n` +
                        `- Bàn ${tableNumber} (ID: ${tableId}) không tồn tại trong database\n` +
                        `- Backend chưa chạy hoặc mất kết nối\n` +
                        `- Bàn chưa được mở (status không phải OCCUPIED)\n\n` +
                        `Hãy kiểm tra:\n` +
                        `1. Backend đang chạy tại http://localhost:8080\n` +
                        `2. Database có dữ liệu bàn\n` +
                        `3. Bàn đã được mở (click vào bàn trống để mở)`
                    );
                    throw new Error(errorMessage);
                }

                const newOrder = await createRes.json();
                orderId = newOrder.id || newOrder.orderId;
                console.log("✅ Tạo Order mới thành công:", orderId);
            }

            // --- BƯỚC 2: GỬI DANH SÁCH MÓN ---
            // Chuẩn bị dữ liệu đúng chuẩn Backend yêu cầu (ItemRequest)
            const itemsPayload = this.state.cart.map(item => ({
                menuItemId: item.id,
                quantity: item.qty
            }));

            console.log("📤 Gửi danh sách món:", itemsPayload);

            const addItemsRes = await fetch(`${API_ORDERS}/${orderId}/items/batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemsPayload)
            });

            if (addItemsRes.ok) {
                console.log("✅ Thêm món thành công!");

                // RESET GIỎ HÀNG SAU KHI GỌI THÀNH CÔNG
                this.state.cart = [];
                this.renderCart();

                // Hiển thị thông báo thành công và hỏi người dùng muốn làm gì tiếp theo
                const viewKitchen = confirm(
                    `✅ Đã gọi món thành công cho Bàn ${tableNumber}!\n\n` +
                    `Món ăn đã được chuyển đến bếp.\n\n` +
                    `Bạn có muốn xem trạng thái món ăn không?`
                );

                if (viewKitchen) {
                    // Chuyển sang màn hình Kitchen Monitor
                    if (window.app) {
                        app.loadPage('kitchen-page', 'nav-kitchen');
                        // Làm mới dữ liệu Kitchen Monitor ngay lập tức
                        setTimeout(() => {
                            if (window.kitchenApp) {
                                kitchenApp.fetchData();
                            }
                        }, 100);
                    }
                } else {
                    // Chuyển về màn hình quản lý bàn
                    if (window.app) app.loadPage('tables-page', 'nav-tables');
                }
            } else {
                const errText = await addItemsRes.text();
                console.error("❌ Lỗi thêm món:", errText);
                alert(
                    `❌ Lỗi khi thêm món vào đơn hàng!\n\n` +
                    `Chi tiết: ${errText}\n\n` +
                    `Vui lòng thử lại hoặc liên hệ quản trị viên.`
                );
            }

        } catch (error) {
            console.error('❌ Lỗi gọi món:', error);

            // Chỉ hiển thị alert nếu chưa hiển thị ở trên
            if (!error.message || !error.message.includes("Không thể tạo đơn hàng")) {
                alert(
                    "❌ Lỗi kết nối Server!\n\n" +
                    "Vui lòng kiểm tra:\n" +
                    "- Backend đã chạy chưa (Port 8080)\n" +
                    "- Kết nối mạng\n" +
                    "- Console để xem chi tiết lỗi"
                );
            }
        }
    }
};
window.menuApp = menuApp;
document.addEventListener('DOMContentLoaded', () => {
    menuApp.init();
});