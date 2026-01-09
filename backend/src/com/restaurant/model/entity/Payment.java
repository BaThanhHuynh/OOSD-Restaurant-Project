package com.restaurant.model.entity;

import com.restaurant.model.enums.PaymentMethod;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho một khoản thanh toán
 */
public class Payment {
    private final int paymentId;
    private final int orderId;
    private final double amount;
    private final PaymentMethod method;
    private boolean isPaid;
    private final LocalDateTime createdAt;
    private LocalDateTime paidAt;

    public Payment(int paymentId, int orderId, double amount, PaymentMethod method) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
        }
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.isPaid = false;
        this.createdAt = LocalDateTime.now();
        this.paidAt = null;
    }

    public Payment(int paymentId, int orderId, double amount) {
        this(paymentId, orderId, amount, PaymentMethod.CASH);
    }

    // Getters
    public int getPaymentId() {
        return paymentId;
    }

    public int getOrderId() {
        return orderId;
    }

    public double getAmount() {
        return amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    // Business Methods
    public void completePayment() {
        this.isPaid = true;
        this.paidAt = LocalDateTime.now();
    }

    public String getPaymentStatus() {
        return isPaid ? "Đã thanh toán" : "Chưa thanh toán";
    }

    @Override
    public String toString() {
        return String.format("Thanh toán #%d - Đơn hàng #%d - %,.0fđ - %s",
                paymentId, orderId, amount, method.getLabel());
    }
}
