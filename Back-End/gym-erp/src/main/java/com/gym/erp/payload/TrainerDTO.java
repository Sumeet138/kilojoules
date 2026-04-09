package com.gym.erp.payload;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TrainerDTO {
    private Long id;
    private String trainerId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String specialization;
    private String bio;
    private String certificationLevel;
    private String imageUrl;
    private LocalDateTime createdAt;
}
