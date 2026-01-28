package com.restaurant.model.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restaurant.model.enums.DishStatus;
import com.restaurant.pattern.state.DishState;
import com.restaurant.pattern.state.OrderedState;
import com.restaurant.pattern.state.StateFactory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.Transient;

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
    
    @Column(name = "note")
    private String note;

    // [MỚI] Thêm trường lưu thời gian gọi riêng của món này
    @Column(name = "order_item_time")
    private LocalDateTime orderItemTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DishStatus dishStatus;

    @JsonIgnore 
    @Transient 
    private DishState state;

    public OrderItem() {
        this.dishStatus = DishStatus.ORDERED;
        this.state = new OrderedState();
        // [MỚI] Gán thời gian hiện tại khi khởi tạo
        this.orderItemTime = LocalDateTime.now();
    }

    public OrderItem(MenuItem menuItem, int quantity) {
        this(); 
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.unitPrice = menuItem.getPrice();
        this.note = ""; 
        // [MỚI] Gán thời gian hiện tại
        this.orderItemTime = LocalDateTime.now();
    }

    @PostLoad
    private void initStateFromStatus() {
        this.state = StateFactory.createState(this.dishStatus);
    }

    public void changeToNextState() {
        if (state == null) {
            initStateFromStatus();
        }
        state.nextState(this);
    }

    public double calculateSubtotal() {
        return unitPrice * quantity;
    }

    // ======= GETTERS & SETTERS ======= 
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
    
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    // [MỚI] Getter/Setter cho orderItemTime
    public LocalDateTime getOrderItemTime() { return orderItemTime; }
    public void setOrderItemTime(LocalDateTime orderItemTime) { this.orderItemTime = orderItemTime; }

    public DishStatus getDishStatus() { return dishStatus; }
    public void setDishStatus(DishStatus dishStatus) { this.dishStatus = dishStatus; }

    public DishState getState() { return state; }
    public void setState(DishState state) { this.state = state; }
}