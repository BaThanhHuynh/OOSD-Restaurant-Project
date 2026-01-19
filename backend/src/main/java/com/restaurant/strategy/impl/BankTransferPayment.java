package com.restaurant.strategy.impl;

import com.restaurant.strategy.PaymentStrategy;

public class BankTransferPayment implements PaymentStrategy {
    @Override
    public boolean pay(double amount) {
        System.out.println("--- Đang tạo mã QR chuyển khoản: " + amount + "đ ---");
        // Giả lập kết nối API Ngân hàng
        return true;
    }

    @Override
    public String getMethodName() {
        return "CHUYỂN KHOẢN";
    }
}