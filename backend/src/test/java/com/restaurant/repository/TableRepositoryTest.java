package com.restaurant.repository;

import com.restaurant.model.entity.Table;
import com.restaurant.model.enums.TableStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests cho TableRepository
 */
public class TableRepositoryTest {
    private TableRepository repository;

    @BeforeEach
    public void setUp() {
        repository = new TableRepository();
    }

    @Test
    public void testCreateTable() {
        Table table = repository.create(4);
        assertNotNull(table);
        assertEquals(1, table.getTableId());
        assertEquals(4, table.getCapacity());
    }

    @Test
    public void testFindById() {
        Table created = repository.create(4);
        Table found = repository.findById(created.getTableId());
        assertEquals(created.getTableId(), found.getTableId());
    }

    @Test
    public void testFindByIdNotFound() {
        assertThrows(IllegalArgumentException.class, () -> repository.findById(999));
    }

    @Test
    public void testFindAll() {
        repository.create(4);
        repository.create(6);
        repository.create(8);
        
        assertEquals(3, repository.findAll().size());
    }

    @Test
    public void testUpdate() {
        Table table = repository.create(4);
        table.setStatus(TableStatus.OCCUPIED);
        repository.update(table);
        
        Table updated = repository.findById(table.getTableId());
        assertEquals(TableStatus.OCCUPIED, updated.getStatus());
    }

    @Test
    public void testDelete() {
        Table table = repository.create(4);
        repository.delete(table.getTableId());
        
        assertThrows(IllegalArgumentException.class, () -> repository.findById(table.getTableId()));
    }

    @Test
    public void testFindAvailableTables() {
        Table table1 = repository.create(4);
        Table table2 = repository.create(6);
        Table table3 = repository.create(8);
        
        table3.setStatus(TableStatus.OCCUPIED);
        repository.update(table3);
        
        assertEquals(2, repository.findAvailableTables().size());
    }
}
