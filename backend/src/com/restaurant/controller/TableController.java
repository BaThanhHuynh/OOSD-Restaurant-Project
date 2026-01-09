package com.restaurant.controller;

import com.restaurant.model.entity.Table;
import com.restaurant.service.TableService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller xử lý các request về Table
 */
public class TableController {
    private final TableService tableService;

    public TableController(TableService tableService) {
        this.tableService = tableService;
    }

    public Map<String, Object> createTable(int capacity) {
        try {
            Table table = tableService.createTable(capacity);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo bàn " + table.getTableId() + " thành công");
            
            Map<String, Object> data = new HashMap<>();
            data.put("table_id", table.getTableId());
            data.put("capacity", table.getCapacity());
            data.put("status", table.getStatus().getValue());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getTableInfo(int tableId) {
        try {
            Table table = tableService.getTable(tableId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            Map<String, Object> data = new HashMap<>();
            data.put("table_id", table.getTableId());
            data.put("capacity", table.getCapacity());
            data.put("status", table.getStatus().getValue());
            data.put("current_order_id", table.getCurrentOrderId());
            response.put("data", data);
            
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> getAllTables() {
        try {
            List<Table> tables = tableService.getAllTables();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = tables.stream().map(t -> {
                Map<String, Object> item = new HashMap<>();
                item.put("table_id", t.getTableId());
                item.put("capacity", t.getCapacity());
                item.put("status", t.getStatus().getValue());
                return item;
            }).toList();
            
            response.put("data", data);
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }

    public Map<String, Object> occupyTable(int tableId) {
        try {
            tableService.occupyTable(tableId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bàn " + tableId + " đã được chiếm");
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> releaseTable(int tableId) {
        try {
            tableService.releaseTable(tableId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bàn " + tableId + " đã được giải phóng");
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> getAvailableTables() {
        try {
            List<Table> tables = tableService.getAvailableTables();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            
            List<Map<String, Object>> data = tables.stream().map(t -> {
                Map<String, Object> item = new HashMap<>();
                item.put("table_id", t.getTableId());
                item.put("capacity", t.getCapacity());
                return item;
            }).toList();
            
            response.put("data", data);
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            response.put("data", null);
            return response;
        }
    }
}
