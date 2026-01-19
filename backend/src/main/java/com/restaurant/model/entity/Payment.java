package com.restaurant.model.entity;

import java.time.LocalDateTime;

public class Payment {
    private int id;
    private int orderId;
    private double amount;
    private String method;
    private LocalDateTime timestamp;

    public Payment(int id, int orderId, double amount, String method) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.timestamp = LocalDateTime.now();
    }

    // Getters
    public int getId() { return id; }
    public double getAmount() { return amount; }
    public String getMethod() { return method; }
    
    @Override
    public String toString() {
        return String.format("Hóa đơn #%d | Order: %d | Tiền: %.0fđ | %s | %s", 
                id, orderId, amount, method, timestamp.toString());
    }
}