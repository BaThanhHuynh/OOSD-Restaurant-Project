package com.restaurant.controller;

import com.restaurant.dto.LoginRequest;
import com.restaurant.dto.RegisterRequest;
import com.restaurant.model.entity.User;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // API Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // 1. Kiểm tra trùng Username
        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }

        // 2. Kiểm tra trùng Email
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã được sử dụng!");
        }

        // 3. Tạo User mới
        User newUser = new User(req.getUsername(), req.getPassword(), req.getEmail(), req.getRole());
        userRepository.save(newUser);

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // API Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // 1. Tìm user theo Username HOẶC Email (để hỗ trợ đăng nhập bằng cả 2)
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(req.getUsername());
        }

        // 2. Kiểm tra mật khẩu (So sánh chuỗi thường - Lưu ý: Thực tế nên mã hóa)
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(req.getPassword())) {
                // Đăng nhập thành công -> Trả về thông tin User (trừ mật khẩu)
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
    }
}