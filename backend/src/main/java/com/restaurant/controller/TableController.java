package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin; // Import các annotation Web
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    // API: Lấy danh sách tất cả bàn
    // Frontend sẽ gọi: GET http://localhost:8080/api/tables
    @GetMapping
    public List<Table> getAllTables() {
        return tableService.getAllTables();
    }

    // API: Mở bàn (Check-in)
    // Frontend sẽ gọi: POST http://localhost:8080/api/tables/{id}/open
    @PostMapping("/{id}/open")
    public String openTable(@PathVariable int id) {
        try {
            tableService.openTable(id);
            return "Mở bàn " + id + " thành công!";
        } catch (Exception e) {
            return e.getMessage(); // Trả về lỗi nếu có
        }
    }

    // 3. API Thêm bàn mới (Create)
    @PostMapping("/add")
    public String addTable(@RequestBody Table table) {
        try {
            // Gọi service để tạo bàn (Lấy ID, Số bàn, Số ghế từ dữ liệu Frontend gửi lên)
            tableService.createTable(table.getId(), table.getTableNumber(), table.getCapacity());
            return "Thêm bàn thành công!";
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }

    // 4. API Xóa bàn (Delete)
    @DeleteMapping("/{id}")
    public String deleteTable(@PathVariable int id) {
        try {
            tableService.removeTable(id);
            return "Xóa bàn thành công!";
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }

    // 5. API Thanh toán (Checkout)
    @PostMapping("/{id}/checkout")
    public String checkoutTable(@PathVariable int id) {
        try {
            tableService.checkoutTable(id);
            return "Thanh toán thành công! Bàn đã trống.";
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }
}