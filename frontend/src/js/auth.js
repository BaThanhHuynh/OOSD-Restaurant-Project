// frontend/src/js/auth.js

const auth = {
    init: function() {
        this.bindEvents();
        this.checkLoginStatus();
    },

    checkLoginStatus: function() {
        const user = localStorage.getItem('user_token');
        const isLoginPage = window.location.pathname.includes('Login.html') || window.location.pathname.includes('login.html'); // Check cả 2 trường hợp hoa thường

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

    // --- HÀM MỚI: Tự động điền thông tin khi chọn menu ---
    quickLogin: function(roleValue) {
        if (!roleValue) return;

        const usernameInput = document.getElementById('login-username');
        const passwordInput = document.getElementById('login-password');

        // Tự động điền username
        usernameInput.value = roleValue;
        
        // Tự động điền pass (để demo cho nhanh)
        passwordInput.value = '123456'; 

        // Hiệu ứng nháy nhẹ ô input để báo hiệu đã điền
        usernameInput.style.backgroundColor = '#e8f5e9';
        setTimeout(() => usernameInput.style.backgroundColor = 'transparent', 300);
    },
    // -----------------------------------------------------

    switchMode: function(mode) {
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        if (mode === 'login') {
            document.getElementById('login-form').classList.add('active');
        } else {
            document.getElementById('register-form').classList.add('active');
        }
    },

    handleLogin: function() {
        const usernameInput = document.getElementById('login-username');
        const username = usernameInput ? usernameInput.value.trim() : '';

        if (username) {
            // Logic xác định quyền dựa trên username (giống logic cũ để khớp với app.js)
            let role = 'admin'; 
            let name = 'Quản lý';

            if (username === 'thungan') {
                role = 'cashier';
                name = 'Thu Ngân';
            } else if (username === 'nhanvien') {
                role = 'staff';
                name = 'Nhân Viên';
            }

            const userData = {
                name: name,
                role: role,
                username: username
            };
            
            localStorage.setItem('user_token', JSON.stringify(userData));
            
            // Chuyển trang
            window.location.href = 'index.html';
        } else {
            alert('Vui lòng nhập tên đăng nhập hoặc chọn vai trò!');
        }
    },

    handleRegister: function() {
        const pass = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (pass !== confirm) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        this.switchMode('login');
    },

    logout: function() {
        if(confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('user_token');
            window.location.href = 'Login.html';
        }
    }
};

auth.init();