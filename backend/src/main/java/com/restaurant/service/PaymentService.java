package com.restaurant.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.Payment;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.PaymentRepository;

@Service
@Transactional // Quan trọng: Giúp rollback toàn bộ nếu có lỗi
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TableService tableService;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, 
                          OrderRepository orderRepository, 
                          TableService tableService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.tableService = tableService;
    }

    public void processPayment(Payment payment) {
        // 1. Tìm đơn hàng đang hoạt động của bàn
        // (Repository đã được sửa để tìm cả trạng thái COMPLETED)
        Order order = orderRepository.findActiveOrderByTableId(payment.getTableId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng để thanh toán!"));

        // 2. Cập nhật trạng thái đơn hàng (Đồng bộ cả 2 cột)
        
        // a. Cập nhật cột order_status (Logic quy trình mới)
        order.setOrderStatus(OrderStatus.PAID);
        
        // b. [QUAN TRỌNG] Cập nhật cột payment_status (Logic DB cũ)
        // Để tránh cột này bị NULL hoặc vẫn là 'unpaid'
        order.setPaymentStatus("paid"); 

        orderRepository.save(order);

        // 3. --- [LƯU VÀO BẢNG PAYMENTS] ---
        payment.setPaymentTime(LocalDateTime.now());
        payment.setAmount(order.getTotalAmount()); 
        
        // Lưu lịch sử thanh toán
        paymentRepository.save(payment); 

        // 4. --- [RESET BÀN VỀ TRỐNG] ---
        tableService.checkoutTable(payment.getTableId());
    }
}