package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.Table;
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
    @PostMapping("/add")
    public Table addTable(@RequestBody Table table) {
        return tableService.saveTable(table);
    }

    // 3. Cập nhật trạng thái (VD: Khách vào ngồi -> occupied)
    @PutMapping("/{id}/status")
    public Table updateTableStatus(@PathVariable int id, @RequestParam String status) {
        return tableService.updateStatus(id, status);
    }

    // 4. Xóa bàn
    @DeleteMapping("/{id}")
    public String deleteTable(@PathVariable int id) {
        tableService.deleteTable(id);
        return "Đã xóa bàn ID: " + id;
    }
}