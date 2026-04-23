package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.WorkoutHistory;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.WorkoutHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkoutHistoryServiceTest {

    @Mock
    private WorkoutHistoryRepository workoutRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private WorkoutHistoryService workoutService;

    private Member member;
    private WorkoutHistory workout;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");

        workout = new WorkoutHistory();
        workout.setId(1L);
        workout.setMember(member);
        workout.setExerciseName("Bench Press");
        workout.setSets(4);
        workout.setReps(10);
        workout.setWeightKg(60.0);
        workout.setDurationMinutes(45);
        workout.setWorkoutDate(LocalDate.now());
    }

    @Test
    @DisplayName("logWorkout saves workout successfully")
    void logWorkout_success() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(workoutRepository.save(any(WorkoutHistory.class))).thenReturn(workout);

        WorkoutHistory result = workoutService.logWorkout(1L, null, workout);

        assertThat(result.getExerciseName()).isEqualTo("Bench Press");
        verify(workoutRepository, times(1)).save(any(WorkoutHistory.class));
    }

    @Test
    @DisplayName("logWorkout throws ResourceNotFoundException when member not found")
    void logWorkout_throwsResourceNotFoundException_whenMemberNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> workoutService.logWorkout(99L, null, workout))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getMemberWorkouts returns list ordered by date desc")
    void getMemberWorkouts_returnsList() {
        when(workoutRepository.findByMemberIdOrderByWorkoutDateDesc(1L)).thenReturn(List.of(workout));

        List<WorkoutHistory> result = workoutService.getMemberWorkouts(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getExerciseName()).isEqualTo("Bench Press");
    }
}
