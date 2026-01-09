package com.restaurant.pattern.state;

/**
 * Trạng thái "Đang nấu" - Khi món ăn đang được nấu
 */
public class CookingState implements DishState {
    private OrderItem orderItem;

    public CookingState(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    @Override
    public void nextState() {
        orderItem.setState(new ReadyState(orderItem));
    }

    @Override
    public String getStatus() {
        return "Đang nấu";
    }

    @Override
    public String toString() {
        return getStatus();
    }
}
