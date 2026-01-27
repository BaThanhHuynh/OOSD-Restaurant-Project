package com.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.model.entity.Settings;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Integer> {
}