package com.gym.erp.repository;

import com.gym.erp.entity.WorkoutHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutHistoryRepository extends JpaRepository<WorkoutHistory, Long> {

    List<WorkoutHistory> findByMemberIdOrderByWorkoutDateDesc(Long memberId);

    List<WorkoutHistory> findTop10ByMemberIdOrderByWorkoutDateDesc(Long memberId);
}
