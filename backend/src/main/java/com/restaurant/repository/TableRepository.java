package com.restaurant.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.Table;

@Repository
public class TableRepository {

    public static TableRepository getInstance() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    // 3. Xóa biến static instance (không cần thiết trong Spring)
    private final List<Table> tables;

    // 4. Sửa Constructor thành public (để Spring có thể khởi tạo)
    public TableRepository() {
        tables = new ArrayList<>();
        
        for (int i = 1; i <= 50; i++) {
            tables.add(new Table(i, 100 + i, 4)); 
        }
    }

    // --- CÁC HÀM LOGIC DƯỚI ĐÂY GIỮ NGUYÊN 100% ---

    public List<Table> findAll() {
        return tables;
    }

    public Optional<Table> findById(int id) {
        return tables.stream()
                     .filter(t -> t.getId() == id)
                     .findFirst();
    }

    public void save(Table table) {
        findById(table.getId()).ifPresent(exist -> tables.remove(exist));
        tables.add(table);
    }

    public boolean delete(int id) {
        return tables.removeIf(t -> t.getId() == id);
    }
}