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

    // GET: Lấy danh sách
    @GetMapping
    public List<MenuItem> showMenu() {
        return menuService.getFullMenu(); 
    }

    // POST: Thêm món (Quan trọng: đường dẫn là /add)
    @PostMapping("/add") 
    public String addMenuItem(@RequestBody MenuItem item) {
        try {
            // Truyền nguyên cục item xuống Service
            menuService.addMenuItem(item);
            return "Thành công: Đã thêm món " + item.getName();
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }

    // DELETE: Xóa món
    @DeleteMapping("/{id}")
    public String removeMenuItem(@PathVariable int id) {
        try {
            menuService.removeMenuItem(id);
            return "Đã xóa món ID " + id;
        } catch (Exception e) {
            return "Lỗi: " + e.getMessage();
        }
    }
}