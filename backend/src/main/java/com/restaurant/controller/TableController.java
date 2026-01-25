package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping; // [QUAN TRỌNG] Import Enum
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import com.restaurant.service.TableService;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    private final TableService tableService;

    @Autowired
    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    // 1. Lấy danh sách bàn
    @GetMapping
    public List<Table> getAllTables() {
        return tableService.getAllTables();
    }

    // 2. Thêm bàn mới
    // [SỬA LỖI] Bỏ "/add" để khớp với Frontend (POST /api/tables)
    @PostMapping 
    public ResponseEntity<Table> addTable(@RequestBody Table table) {
        return ResponseEntity.ok(tableService.saveTable(table));
    }

    // 3. Cập nhật trạng thái
    // [SỬA LỖI] Chuyển đổi String "occupied" -> Enum TableStatus.OCCUPIED
    @PutMapping("/{id}/status")
    public ResponseEntity<Table> updateTableStatus(@PathVariable int id, @RequestParam String status) {
        try {
            // Chuyển chuỗi sang Enum (không phân biệt hoa thường)
            TableStatus tableStatus = TableStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(tableService.updateStatus(id, tableStatus));
        } catch (IllegalArgumentException e) {
            // Nếu gửi sai status (vd: "abc") -> Báo lỗi Bad Request
            return ResponseEntity.badRequest().build();
        }
    }

    // 4. Xóa bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTable(@PathVariable int id) {
        tableService.deleteTable(id);
        return ResponseEntity.ok("Đã xóa bàn ID: " + id);
    }
}