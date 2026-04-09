package com.gym.erp.payload;

import com.gym.erp.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class MemberDTO {
    private Long id;
    private String memberId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dob;
    private int age;
    private Gender gender;
    private double heightCm;
    private double weightKg;
    private String healthConditions;
    private String fitnessGoals;
    private String trainerPreference;
    private String imageUrl;
    private LocalDateTime createdAt;
}
