package com.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import com.restaurant.repository.TableRepository;

@Service 
public class TableService {
    
    private final TableRepository tableRepository;


    @Autowired 
    public TableService(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    // --- CÁC HÀM LOGIC NGHIỆP VỤ BÊN DƯỚI GIỮ NGUYÊN ---

    public List<Table> getAllTables() {
        return tableRepository.findAll();
    }

    public void createTable(int id, int number, int capacity) {
        if (tableRepository.findById(id).isPresent()) {
            throw new IllegalArgumentException("Lỗi: ID bàn " + id + " đã tồn tại!");
        }
        
        // Nếu hợp lệ thì mới tạo đối tượng Table
        Table newTable = new Table(id, number, capacity);
        tableRepository.save(newTable);
    }

    public void openTable(int id) {
        Optional<Table> tableOpt = tableRepository.findById(id);

        if (tableOpt.isEmpty()) {
            throw new IllegalArgumentException("Lỗi: Không tìm thấy bàn có ID " + id);
        }

        Table table = tableOpt.get();
        if (table.getStatus() != TableStatus.AVAILABLE) {
            throw new IllegalStateException("Lỗi: Bàn này hiện không trống (Trạng thái: " + table.getStatus() + ")");
        }
        table.setStatus(TableStatus.OCCUPIED);
        tableRepository.save(table);
    }

    public void removeTable(int id) {
        Optional<Table> tableOpt = tableRepository.findById(id);
        
        if (tableOpt.isPresent()) {
            Table table = tableOpt.get();
            if (table.getStatus() != TableStatus.AVAILABLE) {
                throw new IllegalStateException("Lỗi: Không thể xóa bàn đang có người ngồi hoặc chưa thanh toán!");
            }
            tableRepository.delete(id);
        } else {
            throw new IllegalArgumentException("Lỗi: Không tìm thấy bàn để xóa.");
        }
    }

    public void checkoutTable(int id) {
        Optional<Table> tableOpt = tableRepository.findById(id);
        if (tableOpt.isEmpty()) {
            throw new IllegalArgumentException("Lỗi: Không tìm thấy bàn có ID " + id);
    }
        Table table = tableOpt.get();
    
        if (table.getStatus() != TableStatus.OCCUPIED) {
            throw new IllegalStateException("Lỗi: Bàn này chưa có khách, không thể thanh toán!");
        }

        table.setStatus(TableStatus.AVAILABLE);
        tableRepository.save(table);
}
}