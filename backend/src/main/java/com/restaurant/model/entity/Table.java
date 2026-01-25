package com.restaurant.model.entity;

import com.restaurant.model.enums.TableStatus; // [QUAN TRỌNG] Import Enum

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
@jakarta.persistence.Table(name = "restaurant_tables")
public class Table {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    // [SỬA LỖI] Thay String bằng TableStatus
    @Enumerated(EnumType.STRING) 
    @Column(nullable = false)
    private TableStatus status; 

    @Column(nullable = false)
    private int capacity;

    public Table() {}

    // Constructor cập nhật theo Enum
    public Table(int id, String name, TableStatus status, int capacity) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.capacity = capacity;
    }

    // --- Getters & Setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // [QUAN TRỌNG] Getter/Setter phải dùng TableStatus
    public TableStatus getStatus() { return status; }
    public void setStatus(TableStatus status) { this.status = status; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}