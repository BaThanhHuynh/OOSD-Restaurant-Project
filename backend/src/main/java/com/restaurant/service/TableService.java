package com.restaurant.service;

import com.restaurant.model.entity.Table;
import com.restaurant.repository.TableRepository;

/**
 * Service xử lý business logic cho Table
 */
public class TableService {
    private final TableRepository tableRepository;

    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public Table createTable(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Sức chứa phải lớn hơn 0");
        }
        return tableRepository.create(capacity);
    }

    public Table getTable(int tableId) {
        Table table = tableRepository.findById(tableId);
        if (table == null) {
            throw new IllegalArgumentException("Bàn " + tableId + " không tồn tại");
        }
        return table;
    }

    public java.util.List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public void occupyTable(int tableId) {
        Table table = getTable(tableId);
        table.occupy();
        tableRepository.update(table);
    }

    public void startOrdering(int tableId) {
        Table table = getTable(tableId);
        table.startOrdering();
        tableRepository.update(table);
    }

    public void markPaid(int tableId) {
        Table table = getTable(tableId);
        table.markPaid();
        tableRepository.update(table);
    }

    public void releaseTable(int tableId) {
        Table table = getTable(tableId);
        table.release();
        tableRepository.update(table);
    }

    public void setTableOrder(int tableId, int orderId) {
        Table table = getTable(tableId);
        table.setCurrentOrder(orderId);
        tableRepository.update(table);
    }

    public java.util.List<Table> getAvailableTables() {
        return tableRepository.findAvailableTables();
    }

    public String getTableStatus(int tableId) {
        Table table = getTable(tableId);
        return table.getStatus().getLabel();
    }

    public void deleteTable(int tableId) {
        if (!tableRepository.delete(tableId)) {
            throw new IllegalArgumentException("Bàn " + tableId + " không tồn tại");
        }
    }
}
