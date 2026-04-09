package com.gym.erp.repository;

import com.gym.erp.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {

    List<DietPlan> findByMemberId(Long memberId);

    Optional<DietPlan> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);
}
