package com.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.entity.Settings; // [MỚI]
import com.restaurant.model.entity.Table;
import com.restaurant.repository.MenuRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.TableRepository;

@Service
@Transactional
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private TableRepository tableRepository;
    @Autowired private MenuRepository menuRepository;

    // [MỚI] Inject SettingsService để lấy % Thuế từ Database
    @Autowired private SettingsService settingsService;

    // ======= HÀM PHỤ TRỢ: TÍNH TIỀN & THUẾ TỰ ĐỘNG =======
    private void recalculateTotal(Order order) {
        // 1. Tính tổng tiền món ăn (Subtotal)
        double subTotal = order.getOrderItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();

        // 2. Lấy % Thuế động từ Cài đặt (Thay vì cứng 5%)
        Settings settings = settingsService.getSettings();
        double taxRate = settings.getTaxRate() / 100.0; // VD: 10% -> 0.1

        // 3. Tính toán
        double taxAmount = subTotal * taxRate;
        double totalAmount = subTotal + taxAmount;

        // 4. Lưu vào Order (Bắt buộc file Order.java phải có setter này)
        order.setTaxAmount(taxAmount);
        order.setTotalAmount(totalAmount);
    }

    // ======= NGHIỆP VỤ 1: TẠO ORDER THEO BÀN =======
    public Order createOrderForTable(int tableId) {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn: " + tableId));

        return orderRepository.findActiveOrderByTableId(tableId).orElseGet(() -> {
            Order newOrder = new Order(table);
            newOrder.setTotalAmount(0); // Khởi tạo 0 đồng
            newOrder.setTaxAmount(0);
            return orderRepository.save(newOrder);
        });
    }

    public Optional<Order> getActiveOrderByTable(int tableId) {
        return orderRepository.findActiveOrderByTableId(tableId);
    }

    // ======= NGHIỆP VỤ 2: THÊM MÓN (CÓ TÍNH LẠI TIỀN) =======
    public Order addItemToOrder(Long orderId, int menuItemId, int quantity) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));

        MenuItem menuItem = menuRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Món không tồn tại: " + menuItemId));

        OrderItem orderItem = new OrderItem(menuItem, quantity);
        order.addItem(orderItem);
        order.updateOrderStatus();
        
        // [QUAN TRỌNG] Tính lại tiền ngay sau khi thêm
        recalculateTotal(order);

        return orderRepository.save(order);
    }

    public Order addMultipleItems(Long orderId, List<ItemRequest> itemRequests) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại: " + orderId));

        itemRequests.forEach(request -> {
            MenuItem menuItem = menuRepository.findById(request.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Món không tồn tại: " + request.getMenuItemId()));
            OrderItem orderItem = new OrderItem(menuItem, request.getQuantity());
            order.addItem(orderItem);
        });

        order.updateOrderStatus();
        
        // [QUAN TRỌNG] Tính lại tiền
        recalculateTotal(order);

        return orderRepository.save(order);
    }

    // ======= NGHIỆP VỤ 3: CHUYỂN TRẠNG THÁI (STATE PATTERN) =======
    // (Giữ nguyên logic cũ, chỉ thêm việc lưu lại)
    public Order changeItemState(Long orderId, Long orderItemId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
        
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Món không tồn tại"));

        orderItem.changeToNextState();
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    public Order changeAllItemsState(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        order.getOrderItems().forEach(OrderItem::changeToNextState);
        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    // ======= CÁC NGHIỆP VỤ PHỤ TRỢ =======
    public List<Order> getAllOrders() { return orderRepository.findAll(); }
    public Optional<Order> getOrderById(Long orderId) { return orderRepository.findByIdWithItems(orderId); }
    public List<Order> getOrdersByTable(int tableId) { return orderRepository.findByTableId(tableId); }
    public List<Order> getInProgressOrders() { return orderRepository.findAllInProgressOrders(); }

    public Order completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
        
        // Tính tiền lần cuối trước khi chốt
        recalculateTotal(order);
        
        order.completeOrder();
        return orderRepository.save(order);
    }

    public Order removeItemFromOrder(Long orderId, Long orderItemId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));

        OrderItem itemToRemove = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Món không tồn tại trong Order"));

        order.removeItem(itemToRemove);
        order.updateOrderStatus();

        // [QUAN TRỌNG] Tính lại tiền sau khi xóa món
        recalculateTotal(order);

        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // Inner Class (Giữ nguyên)
    public static class ItemRequest {
        private int menuItemId;
        private int quantity;
        public ItemRequest() {}
        public ItemRequest(int menuItemId, int quantity) { this.menuItemId = menuItemId; this.quantity = quantity; }
        public int getMenuItemId() { return menuItemId; }
        public void setMenuItemId(int menuItemId) { this.menuItemId = menuItemId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}