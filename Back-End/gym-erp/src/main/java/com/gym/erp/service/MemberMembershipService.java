package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.MemberMembership;
import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.entity.Notification;
import com.gym.erp.entity.enums.MembershipStatus;
import com.gym.erp.entity.enums.RecipientType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberMembershipRepository;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.MembershipPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MemberMembershipService {

    @Autowired
    private MemberMembershipRepository membershipRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MembershipPlanRepository planRepository;

    @Autowired
    private NotificationService notificationService;

    public MemberMembership subscribeToPlan(Long memberId, Long planId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
        MembershipPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + planId));

        MemberMembership membership = new MemberMembership();
        membership.setMember(member);
        membership.setPlan(plan);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusDays(plan.getDurationDays()));
        membership.setStatus(MembershipStatus.ACTIVE);

        MemberMembership saved = membershipRepository.save(membership);

        // Notify admin about new membership subscription
        Notification notification = new Notification();
        notification.setTitle("New Membership Subscription");
        notification.setMessage(member.getFirstName() + " " + member.getLastName() + " has subscribed to " + plan.getPlanName() + " (₹" + plan.getPrice() + ").");
        notification.setRecipientType(RecipientType.ADMIN);
        notificationService.createNotification(notification);

        return saved;
    }

    public List<MemberMembership> getMemberMemberships(Long memberId) {
        return membershipRepository.findByMemberId(memberId);
    }

    public Optional<MemberMembership> getActiveMembership(Long memberId) {
        return membershipRepository.findByMemberIdAndStatus(memberId, MembershipStatus.ACTIVE);
    }

    public MemberMembership cancelMembership(Long membershipId) {
        MemberMembership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found with id: " + membershipId));
        membership.setStatus(MembershipStatus.CANCELLED);
        return membershipRepository.save(membership);
    }
}
