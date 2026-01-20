package com.restaurant.service;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.repository.MenuRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service xử lý nghiệp vụ liên quan đến Order
 * Tuân thủ nguyên tắc OOSD: KHÔNG sử dụng if-else để xử lý trạng thái
 */
@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private MenuRepository menuRepository;

    // ======= NGHIỆP VỤ 1: TẠO ORDER THEO BÀN =======

    /**
     * Tạo order mới cho một bàn
     * Nếu bàn đã có order active, trả về order đó
     */
    public Order createOrderForTable(int tableId) {
        // Tìm bàn
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn với ID: " + tableId));

        // Kiểm tra xem bàn đã có order active chưa
        Optional<Order> existingOrder = orderRepository.findActiveOrderByTableId(tableId);
        
        // Trả về order hiện tại hoặc tạo mới
        return existingOrder.orElseGet(() -> {
            Order newOrder = new Order(table);
            return orderRepository.save(newOrder);
        });
    }

    /**
     * Lấy order active của một bàn
     */
    public Optional<Order> getActiveOrderByTable(int tableId) {
        return orderRepository.findActiveOrderByTableId(tableId);
    }

    // ======= NGHIỆP VỤ 2: THÊM MÓN VÀO ORDER =======

    /**
     * Thêm món vào order
     */
    public Order addItemToOrder(Long orderId, int menuItemId, int quantity) {
        // Tìm order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        // Tìm menu item
        MenuItem menuItem = menuRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + menuItemId));

        // Tạo order item mới
        OrderItem orderItem = new OrderItem(menuItem, quantity);

        // Thêm vào order
        order.addItem(orderItem);
        order.updateOrderStatus();

        // Lưu và trả về
        return orderRepository.save(order);
    }

    /**
     * Thêm nhiều món cùng lúc
     */
    public Order addMultipleItems(Long orderId, List<ItemRequest> itemRequests) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        itemRequests.forEach(request -> {
            MenuItem menuItem = menuRepository.findById(request.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + request.getMenuItemId()));
            
            OrderItem orderItem = new OrderItem(menuItem, request.getQuantity());
            order.addItem(orderItem);
        });

        order.updateOrderStatus();
        return orderRepository.save(order);
    }

    // ======= NGHIỆP VỤ 3: CHUYỂN TRẠNG THÁI MÓN ĂN (STATE PATTERN - KHÔNG IF-ELSE) =======

    /**
     * Chuyển trạng thái của một món ăn sang trạng thái tiếp theo
     * SỬ DỤNG STATE PATTERN - Không cần if-else
     */
    public Order changeItemState(Long orderId, Long orderItemId) {
        // Tìm order với items
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        // Tìm order item
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món với ID: " + orderItemId));

        // Chuyển trạng thái - State Pattern tự động xử lý, KHÔNG CẦN IF-ELSE
        orderItem.changeToNextState();

        // Cập nhật trạng thái order
        order.updateOrderStatus();

        // Lưu và trả về
        return orderRepository.save(order);
    }

    /**
     * Chuyển tất cả các món trong order sang trạng thái tiếp theo
     */
    public Order changeAllItemsState(Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        // Chuyển trạng thái tất cả các món - State Pattern tự xử lý
        order.getOrderItems().forEach(OrderItem::changeToNextState);

        // Cập nhật trạng thái order
        order.updateOrderStatus();

        return orderRepository.save(order);
    }

    // ======= CÁC NGHIỆP VỤ PHỤ TRỢ =======

    /**
     * Lấy tất cả orders
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Lấy order theo ID
     */
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findByIdWithItems(orderId);
    }

    /**
     * Lấy tất cả orders của một bàn
     */
    public List<Order> getOrdersByTable(int tableId) {
        return orderRepository.findByTableId(tableId);
    }

    /**
     * Lấy tất cả orders đang IN_PROGRESS
     */
    public List<Order> getInProgressOrders() {
        return orderRepository.findAllInProgressOrders();
    }

    /**
     * Hoàn thành order
     */
    public Order completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order với ID: " + orderId));

        order.completeOrder();
        return orderRepository.save(order);
    }

    /**
     * Xóa món khỏi order
     */
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

    /**
     * Xóa order
     */
    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    // ======= INNER CLASS ĐỂ NHẬN REQUEST =======

    /**
     * Class phụ để nhận request thêm món
     */
    public static class ItemRequest {
        private int menuItemId;
        private int quantity;

        public ItemRequest() {}

        public ItemRequest(int menuItemId, int quantity) {
            this.menuItemId = menuItemId;
            this.quantity = quantity;
        }

        public int getMenuItemId() {
            return menuItemId;
        }

        public void setMenuItemId(int menuItemId) {
            this.menuItemId = menuItemId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
