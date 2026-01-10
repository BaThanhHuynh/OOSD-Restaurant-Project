package com.restaurant.controller;

import com.restaurant.model.entity.Payment;
import com.restaurant.model.enums.PaymentMethod;
import com.restaurant.pattern.strategy.PaymentStrategy;
import com.restaurant.service.PaymentService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các request về Payment
 */
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public Map<String, Object> createPayment(int orderId, double amount, String method) {
        try {
            PaymentMethod paymentMethod = PaymentMethod.valueOf(method.toUpperCase());
            Payment payment = paymentService.createPayment(orderId, amount, paymentMethod);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo thanh toán cho đơn hàng " + orderId);
            
            Map<String, Object> data = new HashMap<>();
            data.put("payment_id", payment.getPaymentId());
            data.put("order_id", payment.getOrderId());
            data.put("amount", payment.getAmount());
            data.put("method", payment.getMethod().getValue());
            data.put("status", payment.getPaymentStatus());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> completePayment(int paymentId, PaymentStrategy strategy) {
        try {
            paymentService.completePayment(paymentId, strategy);
            Payment payment = paymentService.getPayment(paymentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thanh toán " + paymentId + " đã hoàn thành");
            
            Map<String, Object> data = new HashMap<>();
            data.put("payment_id", payment.getPaymentId());
            data.put("amount", payment.getAmount());
            data.put("status", payment.getPaymentStatus());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getPaymentInfo(int paymentId) {
        try {
            Payment payment = paymentService.getPayment(paymentId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            Map<String, Object> data = new HashMap<>();
            data.put("payment_id", payment.getPaymentId());
            data.put("order_id", payment.getOrderId());
            data.put("amount", payment.getAmount());
            data.put("method", payment.getMethod().getValue());
            data.put("status", payment.getPaymentStatus());
            data.put("created_at", payment.getCreatedAt().toString());
            data.put("paid_at", payment.getPaidAt() != null ? payment.getPaidAt().toString() : null);
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getPaymentByOrder(int orderId) {
        try {
            Payment payment = paymentService.getPaymentByOrder(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            Map<String, Object> data = new HashMap<>();
            data.put("payment_id", payment.getPaymentId());
            data.put("order_id", payment.getOrderId());
            data.put("amount", payment.getAmount());
            data.put("method", payment.getMethod().getValue());
            data.put("status", payment.getPaymentStatus());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = payments.stream().map(p -> {
                Map<String, Object> paymentData = new HashMap<>();
                paymentData.put("payment_id", p.getPaymentId());
                paymentData.put("order_id", p.getOrderId());
                paymentData.put("amount", p.getAmount());
                paymentData.put("method", p.getMethod().getValue());
                paymentData.put("status", p.getPaymentStatus());
                return paymentData;
            }).toList();
            
            response.put("data", data);
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }
}
