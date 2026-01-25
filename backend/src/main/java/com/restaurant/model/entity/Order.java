package com.restaurant.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.restaurant.model.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

/**
 * Entity đại diện cho một Order (Đơn hàng)
 */
@Entity
@jakarta.persistence.Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private Table table;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    // --- [LOGIC MỚI] Trạng thái quy trình (New -> Cooking -> Completed -> Paid) ---
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    // --- [LOGIC CŨ] Trạng thái thanh toán của DB (unpaid -> paid) ---
    // [QUAN TRỌNG] Thêm dòng này để map với cột payment_status trong database
    @Column(name = "payment_status")
    private String paymentStatus = "unpaid"; 

    @Column(nullable = false)
    private LocalDateTime orderTime;

    @Column
    private LocalDateTime completedTime;

    private double totalAmount;

    // Constructor mặc định
    public Order() {
        this.orderTime = LocalDateTime.now();
        this.orderStatus = OrderStatus.NEW;
        this.paymentStatus = "unpaid"; // Mặc định khi tạo mới
    }

    // Constructor với table
    public Order(Table table) {
        this();
        this.table = table;
    }

    // ======= BUSINESS METHODS =======

    public void addItem(OrderItem item) {
        this.orderItems.add(item);
        item.setOrder(this);
        calculateTotalAmount();
    }

    public void removeItem(OrderItem item) {
        this.orderItems.remove(item);
        item.setOrder(null);
        calculateTotalAmount();
    }

    public void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .mapToDouble(OrderItem::calculateSubtotal)
                .sum();
    }

    public void completeOrder() {
        this.orderStatus = OrderStatus.COMPLETED;
        this.completedTime = LocalDateTime.now();
    }

    public void updateOrderStatus() {
        if (this.orderStatus == OrderStatus.PAID) {
            return;
        }

        boolean allServed = orderItems.stream()
                .allMatch(item -> item.getDishStatus().toString().equals("SERVED"));
        
        if (allServed && !orderItems.isEmpty()) {
            this.orderStatus = OrderStatus.COMPLETED;
            this.completedTime = LocalDateTime.now();
        } else if (!orderItems.isEmpty()) {
            this.orderStatus = OrderStatus.IN_PROGRESS;
        }
    }

    // ======= GETTERS & SETTERS =======

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Table getTable() { return table; }
    public void setTable(Table table) { this.table = table; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
        calculateTotalAmount();
    }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    // [QUAN TRỌNG] Getter & Setter cho paymentStatus
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public LocalDateTime getCompletedTime() { return completedTime; }
    public void setCompletedTime(LocalDateTime completedTime) { this.completedTime = completedTime; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
}