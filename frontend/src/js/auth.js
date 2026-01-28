// frontend/src/js/auth.js

const auth = {
    // Cấu hình đường dẫn API (Backend phải đang chạy)
    API_BASE_URL: 'http://localhost:8080/api/auth',

    init: function() {
        this.bindEvents();
        this.checkLoginStatus();
        this.updateEmailSuffix(); // Khởi tạo đuôi email
    },

    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus: function() {
        const user = localStorage.getItem('user_token');
        const isLoginPage = window.location.pathname.toLowerCase().includes('login.html');
        
        // Nếu đã có token và đang ở trang login thì chuyển vào trang chủ
        if (user && isLoginPage) {
            window.location.href = 'index.html';
        }
    },

    bindEvents: function() {
        const loginForm = document.getElementById('login-form');
        if(loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const regForm = document.getElementById('register-form');
        if(regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // --- Sự kiện cho form đổi mật khẩu ---
        const forgotForm = document.getElementById('forgot-pass-form');
        if(forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChangePassword();
            });
        }
    },

    // --- LOGIC UI: Chuyển đổi giữa 3 form ---
    switchMode: function(mode) {
        // 1. Ẩn tất cả các form
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
        // 2. Hiện form được chọn và reset form
        let targetFormId = '';
        if (mode === 'login') {
            targetFormId = 'login-form';
        } else if (mode === 'register') {
            targetFormId = 'register-form';
        } else if (mode === 'forgot') {
            targetFormId = 'forgot-pass-form';
            // Reset dữ liệu cũ khi mở form
            document.getElementById('forgot-pass-form').reset();
        }

        if(targetFormId) {
            document.getElementById(targetFormId).classList.add('active');
        }
    },

    // --- LOGIC UI: Cập nhật đuôi Email theo vai trò ---
    updateEmailSuffix: function() {
        const roleSelect = document.getElementById('reg-role');
        const suffixSpan = document.getElementById('reg-email-suffix');
        
        if (!roleSelect || !suffixSpan) return;

        const role = roleSelect.value;
        let suffix = '@gmail.com';

        switch(role) {
            case 'admin': suffix = '_admin@gmail.com'; break;
            case 'cashier': suffix = '_cashier@gmail.com'; break;
            case 'staff': 
            default: suffix = '_staff@gmail.com'; break;
        }

        suffixSpan.textContent = suffix;
    },

    // --- API 1: ĐĂNG KÝ ---
    handleRegister: async function() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;
        
        const emailPrefix = document.getElementById('reg-email-prefix').value.trim();
        const emailSuffix = document.getElementById('reg-email-suffix').textContent;

        if (!username || !emailPrefix || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const fullEmail = emailPrefix + emailSuffix;

        const registerData = {
            username: username,
            password: password,
            email: fullEmail,
            role: role
        };

        try {
            const response = await fetch(`${this.API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });

            if (response.ok) {
                alert(`Đăng ký thành công!\nTài khoản: ${username}\nEmail: ${fullEmail}\nVui lòng đăng nhập.`);
                document.getElementById('register-form').reset();
                this.switchMode('login');
                document.getElementById('login-username').value = username;
            } else {
                const errorData = await response.text();
                alert("Đăng ký thất bại: " + errorData);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến máy chủ.");
        }
    },

    // --- API 2: ĐĂNG NHẬP ---
    handleLogin: async function() {
        const loginInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value;

        if (!loginInput || !passwordInput) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const btn = document.querySelector('#login-form .btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Đang xử lý...';
        btn.disabled = true;

        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginInput, password: passwordInput })
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('user_token', JSON.stringify(userData));
                window.location.href = 'index.html';
            } else {
                alert('Sai tên đăng nhập hoặc mật khẩu!');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Lỗi kết nối đến server!");
            btn.textContent = originalText;
            btn.disabled = false;
        }
    },

    // --- API 3: ĐỔI MẬT KHẨU (MỚI) ---
    handleChangePassword: async function() {
        const username = document.getElementById('fp-username').value.trim();
        const oldPassword = document.getElementById('fp-old-pass').value;
        const newPassword = document.getElementById('fp-new-pass').value;

        if (!username || !oldPassword || !newPassword) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // Validation phía client (tùy chọn)
        if (newPassword.length < 3) {
            alert("Mật khẩu mới phải có ít nhất 3 ký tự!");
            return;
        }

        const btn = document.querySelector('#forgot-pass-form .btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Đang xử lý...';
        btn.disabled = true;

        try {
            // Gọi API endpoint /change-password
            const response = await fetch(`${this.API_BASE_URL}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                document.getElementById('forgot-pass-form').reset();
                this.switchMode('login'); // Tự động chuyển về trang đăng nhập
            } else {
                alert("Lỗi: " + (data.message || "Không thể đổi mật khẩu"));
            }
        } catch (error) {
            console.error("Lỗi đổi mật khẩu:", error);
            alert("Không thể kết nối đến server!");
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    },

    logout: function() {
        if(confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('user_token');
            window.location.href = 'Login.html';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});