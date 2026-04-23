package com.gym.erp.service;

import com.gym.erp.entity.Admin;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdminService adminService;

    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = new Admin();
        admin.setId(1L);
        admin.setAdminId("ADM001");
        admin.setUsername("adminsuper");
        admin.setPassword("rawpass");
        admin.setEmail("admin@gym.com");
        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setPhone("9111111111");
    }

    @Test
    @DisplayName("registerAdmin saves successfully when no duplicates")
    void registerAdmin_success() {
        when(adminRepository.existsByUsernameOrEmailOrAdminId(anyString(), anyString(), anyString()))
                .thenReturn(false);
        when(adminRepository.save(any(Admin.class))).thenReturn(admin);

        Admin result = adminService.registerAdmin(admin);

        assertThat(result.getAdminId()).isEqualTo("ADM001");
        verify(adminRepository, times(1)).save(any(Admin.class));
    }

    @Test
    @DisplayName("registerAdmin throws CustomException on duplicate")
    void registerAdmin_throwsCustomException_onDuplicate() {
        when(adminRepository.existsByUsernameOrEmailOrAdminId(anyString(), anyString(), anyString()))
                .thenReturn(true);

        assertThatThrownBy(() -> adminService.registerAdmin(admin))
                .isInstanceOf(CustomException.class);

        verify(adminRepository, never()).save(any());
    }

    @Test
    @DisplayName("authenticateAdmin returns admin on correct credentials")
    void authenticateAdmin_success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("adminsuper");
        request.setPassword("rawpass");

        when(adminRepository.findByUsername("adminsuper")).thenReturn(Optional.of(admin));

        Admin result = adminService.authenticateAdmin(request);

        assertThat(result.getEmail()).isEqualTo("admin@gym.com");
    }

    @Test
    @DisplayName("authenticateAdmin throws CustomException on wrong password")
    void authenticateAdmin_throwsCustomException_onWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("adminsuper");
        request.setPassword("wrong");

        when(adminRepository.findByUsername("adminsuper")).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> adminService.authenticateAdmin(request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("getAdminById returns empty when not found")
    void getAdminById_returnsEmpty_whenNotFound() {
        when(adminRepository.findById(99L)).thenReturn(Optional.empty());
        assertThat(adminService.getAdminById(99L)).isEmpty();
    }
}
