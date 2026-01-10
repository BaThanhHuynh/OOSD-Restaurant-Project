package com.restaurant.repository;

import com.restaurant.model.entity.Order;
import com.restaurant.model.enums.OrderStatus;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Repository cho Order - CRUD operations
 */
public class OrderRepository {
    private final Map<Integer, Order> orders = new HashMap<>();
    private int nextId = 1;

    public Order create(int tableId) {
        Order order = new Order(nextId, tableId);
        orders.put(nextId, order);
        nextId++;
        return order;
    }

    public Order findById(int orderId) {
        return orders.get(orderId);
    }

    public Order findByTableId(int tableId) {
        return orders.values().stream()
                .filter(o -> o.getTableId() == tableId)
                .findFirst()
                .orElse(null);
    }

    public List<Order> findAll() {
        return List.copyOf(orders.values());
    }

    public boolean update(Order order) {
        if (orders.containsKey(order.getOrderId())) {
            orders.put(order.getOrderId(), order);
            return true;
        }
        return false;
    }

    public boolean delete(int orderId) {
        return orders.remove(orderId) != null;
    }

    public List<Order> findActiveOrders() {
        return orders.values().stream()
                .filter(o -> o.getStatus() != OrderStatus.COMPLETED)
                .collect(Collectors.toList());
    }

    public int getTotalOrders() {
        return orders.size();
    }
}
