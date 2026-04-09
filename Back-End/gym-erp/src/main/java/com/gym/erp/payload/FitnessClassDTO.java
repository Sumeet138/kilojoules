package com.gym.erp.payload;

import com.gym.erp.entity.enums.ClassType;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class FitnessClassDTO {
    private Long id;
    private String className;
    private ClassType classType;
    private Long trainerId;
    private String trainerName;
    private DayOfWeek scheduledDay;
    private LocalTime scheduledTime;
    private int durationMinutes;
    private int capacity;
    private int currentEnrollment;
    private String description;
    private boolean isActive;
    private int spotsAvailable;
}
