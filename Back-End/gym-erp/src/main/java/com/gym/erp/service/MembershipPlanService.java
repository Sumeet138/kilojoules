package com.gym.erp.service;

import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MembershipPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MembershipPlanService {

    @Autowired
    private MembershipPlanRepository planRepository;

    public MembershipPlan createPlan(MembershipPlan plan) {
        return planRepository.save(plan);
    }

    public List<MembershipPlan> getAllPlans() {
        return planRepository.findAll();
    }

    public List<MembershipPlan> getAllActivePlans() {
        return planRepository.findByIsActiveTrue();
    }

    public Optional<MembershipPlan> getPlanById(Long id) {
        return planRepository.findById(id);
    }

    public MembershipPlan updatePlan(Long id, MembershipPlan updated) {
        MembershipPlan existing = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));
        existing.setPlanName(updated.getPlanName());
        existing.setPlanType(updated.getPlanType());
        existing.setPrice(updated.getPrice());
        existing.setDurationDays(updated.getDurationDays());
        existing.setDescription(updated.getDescription());
        existing.setActive(updated.isActive());
        return planRepository.save(existing);
    }

    public void deactivatePlan(Long id) {
        MembershipPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership plan not found with id: " + id));
        plan.setActive(false);
        planRepository.save(plan);
    }
}
