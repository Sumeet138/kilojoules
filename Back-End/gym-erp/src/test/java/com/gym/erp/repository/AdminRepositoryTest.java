package com.gym.erp.repository;

import com.gym.erp.entity.Admin;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class AdminRepositoryTest {

    @Autowired
    private AdminRepository adminRepository;

    private Admin admin;

    @BeforeEach
    void setUp() {
        admin = new Admin();
        admin.setAdminId("ADM001");
        admin.setUsername("adminsuper");
        admin.setPassword("encoded_pass");
        admin.setEmail("admin@gym.com");
        admin.setFirstName("Super");
        admin.setLastName("Admin");
        admin.setPhone("9111111111");
    }

    @Test
    @DisplayName("Save admin persists and generates ID")
    void saveAdmin_persistsAndGeneratesId() {
        Admin saved = adminRepository.save(admin);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getAdminId()).isEqualTo("ADM001");
    }

    @Test
    @DisplayName("findByEmail returns correct admin")
    void findByEmail_returnsCorrectAdmin() {
        adminRepository.save(admin);
        Optional<Admin> found = adminRepository.findByEmail("admin@gym.com");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("adminsuper");
    }

    @Test
    @DisplayName("findByUsername returns correct admin")
    void findByUsername_returnsCorrectAdmin() {
        adminRepository.save(admin);
        Optional<Admin> found = adminRepository.findByUsername("adminsuper");
        assertThat(found).isPresent();
    }

    @Test
    @DisplayName("existsByUsernameOrEmailOrAdminId detects duplicates")
    void existsByUsernameOrEmailOrAdminId_detectsDuplicates() {
        adminRepository.save(admin);
        assertThat(adminRepository.existsByUsernameOrEmailOrAdminId("adminsuper", "other@gym.com", "OTHER")).isTrue();
        assertThat(adminRepository.existsByUsernameOrEmailOrAdminId("other", "admin@gym.com", "OTHER")).isTrue();
        assertThat(adminRepository.existsByUsernameOrEmailOrAdminId("other", "other@gym.com", "ADM001")).isTrue();
        assertThat(adminRepository.existsByUsernameOrEmailOrAdminId("other", "other@gym.com", "OTHER")).isFalse();
    }
}
