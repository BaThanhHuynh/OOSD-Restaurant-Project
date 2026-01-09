package com.restaurant.service;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.enums.MenuItemStatus;
import com.restaurant.repository.MenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests cho MenuService
 */
public class MenuServiceTest {
    private MenuService menuService;
    private MenuRepository menuRepository;

    @BeforeEach
    public void setUp() {
        menuRepository = new MenuRepository();
        menuService = new MenuService(menuRepository);
    }

    @Test
    public void testAddMenuItem() {
        MenuItem item = menuService.addMenuItem("Pad Thai", 45000, "Bánh mì xào kiểu Thái");
        assertNotNull(item);
        assertEquals("Pad Thai", item.getName());
        assertEquals(45000, item.getPrice());
        assertEquals(MenuItemStatus.AVAILABLE, item.getStatus());
    }

    @Test
    public void testAddMenuItemInvalidPrice() {
        assertThrows(IllegalArgumentException.class, () -> 
            menuService.addMenuItem("Item", 0, "Description"));
        assertThrows(IllegalArgumentException.class, () -> 
            menuService.addMenuItem("Item", -1000, "Description"));
    }

    @Test
    public void testGetMenuItem() {
        MenuItem created = menuService.addMenuItem("Cơm tấm", 35000, "Cơm tấm Sài Gòn");
        MenuItem retrieved = menuService.getMenuItem(created.getItemId());
        assertEquals(created.getItemId(), retrieved.getItemId());
    }

    @Test
    public void testGetAvailableMenuItems() {
        MenuItem item1 = menuService.addMenuItem("Pad Thai", 45000, "");
        MenuItem item2 = menuService.addMenuItem("Cơm tấm", 35000, "");
        MenuItem item3 = menuService.addMenuItem("Bánh mì", 20000, "");
        
        menuService.setOutOfStock(item3.getItemId());
        
        assertEquals(2, menuService.getAvailableMenuItems().size());
    }

    @Test
    public void testSetAvailable() {
        MenuItem item = menuService.addMenuItem("Bánh mì", 20000, "");
        menuService.setOutOfStock(item.getItemId());
        menuService.setAvailable(item.getItemId());
        
        MenuItem updated = menuService.getMenuItem(item.getItemId());
        assertEquals(MenuItemStatus.AVAILABLE, updated.getStatus());
    }

    @Test
    public void testSetOutOfStock() {
        MenuItem item = menuService.addMenuItem("Bánh mì", 20000, "");
        menuService.setOutOfStock(item.getItemId());
        
        MenuItem updated = menuService.getMenuItem(item.getItemId());
        assertEquals(MenuItemStatus.OUT_OF_STOCK, updated.getStatus());
    }
}
