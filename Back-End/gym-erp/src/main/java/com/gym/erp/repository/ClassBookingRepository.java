package com.gym.erp.repository;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {

    List<ClassBooking> findByMemberId(Long memberId);

    List<ClassBooking> findByFitnessClassId(Long classId);

    List<ClassBooking> findByMemberIdAndStatus(Long memberId, BookingStatus status);

    boolean existsByMemberIdAndFitnessClassId(Long memberId, Long classId);
}
