package com.gym.erp.controller;

import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.Trainer;
import com.gym.erp.entity.enums.ClassType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.FitnessClassService;
import com.gym.erp.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fitness-classes")
public class FitnessClassController {

    @Autowired
    private FitnessClassService classService;

    @Autowired
    private TrainerService trainerService;

    @PostMapping
    public ResponseEntity<?> createClass(
            @RequestParam("className") String className,
            @RequestParam("classType") String classType,
            @RequestParam(value = "trainerId", required = false) Long trainerId,
            @RequestParam("scheduledDay") String scheduledDay,
            @RequestParam("scheduledTime") String scheduledTime,
            @RequestParam("durationMinutes") int durationMinutes,
            @RequestParam("capacity") int capacity,
            @RequestParam(value = "description", required = false) String description) {
        try {
            FitnessClass fc = new FitnessClass();
            fc.setClassName(className);
            fc.setClassType(ClassType.valueOf(classType.toUpperCase()));
            fc.setScheduledDay(DayOfWeek.valueOf(scheduledDay.toUpperCase()));
            fc.setScheduledTime(LocalTime.parse(scheduledTime));
            fc.setDurationMinutes(durationMinutes);
            fc.setCapacity(capacity);
            fc.setDescription(description);

            if (trainerId != null) {
                Optional<Trainer> trainer = trainerService.getTrainerById(trainerId);
                trainer.ifPresent(fc::setTrainer);
            }

            FitnessClass saved = classService.createClass(fc);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating class: " + ex.getMessage());
        }
    }

    @GetMapping
    public List<FitnessClass> getAllActiveClasses(@RequestParam(value = "type", required = false) String type) {
        if (type != null) {
            return classService.getClassesByType(ClassType.valueOf(type.toUpperCase()));
        }
        return classService.getAllActiveClasses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClassById(@PathVariable Long id) {
        try {
            FitnessClass fc = classService.getClassById(id);
            return ResponseEntity.ok(fc);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/trainer/{trainerId}")
    public List<FitnessClass> getClassesByTrainer(@PathVariable Long trainerId) {
        return classService.getClassesByTrainer(trainerId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClass(
            @PathVariable Long id,
            @RequestBody FitnessClass updatedClass,
            @RequestParam(value = "trainerId", required = false) Long trainerId) {
        try {
            if (trainerId != null) {
                trainerService.getTrainerById(trainerId).ifPresent(updatedClass::setTrainer);
            }
            FitnessClass updated = classService.updateClass(id, updatedClass);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating class");
        }
    }
}
