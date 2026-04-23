package com.gym.erp.service;

import com.gym.erp.entity.Trainer;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.payload.LoginRequest;
import com.gym.erp.payload.TrainerDTO;
import com.gym.erp.repository.TrainerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrainerServiceTest {

    @Mock
    private TrainerRepository trainerRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private TrainerService trainerService;

    private Trainer trainer;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setId(1L);
        trainer.setTrainerId("TRN001");
        trainer.setUsername("coachmark");
        trainer.setPassword("rawpass");
        trainer.setEmail("mark@gym.com");
        trainer.setFirstName("Mark");
        trainer.setLastName("Johnson");
        trainer.setPhone("9000000001");
        trainer.setSpecialization("HIIT");
    }

    @Test
    @DisplayName("registerTrainer saves successfully when no duplicates")
    void registerTrainer_success() {
        when(trainerRepository.existsByUsernameOrEmailOrTrainerId(anyString(), anyString(), anyString()))
                .thenReturn(false);
        when(trainerRepository.save(any(Trainer.class))).thenReturn(trainer);

        Trainer result = trainerService.registerTrainer(trainer);

        assertThat(result.getTrainerId()).isEqualTo("TRN001");
        verify(trainerRepository, times(1)).save(any(Trainer.class));
    }

    @Test
    @DisplayName("registerTrainer throws CustomException on duplicate")
    void registerTrainer_throwsCustomException_onDuplicate() {
        when(trainerRepository.existsByUsernameOrEmailOrTrainerId(anyString(), anyString(), anyString()))
                .thenReturn(true);

        assertThatThrownBy(() -> trainerService.registerTrainer(trainer))
                .isInstanceOf(CustomException.class);

        verify(trainerRepository, never()).save(any());
    }

    @Test
    @DisplayName("findAll returns list of TrainerDTOs")
    void findAll_returnsListOfDTOs() {
        when(trainerRepository.findAll()).thenReturn(List.of(trainer));

        List<TrainerDTO> result = trainerService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("mark@gym.com");
    }

    @Test
    @DisplayName("authenticateTrainer returns trainer on correct credentials")
    void authenticateTrainer_success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("coachmark");
        request.setPassword("rawpass");

        when(trainerRepository.findByUsername("coachmark")).thenReturn(Optional.of(trainer));

        Trainer result = trainerService.authenticateTrainer(request);

        assertThat(result.getEmail()).isEqualTo("mark@gym.com");
    }

    @Test
    @DisplayName("authenticateTrainer throws CustomException on wrong password")
    void authenticateTrainer_throwsCustomException_onWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("coachmark");
        request.setPassword("wrong");

        when(trainerRepository.findByUsername("coachmark")).thenReturn(Optional.of(trainer));

        assertThatThrownBy(() -> trainerService.authenticateTrainer(request))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    @DisplayName("getTrainerById returns empty when not found")
    void getTrainerById_returnsEmpty_whenNotFound() {
        when(trainerRepository.findById(99L)).thenReturn(Optional.empty());
        assertThat(trainerService.getTrainerById(99L)).isEmpty();
    }
}
