package com.gym.erp.repository;

import com.gym.erp.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {

    Optional<Trainer> findByEmail(String email);

    Optional<Trainer> findByUsername(String username);

    Optional<Trainer> findByTrainerId(String trainerId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByTrainerId(String trainerId);

    boolean existsByUsernameOrEmailOrTrainerId(String username, String email, String trainerId);
}
