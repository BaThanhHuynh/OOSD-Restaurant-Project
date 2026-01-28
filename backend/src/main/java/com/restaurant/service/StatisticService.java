package com.restaurant.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.DailyStatistic;
import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.OrderStatus;
import com.restaurant.repository.DailyStatisticRepository;
import com.restaurant.repository.OrderRepository;

@Service
public class StatisticService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DailyStatisticRepository statRepository;

    // Hàm này sẽ được gọi khi bấm nút "Chốt sổ ngày" hoặc gọi API thủ công
    public DailyStatistic calculateAndSaveDailyStat(LocalDate date) {
        // 1. Lấy tất cả đơn hàng ĐÃ THANH TOÁN (PAID) trong ngày đó
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.PAID &&
                        o.getCompletedTime() != null &&
                        o.getCompletedTime().isAfter(startOfDay) &&
                        o.getCompletedTime().isBefore(endOfDay))
                .collect(Collectors.toList());

        // 2. Tính toán
        double revenue = orders.stream().mapToDouble(Order::getTotalAmount).sum();
        int totalOrders = orders.size();

        // 3. Tìm món bán chạy nhất
        Map<Integer, Integer> dishCount = new HashMap<>();
        Map<Integer, String> dishNames = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                int menuId = item.getMenuItem().getId();
                dishCount.put(menuId, dishCount.getOrDefault(menuId, 0) + item.getQuantity());
                dishNames.putIfAbsent(menuId, item.getMenuItem().getName());
            }
        }

        Integer bestDishId = null;
        String bestDishName = "Không có";
        int maxQty = 0;

        for (Map.Entry<Integer, Integer> entry : dishCount.entrySet()) {
            if (entry.getValue() > maxQty) {
                maxQty = entry.getValue();
                bestDishId = entry.getKey();
                bestDishName = dishNames.get(bestDishId);
            }
        }

        // 4. Lưu vào Database (Nếu đã có thống kê ngày này rồi thì cập nhật, chưa có thì tạo mới)
        DailyStatistic stat = statRepository.findByStatDate(date)
                .orElse(new DailyStatistic());

        stat.setStatDate(date);
        stat.setTotalRevenue(revenue);
        stat.setTotalOrders(totalOrders);
        stat.setPopularDishId(bestDishId);
        stat.setPopularDishName(bestDishName);

        return statRepository.save(stat);
    }
    
    // Lấy danh sách thống kê để vẽ biểu đồ
    public List<DailyStatistic> getAllStats() {
        return statRepository.findAll();
    }
}