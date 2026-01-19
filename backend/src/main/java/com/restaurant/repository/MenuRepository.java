package com.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.MenuItem;

@Repository
public interface MenuRepository extends JpaRepository<MenuItem, Integer> {
}