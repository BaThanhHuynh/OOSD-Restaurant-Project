package com.restaurant.pattern.strategy;

/**
 * Strategy cho thanh toán bằng tiền mặt
 */
public class CashPayment implements PaymentStrategy {
    @Override
    public boolean pay(double amount) {
        System.out.printf("Thanh toán %,.0fđ bằng tiền mặt...%n", amount);
        // Logic xử lý thanh toán tiền mặt
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "Tiền mặt";
    }

    @Override
    public String toString() {
        return getPaymentMethod();
    }
}
