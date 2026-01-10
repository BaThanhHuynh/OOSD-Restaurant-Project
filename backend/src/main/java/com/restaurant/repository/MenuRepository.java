package com.restaurant.repository;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.enums.MenuItemStatus;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Repository cho MenuItem - CRUD operations
 */
public class MenuRepository {
    private final Map<Integer, MenuItem> menuItems = new HashMap<>();
    private int nextId = 1;

    public MenuItem create(String name, double price, String description) {
        MenuItem item = new MenuItem(nextId, name, price, description);
        menuItems.put(nextId, item);
        nextId++;
        return item;
    }

    public MenuItem findById(int itemId) {
        return menuItems.get(itemId);
    }

    public List<MenuItem> findAll() {
        return List.copyOf(menuItems.values());
    }

    public boolean update(MenuItem item) {
        if (menuItems.containsKey(item.getItemId())) {
            menuItems.put(item.getItemId(), item);
            return true;
        }
        return false;
    }

    public boolean delete(int itemId) {
        return menuItems.remove(itemId) != null;
    }

    public List<MenuItem> findAvailableItems() {
        return menuItems.values().stream()
                .filter(item -> item.getStatus() == MenuItemStatus.AVAILABLE)
                .collect(Collectors.toList());
    }

    public int getTotalItems() {
        return menuItems.size();
    }
}
