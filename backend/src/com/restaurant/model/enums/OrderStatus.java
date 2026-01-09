package com.restaurant.model.enums;

/**
 * Enum đại diện cho các trạng thái của đơn hàng
 */
public enum OrderStatus {
    NEW("new", "Mới"),
    IN_PROGRESS("in_progress", "Đang xử lý"),
    COMPLETED("completed", "Hoàn thành");

    private final String value;
    private final String label;

    OrderStatus(String value, String label) {
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
