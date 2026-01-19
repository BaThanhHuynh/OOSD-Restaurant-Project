package com.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.Table;
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
        if (table.getStatus() == null) table.setStatus("available");
        return tableRepository.save(table);
    }

    public Table updateStatus(int id, String newStatus) {
        return tableRepository.findById(id).map(table -> {
            table.setStatus(newStatus);
            return tableRepository.save(table);
        }).orElse(null);
    }

    public void deleteTable(int id) {
        if(tableRepository.existsById(id)) tableRepository.deleteById(id);
    }

    // --- [QUAN TRỌNG] HÀM CÒN THIẾU GÂY LỖI ---
    public void checkoutTable(int tableId) {
        // Tìm bàn và reset trạng thái về "available"
        Optional<Table> tableOpt = tableRepository.findById(tableId);
        if (tableOpt.isPresent()) {
            Table table = tableOpt.get();
            table.setStatus("available");
            tableRepository.save(table);
        }
    }
}