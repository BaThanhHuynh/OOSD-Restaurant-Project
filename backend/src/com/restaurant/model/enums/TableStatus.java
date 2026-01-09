package com.restaurant.model.enums;

/**
 * Enum đại diện cho các trạng thái của bàn
 */
public enum TableStatus {
    AVAILABLE("available", "Trống"),
    OCCUPIED("occupied", "Có khách"),
    ORDERING("ordering", "Đang gọi"),
    PAID("paid", "Đã thanh toán");

    private final String value;
    private final String label;

    TableStatus(String value, String label) {
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
