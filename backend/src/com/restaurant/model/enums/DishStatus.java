package com.restaurant.model.enums;

/**
 * Enum đại diện cho các trạng thái của món ăn (dùng trong State Pattern)
 */
public enum DishStatus {
    ORDERED("ordered", "Đã gọi"),
    COOKING("cooking", "Đang nấu"),
    READY("ready", "Sẵn sàng"),
    SERVED("served", "Đã phục vụ");

    private final String value;
    private final String label;

    DishStatus(String value, String label) {
        this.value = value;
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }
}
