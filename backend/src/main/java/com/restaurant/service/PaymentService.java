package com.restaurant.service;

import com.restaurant.model.entity.Payment;
import com.restaurant.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final TableService tableService; // Gọi TableService để reset bàn

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, TableService tableService) {
        this.paymentRepository = paymentRepository;
        this.tableService = tableService;
    }

    // Xử lý thanh toán
    public void processPayment(Payment payment) {
        // 1. Lưu hóa đơn vào Database
        paymentRepository.save(payment);

        // 2. Gọi sang TableService để giải phóng bàn (Reset về available)
        // Đây chính là dòng gây lỗi lúc nãy nếu bên TableService chưa có hàm này
        tableService.checkoutTable(payment.getTableId());
    }
}