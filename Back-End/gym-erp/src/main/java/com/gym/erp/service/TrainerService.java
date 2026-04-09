package com.gym.erp.service;

import com.gym.erp.entity.Trainer;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.payload.TrainerDTO;
import com.gym.erp.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private EmailService emailService;

    public Trainer registerTrainer(Trainer trainer) {
        boolean exists = trainerRepository.existsByUsernameOrEmailOrTrainerId(
                trainer.getUsername(), trainer.getEmail(), trainer.getTrainerId());
        if (exists) {
            throw new CustomException("A trainer with the same username, email, or trainer ID already exists.");
        }
        return trainerRepository.save(trainer);
    }

    public List<TrainerDTO> findAll() {
        return trainerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Trainer> getTrainerById(Long id) {
        return trainerRepository.findById(id);
    }

    public Trainer updateTrainer(Long id, Trainer updated) {
        Trainer existing = trainerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with id: " + id));
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setSpecialization(updated.getSpecialization());
        existing.setBio(updated.getBio());
        existing.setCertificationLevel(updated.getCertificationLevel());
        existing.setImageUrl(updated.getImageUrl());
        return trainerRepository.save(existing);
    }

    public void deleteTrainer(Long id) {
        if (!trainerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trainer not found with id: " + id);
        }
        trainerRepository.deleteById(id);
    }

    public Trainer authenticateTrainer(LoginRequest request) {
        Trainer trainer = trainerRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found: " + request.getUsername()));
        if (!trainer.getPassword().equals(request.getPassword())) {
            throw new CustomException("Invalid credentials");
        }
        return trainer;
    }

    public void sendForgotPasswordEmail(String email) {
        Trainer trainer = trainerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No trainer found with email: " + email));
        String otp = String.format("%06d", new Random().nextInt(999999));
        trainer.setOtp(otp);
        trainer.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        trainerRepository.save(trainer);
        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOTP(String email, String otp) {
        Trainer trainer = trainerRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No trainer found with email: " + email));
        if (trainer.getOtpExpiry() != null && LocalDateTime.now().isAfter(trainer.getOtpExpiry())) {
            throw new OTPExpiredException("OTP has expired. Please request a new one.");
        }
        if (!otp.equals(trainer.getOtp())) {
            throw new OTPExpiredException("Invalid OTP provided.");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        Trainer trainer = trainerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No trainer found with email: " + request.getEmail()));
        trainer.setPassword(request.getNewPassword());
        trainer.setOtp(null);
        trainer.setOtpExpiry(null);
        trainerRepository.save(trainer);
    }

    private TrainerDTO convertToDTO(Trainer trainer) {
        TrainerDTO dto = new TrainerDTO();
        dto.setId(trainer.getId());
        dto.setTrainerId(trainer.getTrainerId());
        dto.setUsername(trainer.getUsername());
        dto.setEmail(trainer.getEmail());
        dto.setFirstName(trainer.getFirstName());
        dto.setLastName(trainer.getLastName());
        dto.setPhone(trainer.getPhone());
        dto.setSpecialization(trainer.getSpecialization());
        dto.setBio(trainer.getBio());
        dto.setCertificationLevel(trainer.getCertificationLevel());
        dto.setImageUrl(trainer.getImageUrl());
        dto.setCreatedAt(trainer.getCreatedAt());
        return dto;
    }
}
