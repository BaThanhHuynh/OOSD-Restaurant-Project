package com.restaurant.service;

import com.restaurant.model.entity.Payment;
import com.restaurant.repository.PaymentRepository;
import com.restaurant.strategy.PaymentStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final TableService tableService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, TableService tableService) {
        this.paymentRepository = paymentRepository;
        this.tableService = tableService;
    }

    public Payment processCheckout(int tableId, double totalAmount, PaymentStrategy strategy) {
        // 1. Thực hiện thanh toán qua Strategy
        boolean success = strategy.pay(totalAmount);

        if (success) {
            // 2. Lưu lịch sử hóa đơn
            Payment payment = new Payment(
                paymentRepository.generateId(),
                tableId, // Tạm thời dùng tableId làm orderId nếu chưa có model Order
                totalAmount,
                strategy.getMethodName()
            );
            paymentRepository.save(payment);

            // 3. Cập nhật trạng thái bàn về AVAILABLE (Phối hợp với Người 1)
            tableService.checkoutTable(tableId);

            return payment;
        }
        throw new RuntimeException("Thanh toán thất bại!");
    }
}