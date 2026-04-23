package com.gym.erp.repository;

import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.entity.enums.PlanType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class MembershipPlanRepositoryTest {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Test
    @DisplayName("Save plan persists and generates ID")
    void savePlan_persistsAndGeneratesId() {
        MembershipPlan plan = new MembershipPlan();
        plan.setPlanName("Monthly Basic");
        plan.setPlanType(PlanType.MONTHLY);
        plan.setPrice(new BigDecimal("999.00"));
        plan.setDurationDays(30);
        plan.setDescription("Basic monthly plan");
        plan.setActive(true);

        MembershipPlan saved = membershipPlanRepository.save(plan);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPlanName()).isEqualTo("Monthly Basic");
    }

    @Test
    @DisplayName("findByIsActiveTrue returns only active plans")
    void findByIsActiveTrue_returnsActivePlans() {
        MembershipPlan active = new MembershipPlan();
        active.setPlanName("Active Plan");
        active.setPlanType(PlanType.MONTHLY);
        active.setPrice(new BigDecimal("999.00"));
        active.setDurationDays(30);
        active.setActive(true);

        MembershipPlan inactive = new MembershipPlan();
        inactive.setPlanName("Inactive Plan");
        inactive.setPlanType(PlanType.ANNUAL);
        inactive.setPrice(new BigDecimal("9999.00"));
        inactive.setDurationDays(365);
        inactive.setActive(false);

        membershipPlanRepository.save(active);
        membershipPlanRepository.save(inactive);

        List<MembershipPlan> activePlans = membershipPlanRepository.findByIsActiveTrue();
        assertThat(activePlans).hasSize(1);
        assertThat(activePlans.get(0).getPlanName()).isEqualTo("Active Plan");
    }

    @Test
    @DisplayName("findByPlanType returns correct plans")
    void findByPlanType_returnsCorrectPlans() {
        MembershipPlan monthly = new MembershipPlan();
        monthly.setPlanName("Monthly Plan");
        monthly.setPlanType(PlanType.MONTHLY);
        monthly.setPrice(new BigDecimal("999.00"));
        monthly.setDurationDays(30);
        monthly.setActive(true);

        membershipPlanRepository.save(monthly);

        List<MembershipPlan> result = membershipPlanRepository.findByPlanType(PlanType.MONTHLY);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getPlanType()).isEqualTo(PlanType.MONTHLY);
    }
}
