package com.restaurant.model.entity;

import com.restaurant.model.enums.MenuItemStatus;

public class MenuItem {
    // 1. Encapsulation
    private int id;
    private String name;
    private double price;
    private MenuItemStatus status;

    // 2. Constructor
    public MenuItem(int id, String name, double price) {
        this.id = id;
        this.name = name;
        setPrice(price);
        this.status = MenuItemStatus.AVAILABLE;
    }

    // 3. Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public final void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Giá món ăn không được âm");
        }
        this.price = price;
    }

    public MenuItemStatus getStatus() {
        return status;
    }

    public void setStatus(MenuItemStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        // Format giá tiền kiểu số thực 2 chữ số thập phân
        return String.format("Item [ID: %d | Tên: %-15s | Giá: %.2f | Trạng thái: %s]", 
                             id, name, price, status);
    }
}