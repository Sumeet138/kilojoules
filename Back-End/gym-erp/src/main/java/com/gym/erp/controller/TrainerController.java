package com.gym.erp.controller;

import com.gym.erp.entity.Trainer;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.payload.TrainerDTO;
import com.gym.erp.service.ImageService;
import com.gym.erp.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private ImageService imageService;

    @PostMapping("/register")
    public ResponseEntity<?> registerTrainer(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("trainerId") String trainerId,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phone") String phone,
            @RequestParam(value = "specialization", required = false) String specialization,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "certificationLevel", required = false) String certificationLevel) {
        try {
            Trainer trainer = new Trainer();
            trainer.setTrainerId(trainerId);
            trainer.setUsername(username);
            trainer.setPassword(password);
            trainer.setEmail(email);
            trainer.setFirstName(firstName);
            trainer.setLastName(lastName);
            trainer.setPhone(phone);
            trainer.setSpecialization(specialization);
            trainer.setBio(bio);
            trainer.setCertificationLevel(certificationLevel);

            if (file != null && !file.isEmpty()) {
                String imageUrl = imageService.uploadImage(file, "trainers");
                trainer.setImageUrl(imageUrl);
            }

            trainerService.registerTrainer(trainer);
            return ResponseEntity.ok("Trainer registered successfully");
        } catch (CustomException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<TrainerDTO> getAllTrainers() {
        return trainerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable Long id) {
        Optional<Trainer> trainer = trainerService.getTrainerById(id);
        return trainer.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrainer(@PathVariable Long id, @RequestBody Trainer updatedTrainer) {
        try {
            Trainer trainer = trainerService.updateTrainer(id, updatedTrainer);
            return ResponseEntity.ok(trainer);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating trainer");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrainer(@PathVariable Long id) {
        try {
            trainerService.deleteTrainer(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Trainer trainer = trainerService.authenticateTrainer(request);
            return ResponseEntity.ok(trainer);
        } catch (ResourceNotFoundException | CustomException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            trainerService.sendForgotPasswordEmail(email);
            return ResponseEntity.ok("OTP sent to your email successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        try {
            trainerService.verifyOTP(email, otp);
            return ResponseEntity.ok("OTP verified successfully");
        } catch (OTPExpiredException ex) {
            return ResponseEntity.status(HttpStatus.GONE).body(ex.getMessage());
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            trainerService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }
}
