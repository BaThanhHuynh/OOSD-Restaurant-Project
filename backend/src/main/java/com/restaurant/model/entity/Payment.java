package com.restaurant.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
@jakarta.persistence.Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "table_id")
    private int tableId;

    @Column(name = "amount")
    private double amount;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "method")
    private String method;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    public Payment() {}

    public Payment(int tableId, double amount, String method) {
        this.tableId = tableId;
        this.amount = amount;
        this.method = method;
        this.paymentMethod = method; 
        this.paymentTime = LocalDateTime.now();
    }
    
    // --- KHU VỰC QUAN TRỌNG: CÁC HÀM GETTER & SETTER ---
    public int getTableId() { 
        return tableId; 
    }
    
    public void setTableId(int tableId) { 
        this.tableId = tableId; 
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public LocalDateTime getPaymentTime() { return paymentTime; }
    public void setPaymentTime(LocalDateTime paymentTime) { this.paymentTime = paymentTime; }

    public String getMethod() { return method; }
    public void setMethod(String method) { 
        this.method = method; 
        this.paymentMethod = method; 
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { 
        this.paymentMethod = paymentMethod;
        this.method = paymentMethod; 
    }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}