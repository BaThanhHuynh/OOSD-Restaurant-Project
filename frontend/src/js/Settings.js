/**
 * Settings Module
 * Quản lý cấu hình hệ thống
 */
const settingsApp = {
    // Cấu hình mặc định
    config: {
        restaurantName: "4TL RES POS",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        taxRate: 5, // %
        currency: "VND"
    },

    init: function() {
        this.loadConfig();
        this.render();
    },

    // Tải cấu hình từ LocalStorage (nếu có)
    loadConfig: function() {
        const saved = localStorage.getItem('pos_config');
        if (saved) {
            this.config = { ...this.config, ...JSON.parse(saved) };
        }
        // Cập nhật tên hiển thị trên Sidebar ngay khi load
        const logoTitle = document.querySelector('.logo h2');
        if(logoTitle) logoTitle.textContent = this.config.restaurantName;
    },

    // Render giao diện Settings
    render: function() {
        const container = document.getElementById('settings-container');
        if (!container) return;

        container.innerHTML = `
            <div class="settings-card">
                <div class="card-header">
                    <h3><i class='bx bx-store'></i> Thông tin chung</h3>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tên nhà hàng</label>
                        <input type="text" id="set-name" value="${this.config.restaurantName}" placeholder="Nhập tên nhà hàng">
                    </div>
                    <div class="form-group">
                        <label>Địa chỉ</label>
                        <input type="text" id="set-address" value="${this.config.address}" placeholder="Nhập địa chỉ">
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
                        <input type="number" id="set-tax" value="${this.config.taxRate}" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>Đơn vị tiền tệ</label>
                        <select id="set-currency" disabled style="background: #f3f4f6;">
                            <option value="VND">VND (Việt Nam Đồng)</option>
                            <option value="USD">USD (Đô la Mỹ)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settings-card danger-zone">
                <div class="card-header">
                    <h3><i class='bx bx-error-circle'></i> Vùng nguy hiểm</h3>
                </div>
                <p style="margin-bottom: 15px; color: #666; font-size: 13px;">Các hành động dưới đây sẽ ảnh hưởng đến dữ liệu hệ thống.</p>
                <button class="btn-danger-action" onclick="settingsApp.resetSystem()">
                    <i class='bx bx-trash'></i> Xóa dữ liệu & Reset hệ thống
                </button>
            </div>

            <div class="settings-footer">
                <button class="btn-save" onclick="settingsApp.saveSettings()">
                    <i class='bx bx-save'></i> Lưu thay đổi
                </button>
            </div>
        `;
    },

    // Lưu cài đặt
    saveSettings: function() {
        const name = document.getElementById('set-name').value;
        const address = document.getElementById('set-address').value;
        const tax = document.getElementById('set-tax').value;

        if (!name || !address) return alert("Vui lòng nhập đầy đủ thông tin!");

        this.config.restaurantName = name;
        this.config.address = address;
        this.config.taxRate = parseInt(tax);

        // Lưu vào LocalStorage
        localStorage.setItem('pos_config', JSON.stringify(this.config));

        // Cập nhật UI ngay lập tức
        document.querySelector('.logo h2').textContent = this.config.restaurantName;
        
        // Cập nhật lại logic tính thuế bên trang POS (nếu cần thiết có thể reload trang)
        // Ở đây ta gọi alert thông báo
        alert("Đã lưu cấu hình thành công!");
    },

    // Reset dữ liệu (Giả lập)
    resetSystem: function() {
        if (confirm("CẢNH BÁO: Hành động này sẽ xóa toàn bộ cài đặt đã lưu trong trình duyệt. Bạn có chắc chắn không?")) {
            localStorage.removeItem('pos_config');
            location.reload(); // Tải lại trang để về mặc định
        }
    }
};