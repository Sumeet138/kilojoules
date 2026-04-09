package com.gym.erp.controller;

import com.gym.erp.entity.BMIRecord;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.BMIRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bmi")
public class BMIRecordController {

    @Autowired
    private BMIRecordService bmiService;

    @PostMapping
    public ResponseEntity<?> recordBMI(
            @RequestParam Long memberId,
            @RequestParam double heightCm,
            @RequestParam double weightKg,
            @RequestParam(value = "notes", required = false) String notes) {
        try {
            BMIRecord record = bmiService.recordBMI(memberId, heightCm, weightKg, notes);
            return ResponseEntity.status(HttpStatus.CREATED).body(record);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error recording BMI: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<BMIRecord> getMemberBMIHistory(@PathVariable Long memberId) {
        return bmiService.getMemberBMIHistory(memberId);
    }

    @GetMapping("/member/{memberId}/recent")
    public List<BMIRecord> getRecentBMIHistory(@PathVariable Long memberId) {
        return bmiService.getRecentBMIHistory(memberId);
    }
}
