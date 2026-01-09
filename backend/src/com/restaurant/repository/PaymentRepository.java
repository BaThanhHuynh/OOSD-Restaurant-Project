package com.restaurant.repository;

import com.restaurant.model.entity.Payment;
import com.restaurant.model.enums.PaymentMethod;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Repository cho Payment - CRUD operations
 */
public class PaymentRepository {
    private final Map<Integer, Payment> payments = new HashMap<>();
    private int nextId = 1;

    public Payment create(int orderId, double amount, PaymentMethod method) {
        Payment payment = new Payment(nextId, orderId, amount, method);
        payments.put(nextId, payment);
        nextId++;
        return payment;
    }

    public Payment findById(int paymentId) {
        return payments.get(paymentId);
    }

    public Payment findByOrderId(int orderId) {
        return payments.values().stream()
                .filter(p -> p.getOrderId() == orderId)
                .findFirst()
                .orElse(null);
    }

    public List<Payment> findAll() {
        return List.copyOf(payments.values());
    }

    public boolean update(Payment payment) {
        if (payments.containsKey(payment.getPaymentId())) {
            payments.put(payment.getPaymentId(), payment);
            return true;
        }
        return false;
    }

    public boolean delete(int paymentId) {
        return payments.remove(paymentId) != null;
    }

    public List<Payment> findPaidPayments() {
        return payments.values().stream()
                .filter(Payment::isPaid)
                .collect(Collectors.toList());
    }

    public int getTotalPayments() {
        return payments.size();
    }
}
