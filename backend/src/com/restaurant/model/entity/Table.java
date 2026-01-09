package com.restaurant.model.entity;

import com.restaurant.model.enums.TableStatus;
import java.time.LocalDateTime;

/**
 * Entity đại diện cho một bàn trong nhà hàng
 */
public class Table {
    private final int tableId;
    private final int capacity;
    private TableStatus status;
    private Integer currentOrderId;
    private final LocalDateTime createdAt;

    public Table(int tableId, int capacity) {
        this.tableId = tableId;
        this.capacity = capacity;
        this.status = TableStatus.AVAILABLE;
        this.currentOrderId = null;
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public int getTableId() {
        return tableId;
    }

    public int getCapacity() {
        return capacity;
    }

    public TableStatus getStatus() {
        return status;
    }

    public Integer getCurrentOrderId() {
        return currentOrderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Business Methods
    public void occupy() {
        this.status = TableStatus.OCCUPIED;
    }

    public void startOrdering() {
        this.status = TableStatus.ORDERING;
    }

    public void markPaid() {
        this.status = TableStatus.PAID;
    }

    public void release() {
        this.status = TableStatus.AVAILABLE;
        this.currentOrderId = null;
    }

    public void setCurrentOrder(int orderId) {
        this.currentOrderId = orderId;
    }

    public boolean isAvailable() {
        return status == TableStatus.AVAILABLE;
    }

    @Override
    public String toString() {
        return String.format("Bàn %d - Sức chứa: %d - Trạng thái: %s",
                tableId, capacity, status.getLabel());
    }
}
