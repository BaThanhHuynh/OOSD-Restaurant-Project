package com.restaurant.service;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import com.restaurant.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    // [SỬA LỖI] Dùng Enum TableStatus.AVAILABLE thay vì chuỗi "available"
    public Table saveTable(Table table) {
        if (table.getStatus() == null) {
            table.setStatus(TableStatus.AVAILABLE);
        }
        return tableRepository.save(table);
    }

    // [SỬA LỖI] Tham số nhận vào là Enum
    public Table updateStatus(int id, TableStatus newStatus) {
        return tableRepository.findById(id).map(table -> {
            table.setStatus(newStatus);
            return tableRepository.save(table);
        }).orElse(null);
    }

    public void deleteTable(int id) {
        if(tableRepository.existsById(id)) tableRepository.deleteById(id);
    }

    // [QUAN TRỌNG] Hàm Checkout được PaymentService gọi
    public void checkoutTable(int tableId) {
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        if (tableOpt.isPresent()) {
            Table table = tableOpt.get();
            // [SỬA LỖI] Reset về Enum AVAILABLE
            table.setStatus(TableStatus.AVAILABLE); 
            tableRepository.save(table);
        }
    }
}