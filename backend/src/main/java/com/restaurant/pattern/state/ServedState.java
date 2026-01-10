package com.restaurant.pattern.state;

/**
 * Trạng thái "Đã phục vụ" - Khi món ăn đã được phục vụ
 */
public class ServedState implements DishState {
    private OrderItem orderItem;

    public ServedState(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    @Override
    public void nextState() {
        throw new IllegalStateException("Món ăn đã được phục vụ, không thể thay đổi trạng thái");
    }

    @Override
    public String getStatus() {
        return "Đã phục vụ";
    }

    @Override
    public String toString() {
        return getStatus();
    }
}
