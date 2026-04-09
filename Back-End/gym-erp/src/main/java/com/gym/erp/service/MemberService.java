package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.MemberDTO;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.repository.MemberRepository;
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
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private EmailService emailService;

    public Member registerMember(Member member) {
        boolean exists = memberRepository.existsByUsernameOrEmailOrMemberId(
                member.getUsername(), member.getEmail(), member.getMemberId());
        if (exists) {
            throw new CustomException("A member with the same username, email, or member ID already exists.");
        }
        return memberRepository.save(member);
    }

    public List<MemberDTO> findAll() {
        return memberRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public Member updateMember(Long id, Member updated) {
        Member existing = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setHeightCm(updated.getHeightCm());
        existing.setWeightKg(updated.getWeightKg());
        existing.setHealthConditions(updated.getHealthConditions());
        existing.setFitnessGoals(updated.getFitnessGoals());
        existing.setTrainerPreference(updated.getTrainerPreference());
        existing.setImageUrl(updated.getImageUrl());
        return memberRepository.save(existing);
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }

    public Member authenticateMember(LoginRequest request) {
        Member member = memberRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + request.getUsername()));
        if (!member.getPassword().equals(request.getPassword())) {
            throw new CustomException("Invalid credentials");
        }
        return member;
    }

    public void sendForgotPasswordEmail(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No member found with email: " + email));
        String otp = String.format("%06d", new Random().nextInt(999999));
        member.setOtp(otp);
        member.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        memberRepository.save(member);
        emailService.sendOtpEmail(email, otp);
    }

    public void verifyOTP(String email, String otp) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No member found with email: " + email));
        if (member.getOtpExpiry() != null && LocalDateTime.now().isAfter(member.getOtpExpiry())) {
            throw new OTPExpiredException("OTP has expired. Please request a new one.");
        }
        if (!otp.equals(member.getOtp())) {
            throw new OTPExpiredException("Invalid OTP provided.");
        }
    }

    public void resetPassword(ResetPasswordRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No member found with email: " + request.getEmail()));
        member.setPassword(request.getNewPassword());
        member.setOtp(null);
        member.setOtpExpiry(null);
        memberRepository.save(member);
    }

    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setMemberId(member.getMemberId());
        dto.setUsername(member.getUsername());
        dto.setEmail(member.getEmail());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setPhone(member.getPhone());
        dto.setDob(member.getDob());
        dto.setAge(member.getAge());
        dto.setGender(member.getGender());
        dto.setHeightCm(member.getHeightCm());
        dto.setWeightKg(member.getWeightKg());
        dto.setHealthConditions(member.getHealthConditions());
        dto.setFitnessGoals(member.getFitnessGoals());
        dto.setTrainerPreference(member.getTrainerPreference());
        dto.setImageUrl(member.getImageUrl());
        dto.setCreatedAt(member.getCreatedAt());
        return dto;
    }
}
