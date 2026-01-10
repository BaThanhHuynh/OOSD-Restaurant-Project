package com.restaurant.pattern.state;

/**
 * Trạng thái "Sẵn sàng" - Khi món ăn đã sẵn sàng
 */
public class ReadyState implements DishState {
    private OrderItem orderItem;

    public ReadyState(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    @Override
    public void nextState() {
        orderItem.setState(new ServedState(orderItem));
    }

    @Override
    public String getStatus() {
        return "Sẵn sàng";
    }

    @Override
    public String toString() {
        return getStatus();
    }
}
