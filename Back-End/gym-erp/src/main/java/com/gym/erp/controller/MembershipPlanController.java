package com.gym.erp.controller;

import com.gym.erp.entity.MembershipPlan;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.MembershipPlanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/membership-plans")
public class MembershipPlanController {

    @Autowired
    private MembershipPlanService planService;

    @PostMapping
    public ResponseEntity<?> createPlan(@Valid @RequestBody MembershipPlan plan) {
        try {
            MembershipPlan saved = planService.createPlan(plan);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating plan: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<MembershipPlan> getAllActivePlans() {
        return planService.getAllActivePlans();
    }

    @GetMapping("/all")
    public List<MembershipPlan> getAllPlans() {
        return planService.getAllPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable Long id) {
        Optional<MembershipPlan> plan = planService.getPlanById(id);
        return plan.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Long id, @Valid @RequestBody MembershipPlan plan) {
        try {
            MembershipPlan updated = planService.updatePlan(id, plan);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating plan");
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivatePlan(@PathVariable Long id) {
        try {
            planService.deactivatePlan(id);
            return ResponseEntity.ok("Plan deactivated successfully");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
