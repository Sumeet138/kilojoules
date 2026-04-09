package com.gym.erp.controller;

import com.gym.erp.entity.WorkoutHistory;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.WorkoutHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workout-history")
public class WorkoutHistoryController {

    @Autowired
    private WorkoutHistoryService workoutService;

    @PostMapping
    public ResponseEntity<?> logWorkout(
            @RequestParam Long memberId,
            @RequestParam(value = "trainerId", required = false) Long trainerId,
            @RequestParam("exerciseName") String exerciseName,
            @RequestParam(value = "sets", required = false) Integer sets,
            @RequestParam(value = "reps", required = false) Integer reps,
            @RequestParam(value = "weightKg", required = false) Double weightKg,
            @RequestParam(value = "durationMinutes", required = false) Integer durationMinutes,
            @RequestParam(value = "workoutDate", required = false) LocalDate workoutDate,
            @RequestParam(value = "notes", required = false) String notes) {
        try {
            WorkoutHistory workout = new WorkoutHistory();
            workout.setExerciseName(exerciseName);
            workout.setSets(sets);
            workout.setReps(reps);
            workout.setWeightKg(weightKg);
            workout.setDurationMinutes(durationMinutes);
            workout.setWorkoutDate(workoutDate != null ? workoutDate : LocalDate.now());
            workout.setNotes(notes);

            WorkoutHistory saved = workoutService.logWorkout(memberId, trainerId, workout);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error logging workout: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<WorkoutHistory> getMemberWorkouts(@PathVariable Long memberId) {
        return workoutService.getMemberWorkouts(memberId);
    }

    @GetMapping("/member/{memberId}/recent")
    public List<WorkoutHistory> getRecentWorkouts(@PathVariable Long memberId) {
        return workoutService.getRecentMemberWorkouts(memberId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id) {
        try {
            workoutService.deleteWorkout(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
