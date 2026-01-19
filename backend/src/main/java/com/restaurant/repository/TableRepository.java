package com.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.Table;

@Repository
public interface TableRepository extends JpaRepository<Table, Integer> {
    // Spring Boot tự động sinh code kết nối SQL
}