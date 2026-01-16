/**
 * Settings Module (Đã sửa lỗi hiển thị)
 * File: frontend/src/js/Settings.js
 */
const settingsApp = {
    // Cấu hình mặc định
    config: {
        restaurantName: "4TL RES POS",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        taxRate: 5,
        currency: "VND"
    },

    init: function() {
        console.log("Settings App Initializing..."); // Log để kiểm tra
        this.loadConfig();
        this.render();
    },

    loadConfig: function() {
        try {
            const saved = localStorage.getItem('pos_config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
            // Cập nhật logo nếu có
            const logoTitle = document.querySelector('.logo h2');
            if(logoTitle) logoTitle.textContent = this.config.restaurantName;
        } catch (e) {
            console.error("Lỗi load config:", e);
        }
    },

    render: function() {
        const container = document.getElementById('settings-container');
        if (!container) {
            console.error("Không tìm thấy div #settings-container trong HTML!");
            return;
        }

        // --- XỬ LÝ QUYỀN AN TOÀN ---
        let isAdmin = false;
        try {
            const token = localStorage.getItem('user_token');
            if (token) {
                const user = JSON.parse(token);
                isAdmin = (user.role === 'admin');
            }
        } catch (e) {
            console.error("Lỗi đọc user token:", e);
        }

        // --- CHUẨN BỊ GIAO DIỆN ---
        const disableAttr = isAdmin ? '' : 'disabled';
        const bgStyle = isAdmin ? '' : 'style="background-color: #f8fafc; cursor: not-allowed; color: #94a3b8;"';

        // HTML Vùng nguy hiểm (Chỉ Admin thấy)
        const dangerZoneHtml = isAdmin ? `
            <div class="settings-card danger-zone">
                <div class="card-header">
                    <h3><i class='bx bx-error-circle'></i> Vùng nguy hiểm</h3>
                </div>
                <p style="margin-bottom: 15px; color: #dc2626; font-size: 13px;">
                    Các hành động dưới đây sẽ xóa toàn bộ dữ liệu cài đặt của trình duyệt.
                </p>
                <button class="btn-danger-action" onclick="settingsApp.resetSystem()">
                    <i class='bx bx-trash'></i> Reset hệ thống
                </button>
            </div>
        ` : '';

        // HTML Nút lưu (Chỉ Admin bấm được)
        const footerHtml = isAdmin ? `
            <div class="settings-footer">
                <button class="btn-save" onclick="settingsApp.saveSettings()">
                    <i class='bx bx-save'></i> Lưu thay đổi
                </button>
            </div>
        ` : `
            <div class="settings-footer" style="text-align:center; color:#94a3b8; font-style:italic; margin-top:20px;">
                * Chỉ tài khoản Quản lý (Admin) mới có quyền chỉnh sửa.
            </div>
        `;

        // --- VẼ HTML VÀO CONTAINER ---
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
                        <select id="set-currency" disabled style="background: #f1f5f9; cursor: not-allowed;">
                            <option value="VND" selected>VND (Việt Nam Đồng)</option>
                            <option value="USD">USD (Đô la Mỹ)</option>
                        </select>
                    </div>
                </div>
            </div>

            ${dangerZoneHtml}
            ${footerHtml}
        `;
    },

    saveSettings: function() {
        const name = document.getElementById('set-name').value;
        const address = document.getElementById('set-address').value;
        const tax = document.getElementById('set-tax').value;

        if (!name || !address) return alert("Vui lòng nhập đầy đủ thông tin!");

        this.config.restaurantName = name;
        this.config.address = address;
        this.config.taxRate = parseInt(tax);

        localStorage.setItem('pos_config', JSON.stringify(this.config));
        
        // Cập nhật UI ngay lập tức
        const logoTitle = document.querySelector('.logo h2');
        if(logoTitle) logoTitle.textContent = name;

        alert("Đã lưu cấu hình thành công!");
    },

    resetSystem: function() {
        if (confirm("CẢNH BÁO: Bạn có chắc muốn xóa cấu hình và tải lại trang?")) {
            localStorage.removeItem('pos_config');
            location.reload();
        }
    }
};

// Đảm bảo window gọi được
window.settingsApp = settingsApp;