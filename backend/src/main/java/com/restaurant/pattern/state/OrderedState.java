package com.restaurant.pattern.state;

import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.DishStatus;

/**
 * Trạng thái: Món vừa được đặt
 * Trạng thái tiếp theo: COOKING
 */

public class OrderedState implements DishState {
    @Override
    public void nextState(OrderItem orderItem) {
        // Chuyển sang trạng thái COOKING
        orderItem.setDishStatus(DishStatus.COOKING);
        orderItem.setState(new CookingState());
        System.out.println("Món '" + orderItem.getMenuItem().getName()
                + "' đã chuyển sang trạng thái: COOKING");
    }

    @Override
    public String getStateName() {
        return "ORDERED";
    }
}