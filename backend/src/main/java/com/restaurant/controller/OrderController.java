package com.restaurant.controller;

import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.service.OrderService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các request về Order
 */
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    public Map<String, Object> createOrder(int tableId) {
        try {
            Order order = orderService.createOrder(tableId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo đơn hàng cho bàn " + tableId);
            
            Map<String, Object> data = new HashMap<>();
            data.put("order_id", order.getOrderId());
            data.put("table_id", order.getTableId());
            data.put("status", order.getStatus().getValue());
            data.put("total_amount", order.getTotalAmount());
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

    public Map<String, Object> getOrder(int orderId) {
        try {
            Order order = orderService.getOrder(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> items = order.getItems().stream().map(item -> {
                Map<String, Object> itemData = new HashMap<>();
                itemData.put("order_item_id", item.getOrderItemId());
                itemData.put("menu_item_name", item.getMenuItem().getName());
                itemData.put("quantity", item.getQuantity());
                itemData.put("unit_price", item.getMenuItem().getPrice());
                itemData.put("total_price", item.getTotalPrice());
                return itemData;
            }).toList();
            
            Map<String, Object> data = new HashMap<>();
            data.put("order_id", order.getOrderId());
            data.put("table_id", order.getTableId());
            data.put("status", order.getStatus().getValue());
            data.put("items", items);
            data.put("total_amount", order.getTotalAmount());
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

    public Map<String, Object> addItemToOrder(int orderId, int menuItemId, int quantity, String notes) {
        try {
            OrderItem item = orderService.addItemToOrder(orderId, menuItemId, quantity, notes);
            Order order = orderService.getOrder(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Thêm mục vào đơn hàng");
            
            Map<String, Object> data = new HashMap<>();
            data.put("order_id", order.getOrderId());
            data.put("total_amount", order.getTotalAmount());
            data.put("item_count", order.getItemCount());
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

    public Map<String, Object> removeItemFromOrder(int orderId, int orderItemId) {
        try {
            orderService.removeItemFromOrder(orderId, orderItemId);
            Order order = orderService.getOrder(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Xóa mục khỏi đơn hàng");
            
            Map<String, Object> data = new HashMap<>();
            data.put("order_id", order.getOrderId());
            data.put("total_amount", order.getTotalAmount());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = orders.stream().map(o -> {
                Map<String, Object> orderData = new HashMap<>();
                orderData.put("order_id", o.getOrderId());
                orderData.put("table_id", o.getTableId());
                orderData.put("status", o.getStatus().getValue());
                orderData.put("total_amount", o.getTotalAmount());
                return orderData;
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
}
