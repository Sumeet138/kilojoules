package com.gym.erp.repository;

import com.gym.erp.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByAdminId(String adminId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByAdminId(String adminId);

    boolean existsByUsernameOrEmailOrAdminId(String username, String email, String adminId);
}
