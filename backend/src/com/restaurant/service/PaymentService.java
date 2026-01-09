package com.restaurant.service;

import com.restaurant.model.entity.Payment;
import com.restaurant.model.enums.PaymentMethod;
import com.restaurant.pattern.strategy.PaymentStrategy;
import com.restaurant.repository.PaymentRepository;

/**
 * Service xử lý business logic cho Payment
 */
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment createPayment(int orderId, double amount, PaymentMethod method) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        return paymentRepository.create(orderId, amount, method);
    }

    public Payment getPayment(int paymentId) {
        Payment payment = paymentRepository.findById(paymentId);
        if (payment == null) {
            throw new IllegalArgumentException("Thanh toán " + paymentId + " không tồn tại");
        }
        return payment;
    }

    public Payment getPaymentByOrder(int orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId);
        if (payment == null) {
            throw new IllegalArgumentException("Không có thanh toán cho đơn hàng " + orderId);
        }
        return payment;
    }

    public java.util.List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public boolean completePayment(int paymentId, PaymentStrategy strategy) {
        Payment payment = getPayment(paymentId);

        if (strategy != null) {
            boolean success = strategy.pay(payment.getAmount());
            if (success) {
                payment.completePayment();
                paymentRepository.update(payment);
                return true;
            } else {
                throw new RuntimeException("Thanh toán thất bại");
            }
        } else {
            payment.completePayment();
            paymentRepository.update(payment);
            return true;
        }
    }

    public java.util.List<Payment> getPaidPayments() {
        return paymentRepository.findPaidPayments();
    }

    public void deletePayment(int paymentId) {
        if (!paymentRepository.delete(paymentId)) {
            throw new IllegalArgumentException("Thanh toán " + paymentId + " không tồn tại");
        }
    }
}
