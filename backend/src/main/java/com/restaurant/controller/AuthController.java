package com.restaurant.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.dto.ChangePasswordRequest;
import com.restaurant.dto.LoginRequest;
import com.restaurant.dto.RegisterRequest; // [QUAN TRỌNG] Nhớ import file này
import com.restaurant.model.entity.User;
import com.restaurant.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- API ĐĂNG NHẬP (Giữ nguyên) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.ok(Map.of(
                    "message", "Đăng nhập thành công",
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "email", user.getEmail()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Sai tài khoản hoặc mật khẩu"));
    }

    // --- API ĐĂNG KÝ (Giữ nguyên) ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại");
        }
        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(registerRequest.getPassword());
        newUser.setRole(registerRequest.getRole());
        newUser.setEmail(registerRequest.getEmail());
        userRepository.save(newUser);
        return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
    }

    // --- [MỚI] API ĐỔI MẬT KHẨU (Thêm đoạn này vào) ---
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        // 1. Tìm user theo username
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tên đăng nhập không tồn tại!"));
        }

        // 2. Kiểm tra mật khẩu cũ
        if (!user.getPassword().equals(request.getOldPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Mật khẩu cũ không chính xác!"));
        }

        // 3. Cập nhật mật khẩu mới
        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."));
    }
}