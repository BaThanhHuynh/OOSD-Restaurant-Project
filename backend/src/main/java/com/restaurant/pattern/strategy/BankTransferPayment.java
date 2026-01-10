package com.restaurant.pattern.strategy;

/**
 * Strategy cho thanh toán bằng chuyển khoản
 */
public class BankTransferPayment implements PaymentStrategy {
    private String accountNumber;

    public BankTransferPayment() {
        this.accountNumber = "";
    }

    public BankTransferPayment(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    @Override
    public boolean pay(double amount) {
        System.out.printf("Thanh toán %,.0fđ bằng chuyển khoản...%n", amount);
        if (!accountNumber.isEmpty()) {
            System.out.println("Chuyển đến tài khoản: " + accountNumber);
        }
        // Logic xử lý thanh toán chuyển khoản
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "Chuyển khoản";
    }

    @Override
    public String toString() {
        return getPaymentMethod();
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}
