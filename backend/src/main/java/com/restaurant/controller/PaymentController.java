package com.restaurant.controller;

import com.restaurant.model.entity.Payment;
import com.restaurant.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // API: POST /api/payment/pay
    @PostMapping("/pay")
    public String checkout(@RequestBody Payment payment) {
        try {
            paymentService.processPayment(payment);
            return "Thanh toán thành công cho bàn " + payment.getTableId();
        } catch (Exception e) {
            return "Lỗi thanh toán: " + e.getMessage();
        }
    }
}