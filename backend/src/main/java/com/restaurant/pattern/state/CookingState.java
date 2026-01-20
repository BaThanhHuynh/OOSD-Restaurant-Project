package com.restaurant.pattern.state;

import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.DishStatus;

/**
 * Trạng thái: Món đang được nấu
 * Trạng thái tiếp theo: READY
 */
public class CookingState implements DishState {
    
    @Override
    public void nextState(OrderItem orderItem) {
        // Chuyển sang trạng thái READY
        orderItem.setDishStatus(DishStatus.READY);
        orderItem.setState(new ReadyState());
        System.out.println("Món '" + orderItem.getMenuItem().getName()
                + "' đã chuyển sang trạng thái: READY");
    }

    @Override
    public String getStateName() {
        return "COOKING";
    }
}
