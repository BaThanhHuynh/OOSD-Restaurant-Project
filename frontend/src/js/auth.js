// frontend/src/js/auth.js

const auth = {
    // Cấu hình đường dẫn API (Backend phải đang chạy)
    // Giả sử server Java Spring Boot của bạn chạy ở cổng 8080
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
    },

    // Chuyển đổi qua lại giữa form đăng nhập/đăng ký
    switchMode: function(mode) {
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        if (mode === 'login') {
            document.getElementById('login-form').classList.add('active');
        } else {
            document.getElementById('register-form').classList.add('active');
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

    // --- GỌI API ĐĂNG KÝ (Lưu vào Database thật) ---
    handleRegister: async function() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;
        
        const emailPrefix = document.getElementById('reg-email-prefix').value.trim();
        const emailSuffix = document.getElementById('reg-email-suffix').textContent;

        // 1. Validate dữ liệu đầu vào
        if (!username || !emailPrefix || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        // 2. Ghép email hoàn chỉnh
        const fullEmail = emailPrefix + emailSuffix;

        // 3. Chuẩn bị dữ liệu gửi đi (JSON)
        // Lưu ý: Không gửi full_name vì database đã xóa cột này
        const registerData = {
            username: username,
            password: password,
            email: fullEmail,
            role: role
        };

        try {
            // Gửi request POST đến Backend
            const response = await fetch(`${this.API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            // 4. Xử lý phản hồi từ Server
            if (response.ok) {
                alert(`Đăng ký thành công!\nTài khoản: ${username}\nEmail: ${fullEmail}\nVui lòng đăng nhập.`);
                
                // Reset form và chuyển về trang đăng nhập
                document.getElementById('register-form').reset();
                this.switchMode('login');
                
                // Điền sẵn username để tiện đăng nhập
                document.getElementById('login-username').value = username;
            } else {
                // Nếu server trả về lỗi (ví dụ: trùng username)
                const errorData = await response.text(); // Hoặc response.json() tùy backend
                alert("Đăng ký thất bại: " + errorData);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại Backend.");
        }
    },

    // --- GỌI API ĐĂNG NHẬP (Check Database thật) ---
    handleLogin: async function() {
        const loginInput = document.getElementById('login-username').value.trim();
        const passwordInput = document.getElementById('login-password').value;

        if (!loginInput || !passwordInput) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Dữ liệu đăng nhập
        const loginData = {
            username: loginInput, // Backend cần xử lý để check được cả username hoặc email
            password: passwordInput
        };

        // Hiệu ứng loading nút bấm
        const btn = document.querySelector('#login-form .btn-submit');
        const originalText = btn.textContent;
        btn.textContent = 'Đang xử lý...';
        btn.disabled = true;

        try {
            const response = await fetch(`${this.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                // Server trả về thông tin User (và có thể là Token JWT)
                const userData = await response.json();
                
                // Lưu thông tin vào LocalStorage để duy trì phiên đăng nhập ở Frontend
                // userData nên có format: { username: '...', role: '...', email: '...' }
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