package com.restaurant.service;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.repository.MenuRepository;
import com.restaurant.repository.OrderRepository;

/**
 * Service xử lý business logic cho Order
 */
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private int nextOrderItemId = 1;

    public OrderService(OrderRepository orderRepository, MenuRepository menuRepository) {
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
    }

    public Order createOrder(int tableId) {
        if (tableId <= 0) {
            throw new IllegalArgumentException("ID bàn không hợp lệ");
        }
        return orderRepository.create(tableId);
    }

    public Order getOrder(int orderId) {
        Order order = orderRepository.findById(orderId);
        if (order == null) {
            throw new IllegalArgumentException("Đơn hàng " + orderId + " không tồn tại");
        }
        return order;
    }

    public Order getOrderByTable(int tableId) {
        Order order = orderRepository.findByTableId(tableId);
        if (order == null) {
            throw new IllegalArgumentException("Không có đơn hàng cho bàn " + tableId);
        }
        return order;
    }

    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public OrderItem addItemToOrder(int orderId, int menuItemId, int quantity, String notes) {
        Order order = getOrder(orderId);

        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }

        MenuItem menuItem = menuRepository.findById(menuItemId);
        if (menuItem == null) {
            throw new IllegalArgumentException("Mục " + menuItemId + " không tồn tại");
        }

        if (!menuItem.isAvailable()) {
            throw new IllegalArgumentException("Mục '" + menuItem.getName() + "' không có sẵn");
        }

        OrderItem orderItem = new OrderItem(nextOrderItemId, menuItem, quantity, notes);
        nextOrderItemId++;

        order.addItem(orderItem);
        orderRepository.update(order);

        return orderItem;
    }

    public boolean removeItemFromOrder(int orderId, int orderItemId) {
        Order order = getOrder(orderId);
        return order.removeItem(orderItemId);
    }

    public void changeOrderStatus(int orderId, OrderStatus newStatus) {
        Order order = getOrder(orderId);
        order.changeStatus(newStatus);
        orderRepository.update(order);
    }

    public double getOrderTotal(int orderId) {
        Order order = getOrder(orderId);
        return order.getTotalAmount();
    }

    public java.util.List<Order> getActiveOrders() {
        return orderRepository.findActiveOrders();
    }

    public void deleteOrder(int orderId) {
        if (!orderRepository.delete(orderId)) {
            throw new IllegalArgumentException("Đơn hàng " + orderId + " không tồn tại");
        }
    }
}
