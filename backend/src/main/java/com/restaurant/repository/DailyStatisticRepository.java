package com.restaurant.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.model.entity.DailyStatistic;

public interface DailyStatisticRepository extends JpaRepository<DailyStatistic, Integer> {
    Optional<DailyStatistic> findByStatDate(LocalDate date);
}