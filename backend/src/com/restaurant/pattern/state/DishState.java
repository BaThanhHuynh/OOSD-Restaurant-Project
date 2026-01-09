package com.restaurant.pattern.state;

/**
 * Interface cho State Pattern - đại diện cho các trạng thái của món ăn
 */
public interface DishState {
    /**
     * Chuyển sang trạng thái tiếp theo
     */
    void nextState();

    /**
     * Lấy tên trạng thái
     */
    String getStatus();
}
