package com.gym.erp.service;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.BookingStatus;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.ClassBookingRepository;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ClassBookingService {

    @Autowired
    private ClassBookingRepository bookingRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private FitnessClassRepository classRepository;

    public ClassBooking bookClass(Long memberId, Long classId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));

        FitnessClass fitnessClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + classId));

        if (bookingRepository.existsByMemberIdAndFitnessClassId(memberId, classId)) {
            throw new CustomException("Member has already booked this class.");
        }

        if (fitnessClass.getCurrentEnrollment() >= fitnessClass.getCapacity()) {
            throw new CustomException("Class is fully booked. No spots available.");
        }

        ClassBooking booking = new ClassBooking();
        booking.setMember(member);
        booking.setFitnessClass(fitnessClass);
        booking.setStatus(BookingStatus.BOOKED);

        // Atomically increment enrollment
        fitnessClass.setCurrentEnrollment(fitnessClass.getCurrentEnrollment() + 1);
        classRepository.save(fitnessClass);

        return bookingRepository.save(booking);
    }

    public List<ClassBooking> getMemberBookings(Long memberId) {
        return bookingRepository.findByMemberId(memberId);
    }

    public List<ClassBooking> getClassBookings(Long classId) {
        return bookingRepository.findByFitnessClassId(classId);
    }

    public ClassBooking cancelBooking(Long bookingId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);

        FitnessClass fc = booking.getFitnessClass();
        if (fc.getCurrentEnrollment() > 0) {
            fc.setCurrentEnrollment(fc.getCurrentEnrollment() - 1);
            classRepository.save(fc);
        }

        return bookingRepository.save(booking);
    }

    public ClassBooking markAttended(Long bookingId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus(BookingStatus.ATTENDED);
        return bookingRepository.save(booking);
    }
}
