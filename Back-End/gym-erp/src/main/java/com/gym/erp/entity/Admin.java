package com.gym.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admins", uniqueConstraints = {
        @UniqueConstraint(columnNames = "adminId", name = "uk_admins_admin_id"),
        @UniqueConstraint(columnNames = "username", name = "uk_admins_username"),
        @UniqueConstraint(columnNames = "email", name = "uk_admins_email")
})
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    @NotBlank
    private String adminId;

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
