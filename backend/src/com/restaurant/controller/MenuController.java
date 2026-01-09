package com.restaurant.controller;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.service.MenuService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các request về Menu
 */
public class MenuController {
    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    public Map<String, Object> addMenuItem(String name, double price, String description) {
        try {
            MenuItem item = menuService.addMenuItem(name, price, description);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thêm '" + name + "' vào thực đơn");
            
            Map<String, Object> data = new HashMap<>();
            data.put("item_id", item.getItemId());
            data.put("name", item.getName());
            data.put("price", item.getPrice());
            data.put("status", item.getStatus().getValue());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getMenuItem(int itemId) {
        try {
            MenuItem item = menuService.getMenuItem(itemId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            Map<String, Object> data = new HashMap<>();
            data.put("item_id", item.getItemId());
            data.put("name", item.getName());
            data.put("price", item.getPrice());
            data.put("description", item.getDescription());
            data.put("status", item.getStatus().getValue());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getAllMenuItems() {
        try {
            List<MenuItem> items = menuService.getAllMenuItems();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = items.stream().map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("item_id", item.getItemId());
                itemData.put("name", item.getName());
                itemData.put("price", item.getPrice());
                itemData.put("description", item.getDescription());
                itemData.put("status", item.getStatus().getValue());
                return itemData;
            }).toList();
            
            response.put("data", data);
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getAvailableMenuItems() {
        try {
            List<MenuItem> items = menuService.getAvailableMenuItems();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = items.stream().map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("item_id", item.getItemId());
                itemData.put("name", item.getName());
                itemData.put("price", item.getPrice());
                itemData.put("description", item.getDescription());
                return itemData;
            }).toList();
            
            response.put("data", data);
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> setAvailable(int itemId) {
        try {
            menuService.setAvailable(itemId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mục " + itemId + " đã sẵn có");
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> setOutOfStock(int itemId) {
        try {
            menuService.setOutOfStock(itemId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Mục " + itemId + " đã hết hàng");
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }
}
