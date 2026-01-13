package com.restaurant.model.entity;

import com.restaurant.model.enums.TableStatus;

public class Table {
    // 1. Encapsulation: Thuộc tính private
    private int id;
    private int tableNumber;
    private int capacity;
    private TableStatus status;

    // 2. Constructor: Khởi tạo đối tượng chuẩn
    public Table(int id, int tableNumber, int capacity) {
        this.id = id;
        this.tableNumber = tableNumber;
        setCapacity(capacity); // Dùng setter để tận dụng validation
        this.status = TableStatus.AVAILABLE; // Mặc định khi tạo bàn là Trống
    }

    // 3. Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(int tableNumber) {
        this.tableNumber = tableNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    // Validation logic ngay trong Setter
    public final void setCapacity(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Sức chứa của bàn phải lớn hơn 0");
        }
        this.capacity = capacity;
    }

    public TableStatus getStatus() {
        return status;
    }

    public void setStatus(TableStatus status) {
        this.status = status;
    }

    // Method hỗ trợ hiển thị (Helper)
    @Override
    public String toString() {
        return String.format("Table [ID: %d | Số bàn: %d | Ghế: %d | Trạng thái: %s]", 
                             id, tableNumber, capacity, status);
    }
}