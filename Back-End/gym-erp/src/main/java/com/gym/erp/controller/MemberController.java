package com.gym.erp.controller;

import com.gym.erp.entity.Member;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.ForgotPasswordRequest;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.MemberDTO;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.service.ImageService;
import com.gym.erp.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private ImageService imageService;

    @PostMapping("/register")
    public ResponseEntity<?> registerMember(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("memberId") String memberId,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phone") String phone,
            @RequestParam("dob") LocalDate dob,
            @RequestParam("age") int age,
            @RequestParam("gender") String gender,
            @RequestParam("heightCm") double heightCm,
            @RequestParam("weightKg") double weightKg,
            @RequestParam(value = "healthConditions", required = false) String healthConditions,
            @RequestParam(value = "fitnessGoals", required = false) String fitnessGoals,
            @RequestParam(value = "trainerPreference", required = false) String trainerPreference) {
        try {
            Member member = new Member();
            member.setMemberId(memberId);
            member.setUsername(username);
            member.setPassword(password);
            member.setEmail(email);
            member.setFirstName(firstName);
            member.setLastName(lastName);
            member.setPhone(phone);
            member.setDob(dob);
            member.setAge(age);
            member.setGender(com.gym.erp.entity.enums.Gender.valueOf(gender.toUpperCase()));
            member.setHeightCm(heightCm);
            member.setWeightKg(weightKg);
            member.setHealthConditions(healthConditions);
            member.setFitnessGoals(fitnessGoals);
            member.setTrainerPreference(trainerPreference);

            if (file != null && !file.isEmpty()) {
                String imageUrl = imageService.uploadImage(file, "members");
                member.setImageUrl(imageUrl);
            }

            memberService.registerMember(member);
            return ResponseEntity.ok("Member registered successfully");
        } catch (CustomException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A member with the same unique field already exists.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering member: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<MemberDTO> getAllMembers() {
        return memberService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Optional<Member> member = memberService.getMemberById(id);
        return member.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @RequestBody Member updatedMember) {
        try {
            Member member = memberService.updateMember(id, updatedMember);
            return ResponseEntity.ok(member);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating member");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Member member = memberService.authenticateMember(request);
            return ResponseEntity.ok(member);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
        } catch (CustomException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: " + ex.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            memberService.sendForgotPasswordEmail(email);
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
            memberService.verifyOTP(email, otp);
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
            memberService.resetPassword(request);
            return ResponseEntity.ok("Password reset successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + ex.getMessage());
        }
    }
}
