package com.restaurant.model.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.restaurant.model.enums.OrderStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity đại diện cho một Order (Đơn hàng)
 * Một Order thuộc về một bàn và chứa nhiều OrderItem
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Column(nullable = false)
    private LocalDateTime orderTime;

    @Column
    private LocalDateTime completedTime;

    private double totalAmount;

    // Constructor mặc định
    public Order() {
        this.orderTime = LocalDateTime.now();
        this.orderStatus = OrderStatus.NEW;
    }

    // Constructor với table
    public Order(Table table) {
        this();
        this.table = table;
    }

    // ======= BUSINESS METHODS =======

    /**
     * Thêm món vào order
     */
    public void addItem(OrderItem item) {
        this.orderItems.add(item);
        item.setOrder(this); // Set bidirectional relationship
        calculateTotalAmount();
    }

    /**
     * Xóa món khỏi order
     */
    public void removeItem(OrderItem item) {
        this.orderItems.remove(item);
        item.setOrder(null); // Remove relationship
        calculateTotalAmount();
    }

    /**
     * Tính tổng tiền của order
     */
    public void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .mapToDouble(OrderItem::calculateSubtotal)
                .sum();
    }

    /**
     * Đánh dấu order là hoàn thành
     */
    public void completeOrder() {
        this.orderStatus = OrderStatus.COMPLETED;
        this.completedTime = LocalDateTime.now();
    }

    /**
     * Cập nhật trạng thái order dựa trên trạng thái của các món
     */
    public void updateOrderStatus() {
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Table getTable() {
        return table;
    }

    public void setTable(Table table) {
        this.table = table;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
        calculateTotalAmount();
    }

    public OrderStatus getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(LocalDateTime orderTime) {
        this.orderTime = orderTime;
    }

    public LocalDateTime getCompletedTime() {
        return completedTime;
    }

    public void setCompletedTime(LocalDateTime completedTime) {
        this.completedTime = completedTime;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", table=" + table.getName() +
                ", orderStatus=" + orderStatus +
                ", totalAmount=" + totalAmount +
                ", items=" + orderItems.size() +
                '}';
    }
}
