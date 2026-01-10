package com.restaurant.model.enums;

/**
 * Enum đại diện cho các phương thức thanh toán
 */
public enum PaymentMethod {
    CASH("cash", "Tiền mặt"),
    BANK_TRANSFER("bank_transfer", "Chuyển khoản");

    private final String value;
    private final String label;

    PaymentMethod(String value, String label) {
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
