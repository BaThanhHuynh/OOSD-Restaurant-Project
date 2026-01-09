package com.restaurant.pattern.state;

/**
 * Trạng thái "Đã gọi" - Khi món ăn vừa được gọi
 */
public class OrderedState implements DishState {
    private OrderItem orderItem;

    public OrderedState(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    @Override
    public void nextState() {
        orderItem.setState(new CookingState(orderItem));
    }

    @Override
    public String getStatus() {
        return "Đã gọi";
    }

    @Override
    public String toString() {
        return getStatus();
    }
}
