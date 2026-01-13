package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.service.MenuService;

@RestController 
@RequestMapping("/api/menu") 
@CrossOrigin(origins = "*") 
public class MenuController {

    private final MenuService menuService;

    @Autowired
    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // --- CÁC API ---

    // 1. Lấy toàn bộ Menu
    @GetMapping
    public List<MenuItem> showMenu() {
        return menuService.getFullMenu(); 
        // Spring sẽ tự động biến List<MenuItem> thành JSON để trả về cho Frontend
    }

    // 2. Thêm món mới
    @PostMapping
    public String addMenuItem(@RequestBody MenuItem item) {
        try {
            // Lấy dữ liệu từ gói JSON (item) gửi xuống Service
            menuService.addMenuItem(item.getId(), item.getName(), item.getPrice());
            return "Thành công: Đã thêm món '" + item.getName() + "'";
        } catch (Exception e) {
            return "Lỗi thêm món: " + e.getMessage();
        }
    }

    // 3. Xóa món
    @DeleteMapping("/{id}")
    public String removeMenuItem(@PathVariable int id) {
        try {
            menuService.removeMenuItem(id);
            return "Thành công: Đã xóa món có ID " + id;
        } catch (Exception e) {
            return "Lỗi xóa món: " + e.getMessage();
        }
    }
}