/**
 * Menu Manager Logic - Updated with Out of Stock Feature
 */
const menuManager = {
    init: function() {
        if (document.querySelector('.menu-admin-grid')) {
            this.renderAdminMenu();
        }
        this.setupModalEvents();
    },

    setupModalEvents: function() {
        const modal = document.getElementById('menu-modal');
        if (!modal) return;
        window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
        const closeBtn = modal.querySelector('.btn-close');
        if (closeBtn) closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    },

    // --- RENDER DANH SÁCH MÓN ---
    renderAdminMenu: async function() {
        const container = document.querySelector('.menu-admin-grid');
        if (!container) return;

        try {
            container.innerHTML = `<p style="text-align:center; padding:20px;">⏳ Đang tải thực đơn...</p>`;
            
            const response = await fetch(API_MENU);
            if (!response.ok) throw new Error("Lỗi tải API");
            const items = await response.json();

            if (!items || items.length === 0) {
                container.innerHTML = `<p style="text-align:center;">📭 Chưa có món nào.</p>`;
                return;
            }

            const defaultImg = 'src/assets/plus.jpg'; 

            container.innerHTML = items.map(item => {
                // Kiểm tra trạng thái: Nếu status là "AVAILABLE" thì là có hàng
                const status = item.status ? item.status.toUpperCase() : 'AVAILABLE';
                const isAvailable = (status === 'AVAILABLE');

                // Nếu hết hàng thì làm mờ ảnh (CSS opacity)
                const opacityStyle = isAvailable ? 'opacity: 1;' : 'opacity: 0.5; filter: grayscale(100%);';
                const badgeHtml = isAvailable ? '' : `<span style="position:absolute; top:5px; right:5px; background:red; color:white; font-size:10px; padding:2px 5px; border-radius:4px;">HẾT</span>`;

                // Nút Báo hết (Icon)
                const toggleIcon = isAvailable ? 'bx-block' : 'bx-check'; // Block để báo hết, Check để mở lại
                const toggleColor = isAvailable ? '#fef3c7' : '#dcfce7'; // Vàng nhạt vs Xanh nhạt
                const toggleTextColor = isAvailable ? '#d97706' : '#16a34a'; 

                // Xử lý ảnh
                const displayImage = (item.imageUrl && item.imageUrl.trim() !== '') ? item.imageUrl : defaultImg;

                return `
                <div class="menu-item-card" 
                     style="border:1px solid #eee; padding:15px; border-radius:12px; display:flex; gap:15px; align-items:center; background:white; margin-bottom:10px; position:relative;">
                    
                    <div style="width:70px; height:70px; border-radius:8px; overflow:hidden; flex-shrink:0; background:#f0f0f0; ${opacityStyle} transition:0.3s;">
                        <img src="${displayImage}" alt="${item.name}" 
                             style="width:100%; height:100%; object-fit:cover;"
                             onerror="this.src='${defaultImg}'">
                    </div>
                    ${badgeHtml}
                    
                    <div style="flex:1;">
                        <h4 style="margin:0 0 5px 0; color: ${isAvailable ? '#000' : '#888'}">${item.name}</h4>
                        <div style="font-size:13px; color:#666;">
                            <span style="font-weight:bold; color:#187a42;">${this.formatMoney(item.price)}</span>
                            <span style="background:#f3f4f6; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px;">${item.categoryId}</span>
                        </div>
                    </div>

                    <div style="display:flex; gap:8px;">
                        
                        <button onclick="menuManager.toggleStatus(${item.id}, '${status}')" 
                                title="${isAvailable ? 'Báo hết món' : 'Mở bán lại'}"
                                style="background:${toggleColor}; color:${toggleTextColor}; border:none; width:40px; height:40px; border-radius:8px; cursor:pointer; font-size:20px; display:flex; align-items:center; justify-content:center;">
                            <i class='bx ${toggleIcon}'></i>
                        </button>

                        <button onclick="menuManager.deleteItem(${item.id})" 
                                title="Xóa món này"
                                style="background:#fee2e2; color:#ef4444; border:none; width:40px; height:40px; border-radius:8px; cursor:pointer; font-size:20px; display:flex; align-items:center; justify-content:center;">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </div>
                `;
            }).join('');

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red; text-align:center;">⚠️ Lỗi tải dữ liệu!</p>`;
        }
    },

    // --- LOGIC: BẬT / TẮT TRẠNG THÁI ---
    toggleStatus: async function(id, currentStatus) {
        // Nếu đang AVAILABLE -> chuyển thành OUT_OF_STOCK, và ngược lại
        const newStatus = (currentStatus === 'AVAILABLE') ? 'OUT_OF_STOCK' : 'AVAILABLE';
        
        try {
            // Gọi API Backend
            const res = await fetch(`${API_MENU}/${id}/status?status=${newStatus}`, {
                method: 'PUT'
            });

            if (res.ok) {
                // Thành công: Load lại danh sách để cập nhật giao diện
                this.renderAdminMenu();
            } else {
                alert("❌ Lỗi cập nhật trạng thái!");
            }
        } catch (e) {
            console.error(e);
            alert("❌ Lỗi kết nối Server!");
        }
    },

    // --- CÁC HÀM KHÁC (GIỮ NGUYÊN) ---
    openAddModal: function() {
        document.getElementById('input-name').value = '';
        document.getElementById('input-price').value = '';
        document.getElementById('input-image').value = '';
        const modal = document.getElementById('menu-modal');
        if (modal) modal.style.display = 'flex';
    },

    closeModal: function() {
        const modal = document.getElementById('menu-modal');
        if (modal) modal.style.display = 'none';
    },

    saveItem: async function() {
        const name = document.getElementById('input-name')?.value.trim();
        const price = document.getElementById('input-price')?.value;
        const category = document.getElementById('input-category')?.value || 'food';
        const image = document.getElementById('input-image')?.value.trim();

        if (!name || !price) { alert("Vui lòng nhập tên và giá!"); return; }

        const newItem = {
            name: name,
            price: parseFloat(price),
            imageUrl: image,
            categoryId: category,
            status: 'AVAILABLE' // Món mới mặc định có hàng
        };

        try {
            const res = await fetch(`${API_MENU}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                alert("✅ Thêm món thành công!");
                this.closeModal();
                this.renderAdminMenu();
            } else {
                alert("Lỗi thêm món!");
            }
        } catch (e) { console.error(e); alert("Lỗi kết nối!"); }
    },

    deleteItem: async function(id) {
        if (!confirm("Bạn chắc chắn muốn xóa món này?")) return;
        try {
            const res = await fetch(`${API_MENU}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                this.renderAdminMenu();
            } else {
                // Nếu backend trả về lỗi (do dính order cũ), hiển thị thông báo
                const text = await res.text();
                alert(`⚠️ ${text}`);
            }
        } catch (e) { console.error(e); alert("Lỗi kết nối!"); }
    },

    formatMoney: function(amount) {
        return (parseFloat(amount) || 0).toLocaleString('vi-VN') + ' đ';
    }
};

window.menuManager = menuManager;
document.addEventListener('DOMContentLoaded', () => { menuManager.init(); });