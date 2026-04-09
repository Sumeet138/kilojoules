package com.gym.erp.service;

import com.gym.erp.entity.DietPlan;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.Trainer;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.DietPlanRepository;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.TrainerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DietPlanService {

    @Autowired
    private DietPlanRepository dietPlanRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    public DietPlan createDietPlan(Long memberId, Long trainerId, DietPlan plan) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
        plan.setMember(member);

        if (trainerId != null) {
            Optional<Trainer> trainer = trainerRepository.findById(trainerId);
            trainer.ifPresent(plan::setTrainer);
        }

        return dietPlanRepository.save(plan);
    }

    public List<DietPlan> getMemberDietPlans(Long memberId) {
        return dietPlanRepository.findByMemberId(memberId);
    }

    public Optional<DietPlan> getLatestDietPlan(Long memberId) {
        return dietPlanRepository.findFirstByMemberIdOrderByCreatedAtDesc(memberId);
    }

    public DietPlan updateDietPlan(Long id, DietPlan updated) {
        DietPlan existing = dietPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diet plan not found with id: " + id));
        existing.setPlanName(updated.getPlanName());
        existing.setDescription(updated.getDescription());
        existing.setTotalCalories(updated.getTotalCalories());
        existing.setProteinGrams(updated.getProteinGrams());
        existing.setCarbsGrams(updated.getCarbsGrams());
        existing.setFatsGrams(updated.getFatsGrams());
        return dietPlanRepository.save(existing);
    }

    public void deleteDietPlan(Long id) {
        if (!dietPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Diet plan not found with id: " + id);
        }
        dietPlanRepository.deleteById(id);
    }
}
