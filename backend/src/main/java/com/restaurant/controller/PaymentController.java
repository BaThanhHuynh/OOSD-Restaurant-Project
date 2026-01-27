package com.restaurant.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<String> payOrder(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Lấy dữ liệu thô từ Frontend gửi lên
            // Lưu ý: Phải ép kiểu về String rồi parse để tránh lỗi Integer vs Long
            int tableId = Integer.parseInt(payload.get("tableId").toString());
            double amount = Double.parseDouble(payload.get("amount").toString());
            String method = payload.get("method").toString();

            // 2. Gọi Service xử lý logic nghiệp vụ
            paymentService.processPayment(tableId, amount, method);

            return ResponseEntity.ok("Thanh toán thành công!");
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console để debug nếu có
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}