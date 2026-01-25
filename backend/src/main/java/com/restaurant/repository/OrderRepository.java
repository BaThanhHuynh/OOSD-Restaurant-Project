package com.restaurant.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.Order;
import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.OrderStatus;

/**
 * Repository để truy xuất dữ liệu Order
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Tìm tất cả orders của một bàn
     */
    List<Order> findByTable(Table table);

    /**
     * Tìm tất cả orders của một bàn theo ID
     */
    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId")
    List<Order> findByTableId(@Param("tableId") int tableId);

    /**
     * [FIX LỖI QUAN TRỌNG]
     * Tìm order đang active của một bàn.
     * Active nghĩa là CHƯA THANH TOÁN (PAID), còn COMPLETED (đã lên món xong) vẫn tính là active.
     */
    @Query("SELECT o FROM Order o WHERE o.table.id = :tableId AND o.orderStatus IN ('NEW', 'IN_PROGRESS', 'COMPLETED')")
    Optional<Order> findActiveOrderByTableId(@Param("tableId") int tableId);
    /**
     * Tìm tất cả orders theo trạng thái
     */
    List<Order> findByOrderStatus(OrderStatus status);

    /**
     * Tìm tất cả orders đang IN_PROGRESS
     */
    @Query("SELECT o FROM Order o WHERE o.orderStatus = 'IN_PROGRESS'")
    List<Order> findAllInProgressOrders();

    /**
     * Đếm số lượng orders theo trạng thái
     */
    long countByOrderStatus(OrderStatus status);

    /**
     * Tìm order với items chi tiết
     */
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.orderItems WHERE o.orderId = :orderId")
    Optional<Order> findByIdWithItems(@Param("orderId") Long orderId);
}