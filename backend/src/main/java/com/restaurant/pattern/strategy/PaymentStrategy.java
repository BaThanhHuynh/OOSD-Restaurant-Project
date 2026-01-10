package com.restaurant.pattern.strategy;

/**
 * Interface cho Strategy Pattern - đại diện cho các phương thức thanh toán
 */
public interface PaymentStrategy {
    /**
     * Thực hiện thanh toán
     *
     * @param amount Số tiền cần thanh toán
     * @return True nếu thanh toán thành công, False nếu thất bại
     */
    boolean pay(double amount);

    /**
     * Lấy tên phương thức thanh toán
     */
    String getPaymentMethod();
}
