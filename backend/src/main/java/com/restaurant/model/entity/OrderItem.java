package com.restaurant.model.entity;

import java.time.LocalDateTime;

/**
 * Entity đại diện cho một mục trong đơn hàng
 */
public class OrderItem {
    private final int orderItemId;
    private final MenuItem menuItem;
    private int quantity;
    private final String notes;
    private final LocalDateTime createdAt;

    public OrderItem(int orderItemId, MenuItem menuItem, int quantity, String notes) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }
        this.orderItemId = orderItemId;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    public OrderItem(int orderItemId, MenuItem menuItem, int quantity) {
        this(orderItemId, menuItem, quantity, "");
    }

    // Getters
    public int getOrderItemId() {
        return orderItemId;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Business Methods
    public double getTotalPrice() {
        return menuItem.getPrice() * quantity;
    }

    public void updateQuantity(int newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }
        this.quantity = newQuantity;
    }

    @Override
    public String toString() {
        return String.format("%s x%d = %,.0fđ", menuItem.getName(), quantity, getTotalPrice());
    }
}
