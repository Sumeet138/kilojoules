package com.gym.erp.controller;

import com.gym.erp.entity.DietPlan;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.DietPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/diet-plans")
public class DietPlanController {

    @Autowired
    private DietPlanService dietPlanService;

    @PostMapping
    public ResponseEntity<?> createDietPlan(
            @RequestParam Long memberId,
            @RequestParam(value = "trainerId", required = false) Long trainerId,
            @RequestBody DietPlan plan) {
        try {
            DietPlan saved = dietPlanService.createDietPlan(memberId, trainerId, plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating diet plan: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<DietPlan> getMemberDietPlans(@PathVariable Long memberId) {
        return dietPlanService.getMemberDietPlans(memberId);
    }

    @GetMapping("/member/{memberId}/latest")
    public ResponseEntity<?> getLatestDietPlan(@PathVariable Long memberId) {
        Optional<DietPlan> plan = dietPlanService.getLatestDietPlan(memberId);
        return plan.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDietPlan(@PathVariable Long id, @RequestBody DietPlan plan) {
        try {
            DietPlan updated = dietPlanService.updateDietPlan(id, plan);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating diet plan");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDietPlan(@PathVariable Long id) {
        try {
            dietPlanService.deleteDietPlan(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
