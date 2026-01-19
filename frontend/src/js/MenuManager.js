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

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    },

    openAddModal: function() {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.value = val;
        };
        setVal('input-name', '');
        setVal('input-price', '');
        setVal('input-image', '');
        setVal('input-category', 'food');
        
        const modal = document.getElementById('menu-modal');
        if (modal) modal.style.display = 'flex';
    },

    closeModal: function() {
        const modal = document.getElementById('menu-modal');
        if (modal) modal.style.display = 'none';
    },

    saveItem: async function() {
        const getVal = (id) => document.getElementById(id)?.value.trim() || '';
        
        const name = getVal('input-name');
        const priceStr = getVal('input-price');
        const category = document.getElementById('input-category')?.value || 'food';
        const image = getVal('input-image');

        if (!name) { alert("⚠️ Vui lòng nhập tên món!"); return; }
        if (!priceStr || isNaN(parseFloat(priceStr)) || parseFloat(priceStr) <= 0) {
            alert("⚠️ Vui lòng nhập giá tiền hợp lệ!"); return;
        }

        const newItem = {
            name: name,
            price: parseFloat(priceStr),
            imageUrl: image || 'src/assets/Nha_hang.jpg',
            categoryId: category,
            status: 'available'
        };

        try {
            const saveBtn = document.querySelector('#menu-modal button[onclick*="saveItem"]');
            const originalText = saveBtn ? saveBtn.textContent : 'Lưu';
            if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Đang lưu...'; }

            // [SỬA LỖI Ở ĐÂY]: Dùng API_MENU thay vì API_MENU_ADMIN
            const response = await fetch(`${API_MENU}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                alert(" Thêm món thành công!");
                this.closeModal();
                this.renderAdminMenu();
            } else {
                const text = await response.text();
                alert(` Lỗi Server: ${text}`);
            }
            
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = originalText; }

        } catch (error) {
            console.error("Lỗi:", error);
            alert(" Không thể kết nối đến Server!");
        }
    },

    deleteItem: async function(id) {
        if (!confirm(" Xóa món này vĩnh viễn?")) return;

        try {
            // [SỬA LỖI Ở ĐÂY]: Dùng API_MENU
            const response = await fetch(`${API_MENU}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.renderAdminMenu();
            } else {
                const text = await response.text();
                alert(` Lỗi xóa món: ${text}`);
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert(" Lỗi kết nối!");
        }
    },

    renderAdminMenu: async function() {
        const container = document.querySelector('.menu-admin-grid');
        if (!container) return;

        try {
            container.innerHTML = `<p style="text-align:center; color:#666; padding:20px;"> Đang tải...</p>`;

            // [SỬA LỖI Ở ĐÂY]: Dùng API_MENU
            const response = await fetch(API_MENU);
            if (!response.ok) throw new Error("HTTP Error");

            const items = await response.json();

            if (!Array.isArray(items) || items.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:20px;"> Chưa có món nào.</p>`;
                return;
            }

            container.innerHTML = items.map(item => `
                <div class="menu-item-card" 
                     style="border:1px solid #eee; padding:15px; border-radius:12px; display:flex; gap:15px; align-items:center; background:white; margin-bottom:10px;">
                    
                    <div style="width:70px; height:70px; border-radius:8px; overflow:hidden; flex-shrink:0;">
                        <img src="${item.imageUrl}" alt="${item.name}" 
                             style="width:100%; height:100%; object-fit:cover;"
                             onerror="this.src='src/assets/Nha_hang.jpg'"> 
                    </div>
                    
                    <div style="flex:1;">
                        <h4 style="margin:0 0 5px 0;">${item.name}</h4>
                        <div style="font-size:13px; color:#666;">
                            <span style="font-weight:bold; color:#187a42;">${this.formatMoney(item.price)}</span>
                            <span style="background:#f3f4f6; padding:2px 6px; border-radius:4px; font-size:11px; margin-left:8px;">${item.categoryId}</span>
                        </div>
                    </div>

                    <button onclick="menuManager.deleteItem(${item.id})" 
                            style="background:#fee2e2; color:#ef4444; border:none; width:40px; height:40px; border-radius:8px; cursor:pointer;">
                        <i class='bx bxs-trash'></i>
                    </button>
                </div>
            `).join('');

        } catch (error) {
            console.error(error);
            container.innerHTML = `<p style="color:red; text-align:center;"> Lỗi tải dữ liệu!</p>`;
        }
    },

    formatMoney: function(amount) {
        return (parseFloat(amount) || 0).toLocaleString('vi-VN') + ' đ';
    }
};

window.menuManager = menuManager;
document.addEventListener('DOMContentLoaded', () => {
    menuManager.init();
});