package com.gym.erp.service;

import com.gym.erp.entity.Admin;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.AdminDTO;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.repository.AdminRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;

    public Admin registerAdmin(Admin admin) {
        boolean exists = adminRepository.existsByUsernameOrEmailOrAdminId(
                admin.getUsername(), admin.getEmail(), admin.getAdminId());
        if (exists) {
            throw new CustomException("An admin with the same username, email, or admin ID already exists.");
        }
        return adminRepository.save(admin);
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin updateAdmin(Long id, Admin updated) {
        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setImageUrl(updated.getImageUrl());
        return adminRepository.save(existing);
    }

    public Admin authenticateAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + request.getUsername()));
        if (!admin.getPassword().equals(request.getPassword())) {
            throw new CustomException("Invalid credentials");
        }
        return admin;
    }

    public void sendForgotPasswordEmail(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No admin found with email: " + email));
        String otp = String.format("%06d", new Random().nextInt(999999));
        admin.setOtp(otp);
        admin.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        adminRepository.save(admin);
        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOTP(String email, String otp) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No admin found with email: " + email));
        if (admin.getOtpExpiry() != null && LocalDateTime.now().isAfter(admin.getOtpExpiry())) {
            throw new OTPExpiredException("OTP has expired. Please request a new one.");
        }
        if (!otp.equals(admin.getOtp())) {
            throw new OTPExpiredException("Invalid OTP provided.");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No admin found with email: " + request.getEmail()));
        admin.setPassword(request.getNewPassword());
        admin.setOtp(null);
        admin.setOtpExpiry(null);
        adminRepository.save(admin);
    }

    private AdminDTO convertToDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setAdminId(admin.getAdminId());
        dto.setUsername(admin.getUsername());
        dto.setEmail(admin.getEmail());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setPhone(admin.getPhone());
        dto.setImageUrl(admin.getImageUrl());
        dto.setCreatedAt(admin.getCreatedAt());
        return dto;
    }
}
