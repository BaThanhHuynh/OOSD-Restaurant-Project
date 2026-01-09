package com.restaurant.service;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import com.restaurant.repository.TableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests cho TableService
 */
public class TableServiceTest {
    private TableService tableService;
    private TableRepository tableRepository;

    @BeforeEach
    public void setUp() {
        tableRepository = new TableRepository();
        tableService = new TableService(tableRepository);
    }

    @Test
    public void testCreateTable() {
        Table table = tableService.createTable(4);
        assertNotNull(table);
        assertEquals(4, table.getCapacity());
        assertEquals(TableStatus.AVAILABLE, table.getStatus());
    }

    @Test
    public void testCreateTableInvalidCapacity() {
        assertThrows(IllegalArgumentException.class, () -> tableService.createTable(0));
        assertThrows(IllegalArgumentException.class, () -> tableService.createTable(-1));
    }

    @Test
    public void testGetTable() {
        Table created = tableService.createTable(4);
        Table retrieved = tableService.getTable(created.getTableId());
        assertEquals(created.getTableId(), retrieved.getTableId());
    }

    @Test
    public void testGetTableNotFound() {
        assertThrows(IllegalArgumentException.class, () -> tableService.getTable(999));
    }

    @Test
    public void testOccupyTable() {
        Table table = tableService.createTable(4);
        tableService.occupyTable(table.getTableId());
        Table occupied = tableService.getTable(table.getTableId());
        assertEquals(TableStatus.OCCUPIED, occupied.getStatus());
    }

    @Test
    public void testReleaseTable() {
        Table table = tableService.createTable(4);
        tableService.occupyTable(table.getTableId());
        tableService.releaseTable(table.getTableId());
        Table released = tableService.getTable(table.getTableId());
        assertEquals(TableStatus.AVAILABLE, released.getStatus());
    }

    @Test
    public void testGetAvailableTables() {
        tableService.createTable(4);
        tableService.createTable(6);
        Table table3 = tableService.createTable(8);
        
        tableService.occupyTable(table3.getTableId());
        
        assertEquals(2, tableService.getAvailableTables().size());
    }
}
