package com.gym.erp.payload;

import com.gym.erp.entity.enums.RecipientType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private RecipientType recipientType;
    private boolean isRead;
    private LocalDateTime createdAt;
}
