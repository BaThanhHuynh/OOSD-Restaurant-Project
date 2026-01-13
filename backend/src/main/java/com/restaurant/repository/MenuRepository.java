package com.restaurant.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.MenuItem;

@Repository
public class MenuRepository {

    private final List<MenuItem> menuItems;

    public MenuRepository() {
        menuItems = new ArrayList<>();
        
        // Fake data menu
        menuItems.add(new MenuItem(1, "Pizza Phô Mai", 150000));
        menuItems.add(new MenuItem(2, "Mỳ Ý Bò Bằm", 80000));
        menuItems.add(new MenuItem(3, "Coca Cola", 15000));
    }

    public List<MenuItem> findAll() {
        return menuItems;
    }

    public Optional<MenuItem> findById(int id) {
        return menuItems.stream()
                        .filter(m -> m.getId() == id)
                        .findFirst();
    }

    public void save(MenuItem item) {
        findById(item.getId()).ifPresent(exist -> menuItems.remove(exist));
        menuItems.add(item);
    }
    
    public boolean delete(int id) {
        return menuItems.removeIf(m -> m.getId() == id);
    }
}