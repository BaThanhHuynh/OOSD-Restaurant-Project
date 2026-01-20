package com.restaurant.pattern.state;

import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.DishStatus;

/**
 * Trạng thái: Món đã sẵn sàng (đã nấu xong)
 * Trạng thái tiếp theo: SERVED
 */
public class ReadyState implements DishState {
    
    @Override
    public void nextState(OrderItem orderItem) {
        // Chuyển sang trạng thái SERVED
        orderItem.setDishStatus(DishStatus.SERVED);
        orderItem.setState(new ServedState());
        System.out.println("Món '" + orderItem.getMenuItem().getName()
                + "' đã chuyển sang trạng thái: SERVED");
    }

    @Override
    public String getStateName() {
        return "READY";
    }
}
