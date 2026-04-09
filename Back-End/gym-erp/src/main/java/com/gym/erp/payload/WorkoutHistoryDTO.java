package com.gym.erp.payload;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkoutHistoryDTO {
    private Long id;
    private Long memberId;
    private Long trainerId;
    private LocalDate workoutDate;
    private String exerciseName;
    private Integer sets;
    private Integer reps;
    private Double weightKg;
    private Integer durationMinutes;
    private String notes;
}
