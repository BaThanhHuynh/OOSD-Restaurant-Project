package com.restaurant.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurant.model.entity.Settings;
import com.restaurant.repository.SettingsRepository;

@Service
public class SettingsService {

    @Autowired
    private SettingsRepository settingsRepository;

    // Lấy thông tin (Luôn lấy ID 1)
    public Settings getSettings() {
        return settingsRepository.findById(1).orElseGet(() -> {
            Settings defaultSet = new Settings();
            defaultSet.setId(1);
            defaultSet.setRestaurantName("Nhà hàng Mẫu");
            defaultSet.setAddress("Địa chỉ mặc định");
            defaultSet.setTaxRate(8);
            defaultSet.setCurrency("VND");
            return settingsRepository.save(defaultSet);
        });
    }

    // Cập nhật thông tin
    public Settings updateSettings(Settings newInfo) {
        Settings current = getSettings();
        current.setRestaurantName(newInfo.getRestaurantName());
        current.setAddress(newInfo.getAddress());
        current.setTaxRate(newInfo.getTaxRate());
        // currency giữ nguyên hoặc update tùy bạn
        return settingsRepository.save(current);
    }
}