package com.restaurant.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Import thư viện phản hồi
import org.springframework.web.bind.annotation.*;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.repository.MenuRepository; // Import Repository để lưu nhanh
import com.restaurant.service.MenuService;

@RestController 
@RequestMapping("/api/menu") 
@CrossOrigin(origins = "*") 
public class MenuController {

    private final MenuService menuService;
    private final MenuRepository menuRepository; // Cần Repository để cập nhật status

    @Autowired
    public MenuController(MenuService menuService, MenuRepository menuRepository) {
        this.menuService = menuService;
        this.menuRepository = menuRepository;
    }

    // GET: Lấy danh sách món
    @GetMapping
    public List<MenuItem> showMenu() {
        return menuService.getFullMenu(); 
    }

    // POST: Thêm món mới
    @PostMapping("/add") 
    public ResponseEntity<String> addMenuItem(@RequestBody MenuItem item) {
        try {
            // Mặc định món mới luôn có trạng thái AVAILABLE (Viết hoa)
            if (item.getStatus() == null || item.getStatus().isEmpty()) {
                item.setStatus("AVAILABLE");
            } else {
                item.setStatus(item.getStatus().toUpperCase());
            }
            
            menuService.addMenuItem(item);
            return ResponseEntity.ok("Thành công: Đã thêm món " + item.getName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // [MỚI] PUT: Cập nhật trạng thái (Hết món / Có món)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable int id, @RequestParam String status) {
        // Tìm món theo ID
        return menuRepository.findById(id).map(item -> {
            // Cập nhật trạng thái mới (Viết hoa cho đồng bộ)
            item.setStatus(status.toUpperCase());
            
            // Lưu xuống Database
            menuRepository.save(item);
            
            return ResponseEntity.ok("Đã cập nhật trạng thái: " + status);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Xóa món
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeMenuItem(@PathVariable int id) {
        try {
            menuService.removeMenuItem(id);
            return ResponseEntity.ok("Đã xóa món ID " + id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa (có thể do dính đơn hàng cũ). Hãy dùng nút 'Báo hết'!");
        }
    }
}