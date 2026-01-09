package com.restaurant.model.entity;

import com.restaurant.model.enums.OrderStatus;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity đại diện cho một đơn hàng
 */
public class Order {
    private final int orderId;
    private final int tableId;
    private OrderStatus status;
    private final List<OrderItem> items;
    private double totalAmount;
    private final LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public Order(int orderId, int tableId) {
        this.orderId = orderId;
        this.tableId = tableId;
        this.status = OrderStatus.NEW;
        this.items = new ArrayList<>();
        this.totalAmount = 0.0;
        this.createdAt = LocalDateTime.now();
        this.completedAt = null;
    }

    // Getters
    public int getOrderId() {
        return orderId;
    }

    public int getTableId() {
        return tableId;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public List<OrderItem> getItems() {
        return new ArrayList<>(items);
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    // Business Methods
    public void addItem(OrderItem orderItem) {
        items.add(orderItem);
        calculateTotal();
    }

    public boolean removeItem(int orderItemId) {
        boolean removed = items.removeIf(item -> item.getOrderItemId() == orderItemId);
        if (removed) {
            calculateTotal();
        }
        return removed;
    }

    private void calculateTotal() {
        totalAmount = items.stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();
    }

    public void changeStatus(OrderStatus newStatus) {
        this.status = newStatus;
        if (newStatus == OrderStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public int getItemCount() {
        return items.size();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    @Override
    public String toString() {
        return String.format("Đơn hàng #%d - Bàn %d - Tổng: %,.0fđ",
                orderId, tableId, totalAmount);
    }
}
