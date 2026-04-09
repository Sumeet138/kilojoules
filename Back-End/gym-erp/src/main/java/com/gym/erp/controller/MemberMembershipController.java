package com.gym.erp.controller;

import com.gym.erp.entity.MemberMembership;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.MemberMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/memberships")
public class MemberMembershipController {

    @Autowired
    private MemberMembershipService membershipService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(
            @RequestParam Long memberId,
            @RequestParam Long planId) {
        try {
            MemberMembership membership = membershipService.subscribeToPlan(memberId, planId);
            return ResponseEntity.status(HttpStatus.CREATED).body(membership);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error subscribing: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<MemberMembership> getMemberMemberships(@PathVariable Long memberId) {
        return membershipService.getMemberMemberships(memberId);
    }

    @GetMapping("/active/{memberId}")
    public ResponseEntity<?> getActiveMembership(@PathVariable Long memberId) {
        Optional<MemberMembership> membership = membershipService.getActiveMembership(memberId);
        return membership.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMembership(@PathVariable Long id) {
        try {
            MemberMembership membership = membershipService.cancelMembership(id);
            return ResponseEntity.ok(membership);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
