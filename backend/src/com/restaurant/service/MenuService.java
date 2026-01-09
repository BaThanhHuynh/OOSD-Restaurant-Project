package com.restaurant.service;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.repository.MenuRepository;

/**
 * Service xử lý business logic cho Menu
 */
public class MenuService {
    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public MenuItem addMenuItem(String name, double price, String description) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên không được trống");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("Giá phải lớn hơn 0");
        }
        return menuRepository.create(name, price, description);
    }

    public MenuItem getMenuItem(int itemId) {
        MenuItem item = menuRepository.findById(itemId);
        if (item == null) {
            throw new IllegalArgumentException("Mục " + itemId + " không tồn tại");
        }
        return item;
    }

    public java.util.List<MenuItem> getAllMenuItems() {
        return menuRepository.findAll();
    }

    public java.util.List<MenuItem> getAvailableMenuItems() {
        return menuRepository.findAvailableItems();
    }

    public void setAvailable(int itemId) {
        MenuItem item = getMenuItem(itemId);
        item.setAvailable();
        menuRepository.update(item);
    }

    public void setOutOfStock(int itemId) {
        MenuItem item = getMenuItem(itemId);
        item.setOutOfStock();
        menuRepository.update(item);
    }

    public void deleteMenuItem(int itemId) {
        if (!menuRepository.delete(itemId)) {
            throw new IllegalArgumentException("Mục " + itemId + " không tồn tại");
        }
    }

    public int getTotalItems() {
        return menuRepository.getTotalItems();
    }
}
