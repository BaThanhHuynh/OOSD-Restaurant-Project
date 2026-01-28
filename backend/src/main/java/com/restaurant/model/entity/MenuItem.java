package com.restaurant.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "category_id")
    private String categoryId;

    // [QUAN TRỌNG] Dùng String thay vì Enum để tránh lỗi dữ liệu
    // Giá trị sẽ là "AVAILABLE" hoặc "OUT_OF_STOCK"
    @Column(name = "status")
    private String status = "AVAILABLE"; 

    @Column(name = "badge")
    private String badge;

    @Column(name = "description")
    private String description;

    // --- CONSTRUCTORS ---
    public MenuItem() {}

    // Constructor đã được sửa lại tham số status là String
    public MenuItem(int id, String name, double price, String imageUrl, String categoryId, String status) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.status = status;
    }

    // --- GETTERS & SETTERS ---
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

    // Getter trả về String
    public String getStatus() { return status; }
    
    // Setter nhận vào String
    public void setStatus(String status) { this.status = status; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}