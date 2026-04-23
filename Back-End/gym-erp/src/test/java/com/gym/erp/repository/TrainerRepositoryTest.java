package com.gym.erp.repository;

import com.gym.erp.entity.Trainer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class TrainerRepositoryTest {

    @Autowired
    private TrainerRepository trainerRepository;

    private Trainer trainer;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setTrainerId("TRN001");
        trainer.setUsername("coachmark");
        trainer.setPassword("encoded_pass");
        trainer.setEmail("mark@gym.com");
        trainer.setFirstName("Mark");
        trainer.setLastName("Johnson");
        trainer.setPhone("9000000001");
        trainer.setSpecialization("HIIT and CrossFit");
        trainer.setBio("10 years of experience in fitness training");
        trainer.setCertificationLevel("Advanced");
    }

    @Test
    @DisplayName("Save trainer persists and generates ID")
    void saveTrainer_persistsAndGeneratesId() {
        Trainer saved = trainerRepository.save(trainer);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTrainerId()).isEqualTo("TRN001");
    }

    @Test
    @DisplayName("findByEmail returns correct trainer")
    void findByEmail_returnsCorrectTrainer() {
        trainerRepository.save(trainer);
        Optional<Trainer> found = trainerRepository.findByEmail("mark@gym.com");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("coachmark");
    }

    @Test
    @DisplayName("findByUsername returns correct trainer")
    void findByUsername_returnsCorrectTrainer() {
        trainerRepository.save(trainer);
        Optional<Trainer> found = trainerRepository.findByUsername("coachmark");
        assertThat(found).isPresent();
    }

    @Test
    @DisplayName("existsByUsernameOrEmailOrTrainerId detects all duplicates")
    void existsByUsernameOrEmailOrTrainerId_detectsDuplicates() {
        trainerRepository.save(trainer);
        assertThat(trainerRepository.existsByUsernameOrEmailOrTrainerId("coachmark", "other@gym.com", "OTHER")).isTrue();
        assertThat(trainerRepository.existsByUsernameOrEmailOrTrainerId("other", "mark@gym.com", "OTHER")).isTrue();
        assertThat(trainerRepository.existsByUsernameOrEmailOrTrainerId("other", "other@gym.com", "TRN001")).isTrue();
        assertThat(trainerRepository.existsByUsernameOrEmailOrTrainerId("other", "other@gym.com", "OTHER")).isFalse();
    }

    @Test
    @DisplayName("Duplicate email throws DataIntegrityViolationException")
    void saveDuplicateEmail_throwsException() {
        trainerRepository.save(trainer);
        Trainer duplicate = new Trainer();
        duplicate.setTrainerId("TRN002");
        duplicate.setUsername("othertrainer");
        duplicate.setPassword("pass");
        duplicate.setEmail("mark@gym.com"); // duplicate
        duplicate.setFirstName("Other");
        duplicate.setLastName("Trainer");
        duplicate.setPhone("9000000002");
        duplicate.setSpecialization("Yoga");
        assertThatThrownBy(() -> trainerRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
