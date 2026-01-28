package com.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.entity.Table;
import com.restaurant.repository.MenuRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.TableRepository;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private MenuRepository menuRepository;

    public Order createOrderForTable(int tableId) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn với ID: " + tableId));
        Optional<Order> existingOrder = orderRepository.findActiveOrderByTableId(tableId);
        return existingOrder.orElseGet(() -> {
            Order newOrder = new Order(table);
            return orderRepository.save(newOrder);
        });
    }

    public Optional<Order> getActiveOrderByTable(int tableId) {
        return orderRepository.findActiveOrderByTableId(tableId);
    }

    public Order addItemToOrder(Long orderId, int menuItemId, int quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));
        MenuItem menuItem = menuRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + menuItemId));
        
        OrderItem orderItem = new OrderItem(menuItem, quantity);
        order.addItem(orderItem);
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    // [CẬP NHẬT] Hàm này giờ sẽ xử lý cả Note
    public Order addMultipleItems(Long orderId, List<ItemRequest> itemRequests) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        itemRequests.forEach(request -> {
            MenuItem menuItem = menuRepository.findById(request.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + request.getMenuItemId()));
            
            OrderItem orderItem = new OrderItem(menuItem, request.getQuantity());
            
            // [MỚI] Lưu ghi chú nếu có
            if (request.getNote() != null) {
                orderItem.setNote(request.getNote());
            }
            
            order.addItem(orderItem);
        });

        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    public Order changeItemState(Long orderId, Long orderItemId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + orderItemId));
        orderItem.changeToNextState();
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    public Order changeAllItemsState(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));
        order.getOrderItems().forEach(OrderItem::changeToNextState);
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() { return orderRepository.findAll(); }
    public Optional<Order> getOrderById(Long orderId) { return orderRepository.findByIdWithItems(orderId); }
    public List<Order> getOrdersByTable(int tableId) { return orderRepository.findByTableId(tableId); }
    public List<Order> getInProgressOrders() { return orderRepository.findAllInProgressOrders(); }

    public Order completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));
        order.completeOrder();
        return orderRepository.save(order);
    }

    public Order removeItemFromOrder(Long orderId, Long orderItemId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));
        OrderItem itemToRemove = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + orderItemId));
        order.removeItem(itemToRemove);
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // [CẬP NHẬT] Inner Class thêm trường note
    public static class ItemRequest {
        private int menuItemId;
        private int quantity;
        private String note; // [MỚI]

        public ItemRequest() {}

        public ItemRequest(int menuItemId, int quantity, String note) {
            this.menuItemId = menuItemId;
            this.quantity = quantity;
            this.note = note;
        }

        public int getMenuItemId() { return menuItemId; }
        public void setMenuItemId(int menuItemId) { this.menuItemId = menuItemId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        
        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }
}