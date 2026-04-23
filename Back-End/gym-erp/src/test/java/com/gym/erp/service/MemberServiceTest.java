package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.Gender;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.MemberDTO;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private MemberService memberService;

    private Member member;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");
        member.setUsername("johndoe");
        member.setPassword("rawpass");
        member.setEmail("john@gym.com");
        member.setFirstName("John");
        member.setLastName("Doe");
        member.setPhone("9876543210");
        member.setDob(LocalDate.of(1995, 5, 15));
        member.setAge(29);
        member.setGender(Gender.MALE);
        member.setHeightCm(175.0);
        member.setWeightKg(75.0);
        member.setHealthConditions("None");
        member.setFitnessGoals("Weight loss");
    }

    @Test
    @DisplayName("registerMember saves and returns member when no duplicates")
    void registerMember_success() {
        when(memberRepository.existsByUsernameOrEmailOrMemberId(anyString(), anyString(), anyString()))
                .thenReturn(false);
        when(memberRepository.save(any(Member.class))).thenReturn(member);

        Member result = memberService.registerMember(member);

        assertThat(result).isNotNull();
        assertThat(result.getMemberId()).isEqualTo("MEM001");
        verify(memberRepository, times(1)).save(any(Member.class));
    }

    @Test
    @DisplayName("registerMember throws CustomException when duplicate exists")
    void registerMember_throwsCustomException_onDuplicate() {
        when(memberRepository.existsByUsernameOrEmailOrMemberId(anyString(), anyString(), anyString()))
                .thenReturn(true);

        assertThatThrownBy(() -> memberService.registerMember(member))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("already exists");

        verify(memberRepository, never()).save(any());
    }

    @Test
    @DisplayName("findAll returns list of MemberDTOs")
    void findAll_returnsListOfDTOs() {
        when(memberRepository.findAll()).thenReturn(List.of(member));

        List<MemberDTO> result = memberService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("john@gym.com");
    }

    @Test
    @DisplayName("getMemberById returns member when found")
    void getMemberById_returnsMember_whenFound() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        Optional<Member> result = memberService.getMemberById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getMemberId()).isEqualTo("MEM001");
    }

    @Test
    @DisplayName("getMemberById returns empty when not found")
    void getMemberById_returnsEmpty_whenNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Member> result = memberService.getMemberById(99L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("authenticateMember returns member on correct credentials")
    void authenticateMember_success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("rawpass");

        when(memberRepository.findByUsername("johndoe")).thenReturn(Optional.of(member));

        Member result = memberService.authenticateMember(request);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("john@gym.com");
    }

    @Test
    @DisplayName("authenticateMember throws CustomException on wrong password")
    void authenticateMember_throwsCustomException_onWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("wrongpass");

        when(memberRepository.findByUsername("johndoe")).thenReturn(Optional.of(member));

        assertThatThrownBy(() -> memberService.authenticateMember(request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("authenticateMember throws ResourceNotFoundException when user not found")
    void authenticateMember_throwsResourceNotFoundException_whenNotFound() {
        LoginRequest request = new LoginRequest();
        request.setUsername("unknown");
        request.setPassword("pass");

        when(memberRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.authenticateMember(request))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("sendForgotPasswordEmail sends OTP and saves it")
    void sendForgotPasswordEmail_sendsOtp() {
        when(memberRepository.findByEmail("john@gym.com")).thenReturn(Optional.of(member));
        when(memberRepository.save(any(Member.class))).thenReturn(member);

        memberService.sendForgotPasswordEmail("john@gym.com");

        verify(emailService, times(1)).sendOtpEmail(eq("john@gym.com"), anyString());
        verify(memberRepository, times(1)).save(any(Member.class));
    }

    @Test
    @DisplayName("sendForgotPasswordEmail throws ResourceNotFoundException when email missing")
    void sendForgotPasswordEmail_throwsResourceNotFoundException_whenEmailMissing() {
        when(memberRepository.findByEmail("missing@gym.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.sendForgotPasswordEmail("missing@gym.com"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("verifyOTP succeeds when OTP matches and is not expired")
    void verifyOTP_success() {
        member.setOtp("123456");
        member.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        when(memberRepository.findByEmail("john@gym.com")).thenReturn(Optional.of(member));

        assertThatCode(() -> memberService.verifyOTP("john@gym.com", "123456"))
                .doesNotThrowAnyException();
    }

    @Test
    @DisplayName("verifyOTP throws OTPExpiredException when OTP is wrong")
    void verifyOTP_throwsOTPExpiredException_whenOtpWrong() {
        member.setOtp("123456");
        member.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        when(memberRepository.findByEmail("john@gym.com")).thenReturn(Optional.of(member));

        assertThatThrownBy(() -> memberService.verifyOTP("john@gym.com", "999999"))
                .isInstanceOf(OTPExpiredException.class);
    }

    @Test
    @DisplayName("verifyOTP throws OTPExpiredException when OTP is expired")
    void verifyOTP_throwsOTPExpiredException_whenExpired() {
        member.setOtp("123456");
        member.setOtpExpiry(LocalDateTime.now().minusMinutes(1)); // expired

        when(memberRepository.findByEmail("john@gym.com")).thenReturn(Optional.of(member));

        assertThatThrownBy(() -> memberService.verifyOTP("john@gym.com", "123456"))
                .isInstanceOf(OTPExpiredException.class);
    }

    @Test
    @DisplayName("resetPassword updates password successfully")
    void resetPassword_success() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("john@gym.com");
        request.setNewPassword("newpass123");

        when(memberRepository.findByEmail("john@gym.com")).thenReturn(Optional.of(member));
        when(memberRepository.save(any(Member.class))).thenReturn(member);

        memberService.resetPassword(request);

        verify(memberRepository, times(1)).save(any(Member.class));
        assertThat(member.getPassword()).isEqualTo("newpass123");
    }
}
