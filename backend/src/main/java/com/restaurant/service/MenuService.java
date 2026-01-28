package com.restaurant.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.repository.MenuRepository;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    @Autowired
    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // 1. Lấy toàn bộ menu từ Database
    public List<MenuItem> getFullMenu() {
        return menuRepository.findAll();
    }

    // 2. Thêm món
    public MenuItem addMenuItem(MenuItem item) {
        // Xử lý giá trị mặc định
        if (item.getImageUrl() == null || item.getImageUrl().isEmpty()) {
            item.setImageUrl("src/assets/Nha_hang.jpg");
        }
        // [QUAN TRỌNG] Mặc định là 'AVAILABLE' (viết hoa)
        if (item.getStatus() == null || item.getStatus().isEmpty()) {
            item.setStatus("AVAILABLE");
        }
        
        return menuRepository.save(item);
    }

    // 3. Xóa món
    public void removeMenuItem(int id) {
        if(menuRepository.existsById(id)) {
            menuRepository.deleteById(id);
        } else {
            throw new RuntimeException("Không tìm thấy món ID: " + id);
        }
    }

    // 4. Lấy 1 món
    public MenuItem getMenuItemById(int id) {
        return menuRepository.findById(id).orElse(null);
    }
}