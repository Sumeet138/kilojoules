package com.gym.erp.payload;

import com.gym.erp.entity.enums.MembershipStatus;
import com.gym.erp.entity.enums.PaymentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MemberMembershipDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long planId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private MembershipStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
}
