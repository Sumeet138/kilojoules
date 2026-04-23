package com.gym.erp.service;

import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.Trainer;
import com.gym.erp.entity.enums.ClassType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.TrainerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FitnessClassServiceTest {

    @Mock
    private FitnessClassRepository classRepository;

    @Mock
    private TrainerRepository trainerRepository;

    @InjectMocks
    private FitnessClassService fitnessClassService;

    private FitnessClass fitnessClass;
    private Trainer trainer;

    @BeforeEach
    void setUp() {
        trainer = new Trainer();
        trainer.setId(1L);
        trainer.setTrainerId("TRN001");
        trainer.setFirstName("Mark");
        trainer.setLastName("Johnson");

        fitnessClass = new FitnessClass();
        fitnessClass.setId(1L);
        fitnessClass.setClassName("Morning HIIT");
        fitnessClass.setClassType(ClassType.HIIT);
        fitnessClass.setTrainer(trainer);
        fitnessClass.setScheduledDay(DayOfWeek.MONDAY);
        fitnessClass.setScheduledTime(LocalTime.of(6, 0));
        fitnessClass.setDurationMinutes(45);
        fitnessClass.setCapacity(20);
        fitnessClass.setCurrentEnrollment(0);
        fitnessClass.setActive(true);
    }

    @Test
    @DisplayName("createClass saves and returns class")
    void createClass_success() {
        when(classRepository.save(any(FitnessClass.class))).thenReturn(fitnessClass);

        FitnessClass result = fitnessClassService.createClass(fitnessClass);

        assertThat(result.getClassName()).isEqualTo("Morning HIIT");
        assertThat(result.getClassType()).isEqualTo(ClassType.HIIT);
        verify(classRepository, times(1)).save(any(FitnessClass.class));
    }

    @Test
    @DisplayName("getAllActiveClasses returns only active classes")
    void getAllActiveClasses_returnsActiveClasses() {
        when(classRepository.findByIsActiveTrue()).thenReturn(List.of(fitnessClass));

        List<FitnessClass> result = fitnessClassService.getAllActiveClasses();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isActive()).isTrue();
    }

    @Test
    @DisplayName("getClassesByTrainer returns trainer's classes")
    void getClassesByTrainer_returnsTrainerClasses() {
        when(classRepository.findByTrainerId(1L)).thenReturn(List.of(fitnessClass));

        List<FitnessClass> result = fitnessClassService.getClassesByTrainer(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTrainer().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getClassesByType filters correctly")
    void getClassesByType_filtersCorrectly() {
        when(classRepository.findByIsActiveTrueAndClassType(ClassType.YOGA)).thenReturn(List.of());
        when(classRepository.findByIsActiveTrueAndClassType(ClassType.HIIT)).thenReturn(List.of(fitnessClass));

        List<FitnessClass> hiitClasses = fitnessClassService.getClassesByType(ClassType.HIIT);
        assertThat(hiitClasses).hasSize(1);

        List<FitnessClass> yogaClasses = fitnessClassService.getClassesByType(ClassType.YOGA);
        assertThat(yogaClasses).isEmpty();
    }

    @Test
    @DisplayName("getClassById throws ResourceNotFoundException when not found")
    void getClassById_throwsResourceNotFoundException_whenNotFound() {
        when(classRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> fitnessClassService.getClassById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("updateClass updates fields correctly")
    void updateClass_updatesFieldsCorrectly() {
        FitnessClass updated = new FitnessClass();
        updated.setClassName("Evening HIIT");
        updated.setClassType(ClassType.HIIT);
        updated.setCapacity(25);
        updated.setDurationMinutes(60);

        when(classRepository.findById(1L)).thenReturn(Optional.of(fitnessClass));
        when(classRepository.save(any(FitnessClass.class))).thenReturn(fitnessClass);

        fitnessClassService.updateClass(1L, updated);

        assertThat(fitnessClass.getClassName()).isEqualTo("Evening HIIT");
        assertThat(fitnessClass.getCapacity()).isEqualTo(25);
    }
}
