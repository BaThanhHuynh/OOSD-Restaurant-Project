package com.restaurant.pattern.state;

import com.restaurant.model.entity.OrderItem;

/**
 * Trạng thái: Món đã được phục vụ (trạng thái cuối cùng)
 * Không có trạng thái tiếp theo
 */
public class ServedState implements DishState {
    
    @Override
    public void nextState(OrderItem orderItem) {
        // Đây là trạng thái cuối cùng, không thể chuyển tiếp
        System.out.println("Món '" + orderItem.getMenuItem().getName()
                + "' đã ở trạng thái cuối cùng: SERVED. Không thể chuyển tiếp.");
    }

    @Override
    public String getStateName() {
        return "SERVED";
    }
}
