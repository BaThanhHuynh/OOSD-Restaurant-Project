package com.restaurant.controller;

import com.restaurant.model.entity.Payment;
import com.restaurant.service.PaymentService;
import com.restaurant.strategy.impl.BankTransferPayment;
import com.restaurant.strategy.impl.CashPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{tableId}/checkout")
    public String checkout(@PathVariable int tableId, @RequestParam double amount, @RequestParam String method) {
        try {
            if ("CASH".equalsIgnoreCase(method)) {
                Payment p = paymentService.processCheckout(tableId, amount, new CashPayment());
                return "Thành công: " + p.toString();
            } else if ("BANK".equalsIgnoreCase(method)) {
                Payment p = paymentService.processCheckout(tableId, amount, new BankTransferPayment());
                return "Thành công: " + p.toString();
            }
            return "Lỗi: Phương thức thanh toán không được hỗ trợ.";
        } catch (Exception e) {
            return "Lỗi thanh toán: " + e.getMessage();
        }
    }
}