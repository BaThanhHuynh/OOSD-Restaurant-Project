package com.restaurant.model.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@jakarta.persistence.Table(name = "daily_statistics")
    public class DailyStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "stat_date", nullable = false, unique = true)
    private LocalDate statDate;

    @Column(name = "total_revenue")
    private Double totalRevenue;

    @Column(name = "total_orders")
    private Integer totalOrders;

    @Column(name = "popular_dish_id")
    private Integer popularDishId;

    @Column(name = "popular_dish_name")
    private String popularDishName;

    // Constructors
    public DailyStatistic() {}

    public DailyStatistic(LocalDate statDate, Double totalRevenue, Integer totalOrders, Integer popularDishId, String popularDishName) {
        this.statDate = statDate;
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.popularDishId = popularDishId;
        this.popularDishName = popularDishName;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public LocalDate getStatDate() { return statDate; }
    public void setStatDate(LocalDate statDate) { this.statDate = statDate; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }

    public Integer getPopularDishId() { return popularDishId; }
    public void setPopularDishId(Integer popularDishId) { this.popularDishId = popularDishId; }

    public String getPopularDishName() { return popularDishName; }
    public void setPopularDishName(String popularDishName) { this.popularDishName = popularDishName; }
}