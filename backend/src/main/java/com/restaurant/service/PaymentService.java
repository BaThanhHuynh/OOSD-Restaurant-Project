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
@Transactional
public class PaymentService {
    
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private TableService tableService;

    public void processPayment(int tableId, double amount, String method) {
        // 1. Tìm đơn hàng đang ăn (Active Order) của bàn này
        Order order = orderRepository.findActiveOrderByTableId(tableId)
                .orElseThrow(() -> new RuntimeException("Bàn này chưa có đơn hàng nào!"));

        // 2. Tạo Payment và GẮN ĐƠN HÀNG VÀO (Bước quan trọng nhất)
        Payment payment = new Payment();
        payment.setOrder(order);           // <-- Đây là dòng giúp lưu order_id vào DB
        payment.setAmount(amount);
        payment.setMethod(method);
        payment.setPaymentTime(LocalDateTime.now());
        
        // 3. Lưu xuống bảng payments
        paymentRepository.save(payment);

        // 4. Đánh dấu đơn hàng là Đã thanh toán (để không hiện lại nữa)
        order.setOrderStatus(OrderStatus.PAID);
        order.setPaymentStatus("paid");
        orderRepository.save(order);

        // 5. Trả bàn về trạng thái Trống
        tableService.checkoutTable(tableId);
    }
}