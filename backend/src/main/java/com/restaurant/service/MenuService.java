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


    public List<MenuItem> getFullMenu() {
        return menuRepository.findAll();
    }

    public void addMenuItem(int id, String name, double price) {
        if (menuRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Lỗi: Món ăn với ID " + id + " đã tồn tại trong menu.");
        }
        
        MenuItem newItem = new MenuItem(id, name, price);
        menuRepository.save(newItem);
    }

    public void removeMenuItem(int id) {
        boolean isDeleted = menuRepository.delete(id);
        if (!isDeleted) {
            throw new IllegalArgumentException("Lỗi: Không tìm thấy món ăn có ID " + id + " để xóa.");
        }
    }
}