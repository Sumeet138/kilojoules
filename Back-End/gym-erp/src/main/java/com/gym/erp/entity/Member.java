package com.gym.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.gym.erp.entity.enums.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "members", uniqueConstraints = {
        @UniqueConstraint(columnNames = "memberId", name = "uk_members_member_id"),
        @UniqueConstraint(columnNames = "username", name = "uk_members_username"),
        @UniqueConstraint(columnNames = "email", name = "uk_members_email")
})
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    @NotBlank
    private String memberId;

    @Column(unique = true, nullable = false, length = 50)
    @NotBlank
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    @NotBlank
    private String password;

    @Column(unique = true, nullable = false)
    @Email
    @NotBlank
    private String email;

    @Column(nullable = false, length = 50)
    @NotBlank
    private String firstName;

    @Column(nullable = false, length = 50)
    @NotBlank
    private String lastName;

    @Column(nullable = false, length = 15)
    @NotBlank
    private String phone;

    @Column(nullable = false)
    @NotNull
    private LocalDate dob;

    @Column(nullable = false)
    private int age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @NotNull
    private Gender gender;

    @Column(nullable = false)
    private double heightCm;

    @Column(nullable = false)
    private double weightKg;

    @Column(length = 500)
    private String healthConditions;

    @Column(length = 500)
    private String fitnessGoals;

    @Column(length = 200)
    private String trainerPreference;

    @Column(length = 255)
    private String imageUrl;

    @JsonIgnore
    @Column
    private String otp;

    @JsonIgnore
    @Column
    private LocalDateTime otpExpiry;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
