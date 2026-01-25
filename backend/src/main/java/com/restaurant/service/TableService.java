package com.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import com.restaurant.repository.TableRepository;

@Service
public class TableService {

    private final TableRepository tableRepository;

    @Autowired
    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public Optional<Table> getTableById(int id) {
        return tableRepository.findById(id);
    }

    public Table saveTable(Table table) {
        if (table.getStatus() == null) {
            table.setStatus(TableStatus.AVAILABLE);
        }
        return tableRepository.save(table);
    }

    public Table updateStatus(int id, TableStatus newStatus) {
        return tableRepository.findById(id).map(table -> {
            table.setStatus(newStatus);
            return tableRepository.save(table);
        }).orElse(null);
    }

    public void deleteTable(int id) {
        if (tableRepository.existsById(id)) {
            tableRepository.deleteById(id);
        }
    }

    /**
     * Hàm xử lý checkout bàn:
     * 1. Được gọi từ PaymentService sau khi thanh toán thành công.
     * 2. Reset trạng thái bàn về AVAILABLE (Trống).
     * 3. Lưu cập nhật xuống Database.
     */
    public void checkoutTable(int tableId) {
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        if (tableOpt.isPresent()) {
            Table table = tableOpt.get();
            table.setStatus(TableStatus.AVAILABLE); // Reset về bàn trống
            tableRepository.save(table); // Lưu vào DB
        }
    }
}