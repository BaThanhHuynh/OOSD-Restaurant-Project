// frontend/src/js/auth.js

const auth = {
    init: function() {
        this.bindEvents();
        this.checkLoginStatus();
    },

    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus: function() {
        const user = localStorage.getItem('user_token');
        const isLoginPage = window.location.pathname.includes('login.html');

        // Nếu đã có token mà đang ở trang login thì chuyển sang trang chủ
        if (user && isLoginPage) {
            window.location.href = 'index.html';
        }
        
        // (Optional) Nếu chưa có token mà KHÔNG phải trang login thì đá về login
        // Logic này hiện tại đang được xử lý cả ở Menu.js, giữ ở đây để an toàn thêm
        if (!user && !isLoginPage) {
            // Uncomment dòng dưới nếu muốn auth.js chịu trách nhiệm bảo vệ toàn bộ trang
            // window.location.href = 'login.html';
        }
    },

    bindEvents: function() {
        // Xử lý sự kiện Submit Đăng nhập
        const loginForm = document.getElementById('login-form');
        if(loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Xử lý sự kiện Submit Đăng ký
        const regForm = document.getElementById('register-form');
        if(regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    },

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
        const username = usernameInput ? usernameInput.value : '';

        // Giả lập check login (Trong thực tế sẽ gọi API)
        if (username) {
            // Lưu token giả vào localStorage
            const userData = {
                name: "Quản lý Demo", // Có thể thay bằng username nếu muốn
                role: "admin",
                username: username
            };
            localStorage.setItem('user_token', JSON.stringify(userData));
            
            alert('Đăng nhập thành công!');
            window.location.href = 'index.html';
        } else {
            alert('Vui lòng nhập tên đăng nhập');
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

    // Hàm gọi khi bấm nút Đăng xuất (dùng ở trang index.html)
    logout: function() {
        if(confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('user_token');
            window.location.href = 'login.html';
        }
    }
};

// Chạy auth
auth.init();