package com.gym.erp.payload;

import com.gym.erp.entity.enums.BMICategory;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BMIRecordDTO {
    private Long id;
    private Long memberId;
    private double heightCm;
    private double weightKg;
    private double bmi;
    private BMICategory category;
    private LocalDate recordDate;
    private String notes;
}
