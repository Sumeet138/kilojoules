package com.gym.erp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.Gender;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.OTPExpiredException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.MemberDTO;
import com.gym.erp.payload.ResetPasswordRequest;
import com.gym.erp.service.ImageService;
import com.gym.erp.service.MemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemberService memberService;

    @MockBean
    private ImageService imageService;

    private Member member;
    private MemberDTO memberDTO;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");
        member.setUsername("johndoe");
        member.setPassword("pass");
        member.setEmail("john@gym.com");
        member.setFirstName("John");
        member.setLastName("Doe");
        member.setPhone("9876543210");
        member.setDob(LocalDate.of(1995, 5, 15));
        member.setAge(29);
        member.setGender(Gender.MALE);
        member.setHeightCm(175.0);
        member.setWeightKg(75.0);

        memberDTO = new MemberDTO();
        memberDTO.setId(1L);
        memberDTO.setMemberId("MEM001");
        memberDTO.setEmail("john@gym.com");
        memberDTO.setFirstName("John");
        memberDTO.setLastName("Doe");
    }

    @Test
    @DisplayName("GET /api/members returns 200 with member list")
    void getAllMembers_returns200() throws Exception {
        when(memberService.findAll()).thenReturn(List.of(memberDTO));

        mockMvc.perform(get("/api/members"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].memberId").value("MEM001"))
                .andExpect(jsonPath("$[0].email").value("john@gym.com"));
    }

    @Test
    @DisplayName("GET /api/members/{id} returns 200 when found")
    void getMemberById_returns200() throws Exception {
        when(memberService.getMemberById(1L)).thenReturn(Optional.of(member));

        mockMvc.perform(get("/api/members/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberId").value("MEM001"));
    }

    @Test
    @DisplayName("GET /api/members/{id} returns 404 when not found")
    void getMemberById_returns404() throws Exception {
        when(memberService.getMemberById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/members/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/members/login returns 200 on valid credentials")
    void login_returns200_onValidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("pass");

        when(memberService.authenticateMember(any(LoginRequest.class))).thenReturn(member);

        mockMvc.perform(post("/api/members/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.memberId").value("MEM001"));
    }

    @Test
    @DisplayName("POST /api/members/login returns 401 on invalid credentials")
    void login_returns401_onInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("johndoe");
        request.setPassword("wrong");

        when(memberService.authenticateMember(any(LoginRequest.class)))
                .thenThrow(new CustomException("Invalid credentials"));

        mockMvc.perform(post("/api/members/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/members/forgot-password returns 200 on success")
    void forgotPassword_returns200() throws Exception {
        doNothing().when(memberService).sendForgotPasswordEmail(anyString());

        mockMvc.perform(post("/api/members/forgot-password")
                        .param("email", "john@gym.com"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/members/verify-otp returns 200 on success")
    void verifyOtp_returns200() throws Exception {
        doNothing().when(memberService).verifyOTP(anyString(), anyString());

        mockMvc.perform(post("/api/members/verify-otp")
                        .param("email", "john@gym.com")
                        .param("otp", "123456"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/members/verify-otp returns 410 on expired OTP")
    void verifyOtp_returns410_onExpiredOtp() throws Exception {
        doThrow(new OTPExpiredException("OTP expired"))
                .when(memberService).verifyOTP(anyString(), anyString());

        mockMvc.perform(post("/api/members/verify-otp")
                        .param("email", "john@gym.com")
                        .param("otp", "wrong"))
                .andExpect(status().isGone());
    }

    @Test
    @DisplayName("DELETE /api/members/{id} returns 204 on success")
    void deleteMember_returns204() throws Exception {
        doNothing().when(memberService).deleteMember(1L);

        mockMvc.perform(delete("/api/members/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/members/{id} returns 404 when not found")
    void deleteMember_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Member not found"))
                .when(memberService).deleteMember(99L);

        mockMvc.perform(delete("/api/members/99"))
                .andExpect(status().isNotFound());
    }
}
