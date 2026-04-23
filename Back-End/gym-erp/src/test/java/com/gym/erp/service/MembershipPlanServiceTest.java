package com.gym.erp.service;

import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.entity.enums.PlanType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MembershipPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MembershipPlanServiceTest {

    @Mock
    private MembershipPlanRepository planRepository;

    @InjectMocks
    private MembershipPlanService planService;

    private MembershipPlan plan;

    @BeforeEach
    void setUp() {
        plan = new MembershipPlan();
        plan.setId(1L);
        plan.setPlanName("Monthly Basic");
        plan.setPlanType(PlanType.MONTHLY);
        plan.setPrice(new BigDecimal("999.00"));
        plan.setDurationDays(30);
        plan.setActive(true);
    }

    @Test
    @DisplayName("createPlan saves and returns plan")
    void createPlan_success() {
        when(planRepository.save(any(MembershipPlan.class))).thenReturn(plan);

        MembershipPlan result = planService.createPlan(plan);

        assertThat(result.getPlanName()).isEqualTo("Monthly Basic");
        verify(planRepository, times(1)).save(any(MembershipPlan.class));
    }

    @Test
    @DisplayName("getAllActivePlans returns only active plans")
    void getAllActivePlans_returnsActivePlans() {
        when(planRepository.findByIsActiveTrue()).thenReturn(List.of(plan));

        List<MembershipPlan> result = planService.getAllActivePlans();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isActive()).isTrue();
    }

    @Test
    @DisplayName("getAllPlans returns all plans")
    void getAllPlans_returnsAllPlans() {
        when(planRepository.findAll()).thenReturn(List.of(plan));

        List<MembershipPlan> result = planService.getAllPlans();

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("updatePlan throws ResourceNotFoundException when not found")
    void updatePlan_throwsResourceNotFoundException_whenNotFound() {
        when(planRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> planService.updatePlan(99L, plan))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("deactivatePlan sets isActive to false")
    void deactivatePlan_setsIsActiveFalse() {
        when(planRepository.findById(1L)).thenReturn(Optional.of(plan));
        when(planRepository.save(any(MembershipPlan.class))).thenReturn(plan);

        planService.deactivatePlan(1L);

        assertThat(plan.isActive()).isFalse();
        verify(planRepository, times(1)).save(plan);
    }
}
