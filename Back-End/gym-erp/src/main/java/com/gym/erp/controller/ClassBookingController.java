package com.gym.erp.controller;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.ClassBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class ClassBookingController {

    @Autowired
    private ClassBookingService bookingService;

    @PostMapping
    public ResponseEntity<?> bookClass(
            @RequestParam Long memberId,
            @RequestParam Long classId) {
        try {
            ClassBooking booking = bookingService.bookClass(memberId, classId);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (CustomException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error booking class: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<ClassBooking> getMemberBookings(@PathVariable Long memberId) {
        return bookingService.getMemberBookings(memberId);
    }

    @GetMapping("/class/{classId}")
    public List<ClassBooking> getClassBookings(@PathVariable Long classId) {
        return bookingService.getClassBookings(classId);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            ClassBooking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/attend")
    public ResponseEntity<?> markAttended(@PathVariable Long id) {
        try {
            ClassBooking booking = bookingService.markAttended(id);
            return ResponseEntity.ok(booking);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
