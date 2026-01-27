/**
 * SETTINGS MODULE (CONNECTED TO BACKEND)
 * File: frontend/src/js/Settings.js
 */
const settingsApp = {
    // Config mặc định (phòng khi chưa load được)
    config: {
        restaurantName: "Đang tải...",
        address: "...",
        taxRate: 0,
        currency: "VND"
    },
    
    API_URL: 'http://localhost:8080/api/settings', // Đổi port nếu cần

    init: async function() {
        console.log("Settings App Initializing...");
        await this.loadConfigFromAPI(); // [THAY ĐỔI] Load từ API
        this.render();
    },

    // 1. Load config từ Backend
    loadConfigFromAPI: async function() {
        try {
            const res = await fetch(this.API_URL);
            if (res.ok) {
                this.config = await res.json();
                
                // Cập nhật logo ngay khi load xong
                const logoTitle = document.querySelector('.logo h2');
                if(logoTitle) logoTitle.textContent = this.config.restaurantName;
                
                // Cập nhật biến global config thuế cho MenuApp dùng (nếu có)
                if (window.menuApp) {
                     window.menuApp.taxRate = this.config.taxRate;
                }
            }
        } catch (e) {
            console.error("Lỗi kết nối Server:", e);
        }
    },

    render: function() {
        const container = document.getElementById('settings-container');
        if (!container) return;

        // --- [SỬA] XỬ LÝ QUYỀN AN TOÀN (CHECK KỸ HƠN) ---
        let isAdmin = false;
        try {
            // 1. Thử đọc từ cả 2 key phổ biến (để tránh lệch key giữa Login và Settings)
            const userStr = localStorage.getItem('user') || localStorage.getItem('user_token');
            
            if (userStr) {
                const user = JSON.parse(userStr);
                console.log("Debug User Role:", user.role); // Xem log này trên Console để kiểm tra

                // 2. So sánh role (Dùng toLowerCase để 'ADMIN' hay 'admin' đều nhận)
                if (user.role && user.role.toLowerCase() === 'admin') {
                    isAdmin = true;
                }
            }
        } catch (e) { 
            console.error("Lỗi đọc user:", e); 
        }

        const disableAttr = isAdmin ? '' : 'disabled';
        // ... (phần còn lại giữ nguyên)
        const bgStyle = isAdmin ? '' : 'style="background-color: #f8fafc; cursor: not-allowed; color: #94a3b8;"';

        // HTML Nút lưu (Chỉ Admin thấy)
        const footerHtml = isAdmin ? `
            <div class="settings-footer">
                <button class="btn-save" onclick="settingsApp.saveSettings()">
                    <i class='bx bx-save'></i> Lưu thay đổi
                </button>
            </div>
        ` : `<p style="color:red; font-style:italic; margin-top:20px;">* Bạn không có quyền chỉnh sửa cài đặt.</p>`;

        container.innerHTML = `
            <div class="settings-card">
                <div class="card-header">
                    <h3><i class='bx bx-store'></i> Thông tin chung</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tên nhà hàng</label>
                        <input type="text" id="set-name" value="${this.config.restaurantName}" 
                            ${disableAttr} ${bgStyle}>
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" id="set-address" value="${this.config.address}" 
                            ${disableAttr} ${bgStyle}>
                    </div>
                </div>
            </div>

            <div class="settings-card">
                <div class="card-header">
                    <h3><i class='bx bx-calculator'></i> Thiết lập bán hàng</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Thuế VAT (%)</label>
                        <input type="number" id="set-tax" value="${this.config.taxRate}" 
                            min="0" max="100" ${disableAttr} ${bgStyle}>
                    </div>
                    <div class="form-group">
                        <label>Đơn vị tiền tệ</label>
                        <input type="text" value="${this.config.currency}" disabled style="background: #f1f5f9;">
                    </div>
                </div>
            </div>

            ${footerHtml}
        `;
    },

    // 2. Lưu config xuống Backend
    saveSettings: async function() {
        const name = document.getElementById('set-name').value;
        const address = document.getElementById('set-address').value;
        const tax = document.getElementById('set-tax').value;

        if (!name || !address) return alert("Vui lòng nhập đầy đủ thông tin!");

        const payload = {
            restaurantName: name,
            address: address,
            taxRate: parseInt(tax),
            currency: "VND"
        };

        try {
            const res = await fetch(`${this.API_URL}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("✅ Cập nhật thành công!");
                // Reload trang để áp dụng toàn bộ hệ thống
                location.reload();
            } else {
                alert("❌ Lỗi cập nhật!");
            }
        } catch (e) {
            alert("Lỗi kết nối Server!");
            console.error(e);
        }
    }
};

window.settingsApp = settingsApp;