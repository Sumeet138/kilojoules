package com.gym.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gym.erp.entity.enums.BMICategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bmi_records")
public class BMIRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private double heightCm;

    @Column(nullable = false)
    private double weightKg;

    @Column(nullable = false)
    private double bmi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BMICategory category;

    @Column(nullable = false)
    private LocalDate recordDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordDate == null) {
            recordDate = LocalDate.now();
        }
    }
}
