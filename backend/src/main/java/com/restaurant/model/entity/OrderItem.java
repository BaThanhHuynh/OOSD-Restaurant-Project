package com.restaurant.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restaurant.model.enums.DishStatus;
import com.restaurant.pattern.state.*;
import jakarta.persistence.*;

/**
 * Entity đại diện cho một món ăn trong Order
 * Áp dụng State Pattern để quản lý trạng thái món ăn
 */
@Entity
@jakarta.persistence.Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private double unitPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DishStatus dishStatus;

    @JsonIgnore // Không trả về JSON vì chỉ dùng cho logic backend
    @Transient // Không lưu vào database vì State là logic
    private DishState state;

    // Constructor mặc định
    public OrderItem() {
        this.dishStatus = DishStatus.ORDERED;
        this.state = new OrderedState();
    }

    // Constructor với parameters
    public OrderItem(MenuItem menuItem, int quantity) {
        this(); // Phải là statement đầu tiên
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.unitPrice = menuItem.getPrice(); // Lưu giá tại thời điểm đặt
    }

    // ======= STATE PATTERN METHODS (Không dùng if-else) =======

    /**
     * Khởi tạo state object từ dishStatus khi load từ database
     */
    @PostLoad
    private void initStateFromStatus() {
        // Tạo state object tương ứng với dishStatus
        // Sử dụng Map thay vì if-else để tuân thủ OOSD
        this.state = StateFactory.createState(this.dishStatus);
    }

    /**
     * Chuyển sang trạng thái tiếp theo
     */
    public void changeToNextState() {
        if (state == null) {
            initStateFromStatus();
        }
        state.nextState(this);
    }

    /**
     * Tính tổng tiền của món
     * @return Tổng tiền = giá món × số lượng
     */
    public double calculateSubtotal() {
        return unitPrice * quantity;
    }

    // ======= GETTERS & SETTERS ======= 
    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public DishStatus getDishStatus() {
        return dishStatus;
    }

    public void setDishStatus(DishStatus dishStatus) {
        this.dishStatus = dishStatus;
    }

    public DishState getState() {
        return state;
    }

    public void setState(DishState state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "id=" + orderItemId +
                ", món=" + menuItem.getName() +
                ", số lượng=" + quantity +
                ", trạng thái=" + dishStatus +
                ", giá=" + calculateSubtotal() +
                '}';
    }
}