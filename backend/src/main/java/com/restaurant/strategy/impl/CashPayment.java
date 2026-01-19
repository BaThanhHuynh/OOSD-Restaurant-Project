package com.restaurant.strategy.impl;

import com.restaurant.strategy.PaymentStrategy;

public class CashPayment implements PaymentStrategy {
    @Override
    public boolean pay(double amount) {
        System.out.println("--- Đang xử lý thu tiền mặt: " + amount + "đ ---");
        // Giả lập logic kiểm tra tiền mặt
        return true;
    }

    @Override
    public String getMethodName() {
        return "TIỀN MẶT";
    }
}