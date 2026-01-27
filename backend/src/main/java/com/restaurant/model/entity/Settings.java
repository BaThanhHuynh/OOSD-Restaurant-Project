package com.restaurant.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "settings")
public class Settings {
    
    @Id
    private int id = 1; // Luôn mặc định ID là 1 (chỉ có 1 dòng cấu hình)

    @Column(name = "restaurant_name")
    private String restaurantName;

    @Column(name = "address")
    private String address;

    @Column(name = "tax_rate")
    private int taxRate; // Thuế VAT (%)

    @Column(name = "currency")
    private String currency;

    public Settings() {}

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getTaxRate() { return taxRate; }
    public void setTaxRate(int taxRate) { this.taxRate = taxRate; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}