package com.restaurant;

import com.restaurant.model.entity.MenuItem;
import com.restaurant.model.entity.OrderItem;
import com.restaurant.model.enums.DishStatus;

/**
 * Demo State Pattern - KHÔNG sử dụng if-else
 * Chạy file này để xem State Pattern hoạt động
 */
public class StatePatternDemo {

    public static void main(String[] args) {
        System.out.println("========================================");
        System.out.println("DEMO STATE PATTERN - ORDER MANAGEMENT");
        System.out.println("========================================\n");

        // Tạo một món ăn
        MenuItem pho = new MenuItem();
        pho.setId(1);
        pho.setName("Phở Bò");
        pho.setPrice(50000);

        // Tạo order item
        OrderItem orderItem = new OrderItem(pho, 2);

        System.out.println("📋 Món ăn: " + pho.getName());
        System.out.println("💰 Giá: " + pho.getPrice() + " VNĐ");
        System.out.println("🔢 Số lượng: " + orderItem.getQuantity());
        System.out.println("💵 Tổng tiền: " + orderItem.calculateSubtotal() + " VNĐ\n");

        // Demo chuyển trạng thái - KHÔNG dùng if-else
        System.out.println("🔄 BẮT ĐẦU CHUYỂN TRẠNG THÁI (State Pattern - NO IF-ELSE)");
        System.out.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Trạng thái ban đầu
        printCurrentState(orderItem, "Ban đầu");

        // Chuyển sang COOKING
        System.out.println("\n➡️  Khách đã đặt món, bếp bắt đầu nấu...");
        orderItem.changeToNextState();
        printCurrentState(orderItem, "Sau khi chuyển");

        // Chuyển sang READY
        System.out.println("\n➡️  Món đã nấu xong...");
        orderItem.changeToNextState();
        printCurrentState(orderItem, "Sau khi chuyển");

        // Chuyển sang SERVED
        System.out.println("\n➡️  Phục vụ món cho khách...");
        orderItem.changeToNextState();
        printCurrentState(orderItem, "Sau khi chuyển");

        // Thử chuyển tiếp (đã ở trạng thái cuối)
        System.out.println("\n➡️  Thử chuyển tiếp (đã ở trạng thái cuối)...");
        orderItem.changeToNextState();
        printCurrentState(orderItem, "Sau khi thử chuyển");

        System.out.println("\n========================================");
        System.out.println("✅ HOÀN THÀNH DEMO STATE PATTERN");
        System.out.println("========================================");
        System.out.println("\n📝 LƯU Ý:");
        System.out.println("   - KHÔNG sử dụng if-else để xử lý trạng thái");
        System.out.println("   - Mỗi trạng thái là một Class riêng biệt");
        System.out.println("   - State Pattern tự động chuyển đổi");
        System.out.println("   - Tuân thủ nguyên tắc OOSD");
    }

    private static void printCurrentState(OrderItem item, String label) {
        System.out.println("   " + label + ":");
        System.out.println("   ├─ Trạng thái: " + item.getDishStatus());
        System.out.println("   └─ State Object: " + item.getState().getClass().getSimpleName());
    }
}
