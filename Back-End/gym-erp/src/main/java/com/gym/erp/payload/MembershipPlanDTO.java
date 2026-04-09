package com.gym.erp.payload;

import com.gym.erp.entity.enums.PlanType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MembershipPlanDTO {
    private Long id;
    private String planName;
    private PlanType planType;
    private BigDecimal price;
    private int durationDays;
    private String description;
    private boolean isActive;
    private LocalDateTime createdAt;
}
