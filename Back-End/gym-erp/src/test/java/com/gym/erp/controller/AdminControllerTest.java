package com.gym.erp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.erp.entity.Admin;
import com.gym.erp.exception.CustomException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.service.AdminService;
import com.gym.erp.service.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    @MockBean
    private ImageService imageService;

    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = new Admin();
        admin.setId(1L);
        admin.setAdminId("ADM001");
        admin.setUsername("adminsuper");
        admin.setPassword("pass");
        admin.setEmail("admin@gym.com");
        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setPhone("9111111111");
    }

    @Test
    @DisplayName("GET /api/admin/{id} returns 200 when found")
    void getAdminById_returns200() throws Exception {
        when(adminService.getAdminById(1L)).thenReturn(Optional.of(admin));

        mockMvc.perform(get("/api/admin/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.adminId").value("ADM001"));
    }

    @Test
    @DisplayName("GET /api/admin/{id} returns 404 when not found")
    void getAdminById_returns404() throws Exception {
        when(adminService.getAdminById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/admin/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/admin/login returns 200 on valid credentials")
    void login_returns200() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("adminsuper");
        request.setPassword("pass");

        when(adminService.authenticateAdmin(any(LoginRequest.class))).thenReturn(admin);

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.adminId").value("ADM001"));
    }

    @Test
    @DisplayName("POST /api/admin/login returns 401 on invalid credentials")
    void login_returns401() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("adminsuper");
        request.setPassword("wrong");

        when(adminService.authenticateAdmin(any(LoginRequest.class)))
                .thenThrow(new CustomException("Invalid credentials"));

        mockMvc.perform(post("/api/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
