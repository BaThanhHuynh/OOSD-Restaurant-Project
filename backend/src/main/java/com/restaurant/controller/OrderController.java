package com.restaurant.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Class phụ để lưu thông tin món (Dùng nội bộ ở đây cho nhanh)
class OrderItem {
    public String name;
    public int price;
    public OrderItem(String name, int price) { this.name = name; this.price = price; }
}

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    // Kho chứa món ăn tạm thời: Map<ID_Bàn, Danh_sách_Món>
    private final static Map<Integer, List<OrderItem>> tableOrders = new HashMap<>();

    // 1. READ: Xem danh sách món của bàn
    @GetMapping("/{tableId}")
    public List<OrderItem> getItems(@PathVariable int tableId) {
        return tableOrders.getOrDefault(tableId, new ArrayList<>());
    }

    // 2. CREATE: Thêm món vào bàn
    @PostMapping("/{tableId}/add")
    public String addItem(@PathVariable int tableId, @RequestBody OrderItem item) {
        tableOrders.putIfAbsent(tableId, new ArrayList<>());
        tableOrders.get(tableId).add(item);
        return "Đã thêm: " + item.name;
    }

    // 3. DELETE: Xóa 1 món cụ thể (Theo tên món cho đơn giản)
    @DeleteMapping("/{tableId}/remove/{name}")
    public String removeItem(@PathVariable int tableId, @PathVariable String name) {
        List<OrderItem> items = tableOrders.get(tableId);
        if (items != null) {
            items.removeIf(item -> item.name.equals(name));
        }
        return "Đã xóa món: " + name;
    }

    // 4. DELETE ALL: Xóa sạch món khi thanh toán
    @DeleteMapping("/{tableId}")
    public void clearOrder(@PathVariable int tableId) {
        tableOrders.remove(tableId);
    }
}