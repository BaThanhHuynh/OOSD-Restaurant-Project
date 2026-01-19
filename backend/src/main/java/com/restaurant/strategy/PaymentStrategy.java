package com.restaurant.strategy;

public interface PaymentStrategy {
    boolean pay(double amount);
    String getMethodName();
}