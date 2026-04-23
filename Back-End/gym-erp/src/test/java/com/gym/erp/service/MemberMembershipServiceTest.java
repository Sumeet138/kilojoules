package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.MemberMembership;
import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.entity.enums.MembershipStatus;
import com.gym.erp.entity.enums.PlanType;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberMembershipRepository;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.MembershipPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberMembershipServiceTest {

    @Mock
    private MemberMembershipRepository membershipRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private MembershipPlanRepository planRepository;

    @InjectMocks
    private MemberMembershipService membershipService;

    private Member member;
    private MembershipPlan plan;
    private MemberMembership membership;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");
        member.setUsername("johndoe");
        member.setEmail("john@gym.com");

        plan = new MembershipPlan();
        plan.setId(1L);
        plan.setPlanName("Monthly Basic");
        plan.setPlanType(PlanType.MONTHLY);
        plan.setPrice(new BigDecimal("999.00"));
        plan.setDurationDays(30);
        plan.setActive(true);

        membership = new MemberMembership();
        membership.setId(1L);
        membership.setMember(member);
        membership.setPlan(plan);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusDays(30));
        membership.setStatus(MembershipStatus.ACTIVE);
    }

    @Test
    @DisplayName("subscribeToPlan creates membership with correct dates")
    void subscribeToPlan_success() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(planRepository.findById(1L)).thenReturn(Optional.of(plan));
        when(membershipRepository.save(any(MemberMembership.class))).thenReturn(membership);

        MemberMembership result = membershipService.subscribeToPlan(1L, 1L);

        assertThat(result.getMember().getMemberId()).isEqualTo("MEM001");
        assertThat(result.getPlan().getPlanName()).isEqualTo("Monthly Basic");
        verify(membershipRepository, times(1)).save(any(MemberMembership.class));
    }

    @Test
    @DisplayName("subscribeToPlan throws ResourceNotFoundException when member not found")
    void subscribeToPlan_throwsResourceNotFoundException_whenMemberNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> membershipService.subscribeToPlan(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Member");
    }

    @Test
    @DisplayName("subscribeToPlan throws ResourceNotFoundException when plan not found")
    void subscribeToPlan_throwsResourceNotFoundException_whenPlanNotFound() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(planRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> membershipService.subscribeToPlan(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("plan");
    }

    @Test
    @DisplayName("getMemberMemberships returns list of memberships")
    void getMemberMemberships_returnsList() {
        when(membershipRepository.findByMemberId(1L)).thenReturn(List.of(membership));

        List<MemberMembership> result = membershipService.getMemberMemberships(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(MembershipStatus.ACTIVE);
    }

    @Test
    @DisplayName("getActiveMembership returns active membership")
    void getActiveMembership_returnsActiveMembership() {
        when(membershipRepository.findByMemberIdAndStatus(1L, MembershipStatus.ACTIVE))
                .thenReturn(Optional.of(membership));

        Optional<MemberMembership> result = membershipService.getActiveMembership(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getStatus()).isEqualTo(MembershipStatus.ACTIVE);
    }
}
