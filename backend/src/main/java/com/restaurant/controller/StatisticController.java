package com.restaurant.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.model.entity.DailyStatistic;
import com.restaurant.service.StatisticService;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    // API: Tính toán và lưu thống kê cho ngày hôm nay (Dùng để chốt sổ)
    // POST /api/stats/calculate-today
    @PostMapping("/calculate-today")
    public ResponseEntity<DailyStatistic> calculateToday() {
        DailyStatistic stat = statisticService.calculateAndSaveDailyStat(LocalDate.now());
        return ResponseEntity.ok(stat);
    }

    // API: Lấy lịch sử thống kê (Dùng để vẽ biểu đồ)
    // GET /api/stats
    @GetMapping
    public ResponseEntity<List<DailyStatistic>> getAllStats() {
        return ResponseEntity.ok(statisticService.getAllStats());
    }
}