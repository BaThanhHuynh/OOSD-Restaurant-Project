package com.restaurant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // [Mới] Dùng để chỉnh HTTP Status
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.Payment;
import com.restaurant.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // API: POST /api/payment/pay
    @PostMapping("/pay")
    public ResponseEntity<String> checkout(@RequestBody Payment payment) {
        try {
            // Gọi Service để xử lý: Lưu Payment, Set giờ, Reset bàn
            paymentService.processPayment(payment);
            
            // Nếu không lỗi -> Trả về HTTP 200 OK + Thông báo
            return ResponseEntity.ok("Thanh toán thành công cho bàn " + payment.getTableId());
            
        } catch (Exception e) {
            // Nếu có lỗi -> Trả về HTTP 400 BAD REQUEST + Lời nhắn lỗi
            // Điều này giúp Frontend (res.ok) nhận biết là thất bại
            return ResponseEntity.badRequest().body("Lỗi thanh toán: " + e.getMessage());
        }
    }
}