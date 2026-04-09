package com.gym.erp.repository;

import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.entity.enums.PlanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {

    List<MembershipPlan> findByIsActiveTrue();

    List<MembershipPlan> findByPlanType(PlanType planType);
}
