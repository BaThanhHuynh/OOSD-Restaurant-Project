package com.restaurant.pattern.state;

import com.restaurant.model.entity.OrderItem;

/**
 * Interface cho State Pattern
 * Mỗi trạng thái món ăn sẽ implement interface này
 */
public interface DishState {
    void nextState(OrderItem orderItem);
    String getStateName();
}