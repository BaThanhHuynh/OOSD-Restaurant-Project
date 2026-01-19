package com.restaurant.repository;

import com.restaurant.model.entity.Payment;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PaymentRepository {
    private final List<Payment> payments = new ArrayList<>();
    private int nextId = 1;

    public void save(Payment payment) {
        payments.add(payment);
    }

    public int generateId() {
        return nextId++;
    }

    public List<Payment> findAll() {
        return payments;
    }
}