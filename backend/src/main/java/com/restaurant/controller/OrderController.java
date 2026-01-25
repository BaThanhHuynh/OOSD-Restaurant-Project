package com.restaurant.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.Order;
import com.restaurant.service.OrderService;
import com.restaurant.service.OrderService.ItemRequest;

/**
 * Controller xử lý các REST API cho Order Management
 * Áp dụng State Pattern - KHÔNG sử dụng if-else để xử lý trạng thái
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ======= NGHIỆP VỤ 1: TẠO ORDER THEO BÀN =======

    /**
     * Tạo order mới cho một bàn
     * POST /api/orders/table/{tableId}
     */
    @PostMapping("/table/{tableId}")
    public ResponseEntity<Order> createOrderForTable(@PathVariable int tableId) {
        try {
            Order order = orderService.createOrderForTable(tableId);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Lấy order active của một bàn
     * GET /api/orders/table/{tableId}/active
     */
    @GetMapping("/table/{tableId}/active")
    public ResponseEntity<Order> getActiveOrderByTable(@PathVariable int tableId) {
        return orderService.getActiveOrderByTable(tableId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ======= NGHIỆP VỤ 2: THÊM MÓN VÀO ORDER =======

    /**
     * Thêm một món vào order
     * POST /api/orders/{orderId}/items
     * Body: { "menuItemId": 1, "quantity": 2 }
     */
    @PostMapping("/{orderId}/items")
    public ResponseEntity<Order> addItemToOrder(
            @PathVariable Long orderId,
            @RequestBody ItemRequest request) {
        try {
            Order order = orderService.addItemToOrder(
                    orderId,
                    request.getMenuItemId(),
                    request.getQuantity()
            );
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Thêm nhiều món vào order
     * POST /api/orders/{orderId}/items/batch
     * Body: [{ "menuItemId": 1, "quantity": 2 }, { "menuItemId": 2, "quantity": 1 }]
     */
    @PostMapping("/{orderId}/items/batch")
    public ResponseEntity<Order> addMultipleItems(
            @PathVariable Long orderId,
            @RequestBody List<ItemRequest> requests) {
        try {
            Order order = orderService.addMultipleItems(orderId, requests);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ======= NGHIỆP VỤ 3: CHUYỂN TRẠNG THÁI MÓN ĂN (STATE PATTERN) =======

    /**
     * Chuyển trạng thái của một món sang trạng thái tiếp theo
     * PUT /api/orders/{orderId}/items/{orderItemId}/next-state
     * State Pattern tự động xử lý - KHÔNG CẦN IF-ELSE
     */
    @PutMapping("/{orderId}/items/{orderItemId}/next-state")
    public ResponseEntity<Order> changeItemState(
            @PathVariable Long orderId,
            @PathVariable Long orderItemId) {
        try {
            Order order = orderService.changeItemState(orderId, orderItemId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Chuyển tất cả các món trong order sang trạng thái tiếp theo
     * PUT /api/orders/{orderId}/items/next-state-all
     */
    @PutMapping("/{orderId}/items/next-state-all")
    public ResponseEntity<Order> changeAllItemsState(@PathVariable Long orderId) {
        try {
            Order order = orderService.changeAllItemsState(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // ======= CÁC API PHỤ TRỢ =======

    /**
     * Lấy tất cả orders
     * GET /api/orders
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Lấy order theo ID
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy tất cả orders của một bàn
     * GET /api/orders/table/{tableId}
     */
    @GetMapping("/table/{tableId}")
    public ResponseEntity<List<Order>> getOrdersByTable(@PathVariable int tableId) {
        List<Order> orders = orderService.getOrdersByTable(tableId);
        return ResponseEntity.ok(orders);
    }

    /**
     * Lấy tất cả orders đang IN_PROGRESS
     * GET /api/orders/in-progress
     */
    @GetMapping("/in-progress")
    public ResponseEntity<List<Order>> getInProgressOrders() {
        List<Order> orders = orderService.getInProgressOrders();
        return ResponseEntity.ok(orders);
    }

    /**
     * Hoàn thành order
     * PUT /api/orders/{orderId}/complete
     */
    @PutMapping("/{orderId}/complete")
    public ResponseEntity<Order> completeOrder(@PathVariable Long orderId) {
        try {
            Order order = orderService.completeOrder(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Xóa một món khỏi order
     * DELETE /api/orders/{orderId}/items/{orderItemId}
     */
    @DeleteMapping("/{orderId}/items/{orderItemId}")
    public ResponseEntity<Order> removeItemFromOrder(
            @PathVariable Long orderId,
            @PathVariable Long orderItemId) {
        try {
            Order order = orderService.removeItemFromOrder(orderId, orderItemId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    /**
     * Xóa order
     * DELETE /api/orders/{orderId}
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok(Map.of("message", "Order đã được xóa thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy order"));
        }
    }
}