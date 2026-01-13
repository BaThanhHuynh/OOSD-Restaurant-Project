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
        
        // Fake data để test
        tables.add(new Table(1, 101, 4));
        tables.add(new Table(2, 102, 2));
        tables.add(new Table(3, 103, 6));
    }

    // 5. Xóa hàm getInstance() -> Spring sẽ tự "tiêm" (inject) class này vào Service

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
        // Logic: Nếu tồn tại thì xóa cái cũ đi rồi add cái mới (Update)
        findById(table.getId()).ifPresent(exist -> tables.remove(exist));
        tables.add(table);
    }

    public boolean delete(int id) {
        return tables.removeIf(t -> t.getId() == id);
    }
}