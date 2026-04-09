package com.gym.erp.payload;

import com.gym.erp.entity.enums.PaymentMethod;
import com.gym.erp.entity.enums.TransactionStatus;
import com.gym.erp.entity.enums.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionDTO {
    private Long id;
    private Long memberId;
    private String memberName;
    private TransactionType transactionType;
    private BigDecimal amount;
    private String description;
    private LocalDate transactionDate;
    private PaymentMethod paymentMethod;
    private TransactionStatus status;
}
