package com.restaurant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.Payment;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.PaymentRepository;

@Service
@Transactional // Đảm bảo toàn vẹn dữ liệu (Lỗi là rollback hết)
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository; // [MỚI] Cần cái này để sửa Order
    private final TableService tableService; 

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, 
                          OrderRepository orderRepository, 
                          TableService tableService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.tableService = tableService;
    }

    // Xử lý thanh toán
    public void processPayment(Payment payment) {
        // 1. Tìm Order đang active của bàn này (Order chưa PAID)
        // Lưu ý: payment.getTableId() phải trả về int/Long đúng kiểu dữ liệu
        Order order = orderRepository.findActiveOrderByTableId(payment.getTableId())
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy đơn hàng để thanh toán!"));

        // 2. [QUAN TRỌNG] Cập nhật trạng thái Order thành PAID
        // Để nó không còn xuất hiện trong danh sách Active nữa
        order.setOrderStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // 3. Lưu lịch sử thanh toán vào Database
        // (Nếu Payment entity có trường Order, bạn nên set vào đây: payment.setOrder(order))
        paymentRepository.save(payment);

        // 4. Gọi TableService để giải phóng bàn (Reset về available)
        tableService.checkoutTable(payment.getTableId());
    }
}