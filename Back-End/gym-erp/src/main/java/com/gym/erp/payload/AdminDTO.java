package com.gym.erp.payload;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminDTO {
    private Long id;
    private String adminId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String imageUrl;
    private LocalDateTime createdAt;
}
