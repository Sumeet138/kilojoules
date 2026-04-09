package com.gym.erp.payload;

import com.gym.erp.entity.enums.BookingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ClassBookingDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long classId;
    private String className;
    private LocalDate bookingDate;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
