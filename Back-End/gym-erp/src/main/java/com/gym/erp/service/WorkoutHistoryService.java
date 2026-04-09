package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.Trainer;
import com.gym.erp.entity.WorkoutHistory;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.TrainerRepository;
import com.gym.erp.repository.WorkoutHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkoutHistoryService {

    @Autowired
    private WorkoutHistoryRepository workoutRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired(required = false)
    private TrainerRepository trainerRepository;

    public WorkoutHistory logWorkout(Long memberId, Long trainerId, WorkoutHistory workout) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
        workout.setMember(member);

        if (trainerId != null && trainerRepository != null) {
            Optional<Trainer> trainer = trainerRepository.findById(trainerId);
            trainer.ifPresent(workout::setTrainer);
        }

        return workoutRepository.save(workout);
    }

    public List<WorkoutHistory> getMemberWorkouts(Long memberId) {
        return workoutRepository.findByMemberIdOrderByWorkoutDateDesc(memberId);
    }

    public List<WorkoutHistory> getRecentMemberWorkouts(Long memberId) {
        return workoutRepository.findTop10ByMemberIdOrderByWorkoutDateDesc(memberId);
    }

    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResourceNotFoundException("Workout not found with id: " + id);
        }
        workoutRepository.deleteById(id);
    }
}
