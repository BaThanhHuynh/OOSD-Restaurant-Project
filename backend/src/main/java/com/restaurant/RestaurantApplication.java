package com.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Annotation quan trọng nhất để kích hoạt Spring Boot
public class RestaurantApplication {

    public static void main(String[] args) {
        // Câu lệnh này sẽ khởi động server Tomcat tại cổng 8080
        SpringApplication.run(RestaurantApplication.class, args);
    }
}