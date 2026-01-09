package com.restaurant;

import com.restaurant.controller.MenuController;
import com.restaurant.controller.OrderController;
import com.restaurant.controller.PaymentController;
import com.restaurant.controller.TableController;
import com.restaurant.model.enums.PaymentMethod;
import com.restaurant.pattern.strategy.CashPayment;
import com.restaurant.repository.MenuRepository;
import com.restaurant.repository.OrderRepository;
import com.restaurant.repository.PaymentRepository;
import com.restaurant.repository.TableRepository;
import com.restaurant.service.MenuService;
import com.restaurant.service.OrderService;
import com.restaurant.service.PaymentService;
import com.restaurant.service.TableService;

/**
 * Main entry point cho ứng dụng quản lý nhà hàng
 */
public class Main {
    public static void main(String[] args) {
        // Khởi tạo Repositories
        TableRepository tableRepository = new TableRepository();
        MenuRepository menuRepository = new MenuRepository();
        OrderRepository orderRepository = new OrderRepository(menuRepository);
        PaymentRepository paymentRepository = new PaymentRepository();

        // Khởi tạo Services
        TableService tableService = new TableService(tableRepository);
        MenuService menuService = new MenuService(menuRepository);
        OrderService orderService = new OrderService(orderRepository, menuRepository);
        PaymentService paymentService = new PaymentService(paymentRepository);

        // Khởi tạo Controllers
        TableController tableController = new TableController(tableService);
        MenuController menuController = new MenuController(menuService);
        OrderController orderController = new OrderController(orderService);
        PaymentController paymentController = new PaymentController(paymentService);

        // Demo: Thêm một số bàn
        System.out.println("=== Khởi tạo bàn ===");
        var createTable1 = tableController.createTable(4);
        System.out.println(createTable1.get("message"));
        
        var createTable2 = tableController.createTable(6);
        System.out.println(createTable2.get("message"));

        // Demo: Thêm các món ăn
        System.out.println("\n=== Thêm món ăn ===");
        var createPad = menuController.addMenuItem("Pad Thai", 45000, "Bánh mì xào kiểu Thái");
        System.out.println(createPad.get("message"));
        
        var createCom = menuController.addMenuItem("Cơm tấm", 35000, "Cơm tấm Sài Gòn");
        System.out.println(createCom.get("message"));

        // Demo: Tạo đơn hàng
        System.out.println("\n=== Tạo đơn hàng ===");
        var createOrder = orderController.createOrder(1);
        System.out.println(createOrder.get("message"));

        // Demo: Thêm mục vào đơn hàng
        System.out.println("\n=== Thêm mục vào đơn ===");
        var addItem1 = orderController.addItemToOrder(1, 1, 2, "Không cay");
        System.out.println(addItem1.get("message"));
        
        var addItem2 = orderController.addItemToOrder(1, 2, 1, "");
        System.out.println(addItem2.get("message"));

        // Demo: Lấy thông tin đơn
        System.out.println("\n=== Thông tin đơn hàng ===");
        var orderInfo = orderController.getOrder(1);
        if ((boolean) orderInfo.get("success")) {
            @SuppressWarnings("unchecked")
            var data = (java.util.Map<String, Object>) orderInfo.get("data");
            System.out.println("Tổng cộng: " + data.get("total_amount") + " đ");
        }

        // Demo: Tạo thanh toán
        System.out.println("\n=== Tạo thanh toán ===");
        var createPayment = paymentController.createPayment(1, 125000, "CASH");
        System.out.println(createPayment.get("message"));

        // Demo: Hoàn thành thanh toán
        System.out.println("\n=== Hoàn thành thanh toán ===");
        var completePayment = paymentController.completePayment(1, new CashPayment());
        System.out.println(completePayment.get("message"));

        // Demo: Lấy tất cả bàn
        System.out.println("\n=== Tất cả bàn ===");
        var allTables = tableController.getAllTables();
        if ((boolean) allTables.get("success")) {
            @SuppressWarnings("unchecked")
            var tables = (java.util.List<java.util.Map<String, Object>>) allTables.get("data");
            System.out.println("Tổng số bàn: " + tables.size());
        }

        // Demo: Lấy các bàn còn trống
        System.out.println("\n=== Bàn còn trống ===");
        var availableTables = tableController.getAvailableTables();
        if ((boolean) availableTables.get("success")) {
            @SuppressWarnings("unchecked")
            var tables = (java.util.List<java.util.Map<String, Object>>) availableTables.get("data");
            System.out.println("Số bàn còn trống: " + tables.size());
        }

        System.out.println("\n=== Khởi động thành công ===");
    }
}
