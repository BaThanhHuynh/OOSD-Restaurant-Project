package com.restaurant.model.entity;

import jakarta.persistence.Column; // Nhớ import thư viện JPA
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@jakarta.persistence.Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(name = "image_url") // Trong SQL là image_url
    private String imageUrl;

    @Column(name = "category_id") // Trong SQL là category_id
    private String categoryId;

    @Column(name = "status")
    private String status = "available"; // Mặc định là 'available'

    // Bổ sung thêm 2 trường này cho khớp SQL (tránh lỗi khi select *)
    @Column(name = "badge")
    private String badge;

    @Column(name = "description")
    private String description;

    // --- CONSTRUCTORS ---
    public MenuItem() {}

    public MenuItem(int id, String name, double price, String imageUrl, String categoryId, String status) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.status = status;
    }

    // --- GETTERS & SETTERS (Bắt buộc phải có đủ) ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}