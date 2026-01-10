package com.restaurant.model.entity;

import com.restaurant.model.enums.MenuItemStatus;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho một mục trong thực đơn
 */
public class MenuItem {
    private final int itemId;
    private final String name;
    private final double price;
    private final String description;
    private MenuItemStatus status;
    private final LocalDateTime createdAt;

    public MenuItem(int itemId, String name, double price, String description) {
        this.itemId = itemId;
        this.name = name;
        this.price = price;
        this.description = description;
        this.status = MenuItemStatus.AVAILABLE;
        this.createdAt = LocalDateTime.now();
    }

    public MenuItem(int itemId, String name, double price) {
        this(itemId, name, price, "");
    }

    // Getters
    public int getItemId() {
        return itemId;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public MenuItemStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Business Methods
    public void setAvailable() {
        this.status = MenuItemStatus.AVAILABLE;
    }

    public void setOutOfStock() {
        this.status = MenuItemStatus.OUT_OF_STOCK;
    }

    public boolean isAvailable() {
        return status == MenuItemStatus.AVAILABLE;
    }

    @Override
    public String toString() {
        return String.format("%s - %,.0fđ", name, price);
    }
}
