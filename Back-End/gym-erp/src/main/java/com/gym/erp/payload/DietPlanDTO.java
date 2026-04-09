package com.gym.erp.payload;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DietPlanDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long trainerId;
    private String trainerName;
    private String planName;
    private String description;
    private int totalCalories;
    private int proteinGrams;
    private int carbsGrams;
    private int fatsGrams;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
