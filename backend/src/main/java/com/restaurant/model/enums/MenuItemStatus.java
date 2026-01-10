package com.restaurant.model.enums;

/**
 * Enum đại diện cho các trạng thái của mục thực đơn
 */
public enum MenuItemStatus {
    AVAILABLE("available", "Có sẵn"),
    OUT_OF_STOCK("out_of_stock", "Hết hàng");

    private final String value;
    private final String label;

    MenuItemStatus(String value, String label) {
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
