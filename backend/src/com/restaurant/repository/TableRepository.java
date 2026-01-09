package com.restaurant.repository;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Repository cho Table - CRUD operations
 */
public class TableRepository {
    private final Map<Integer, Table> tables = new HashMap<>();
    private int nextId = 1;

    public Table create(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Sức chứa phải lớn hơn 0");
        }
        Table table = new Table(nextId, capacity);
        tables.put(nextId, table);
        nextId++;
        return table;
    }

    public Table findById(int tableId) {
        return tables.get(tableId);
    }

    public List<Table> findAll() {
        return List.copyOf(tables.values());
    }

    public boolean update(Table table) {
        if (tables.containsKey(table.getTableId())) {
            tables.put(table.getTableId(), table);
            return true;
        }
        return false;
    }

    public boolean delete(int tableId) {
        return tables.remove(tableId) != null;
    }

    public List<Table> findAvailableTables() {
        return tables.values().stream()
                .filter(t -> t.getStatus() == TableStatus.AVAILABLE)
                .collect(Collectors.toList());
    }

    public int getTotalTables() {
        return tables.size();
    }
}
