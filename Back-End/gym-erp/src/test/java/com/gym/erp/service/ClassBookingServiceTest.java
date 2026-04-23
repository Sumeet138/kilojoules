package com.gym.erp.service;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.BookingStatus;
import com.gym.erp.entity.enums.ClassType;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.ClassBookingRepository;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClassBookingServiceTest {

    @Mock
    private ClassBookingRepository bookingRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private FitnessClassRepository classRepository;

    @InjectMocks
    private ClassBookingService bookingService;

    private Member member;
    private FitnessClass fitnessClass;
    private ClassBooking booking;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");
        member.setFirstName("John");
        member.setLastName("Doe");

        fitnessClass = new FitnessClass();
        fitnessClass.setId(1L);
        fitnessClass.setClassName("Morning HIIT");
        fitnessClass.setClassType(ClassType.HIIT);
        fitnessClass.setCapacity(20);
        fitnessClass.setCurrentEnrollment(1);
        fitnessClass.setScheduledDay(DayOfWeek.MONDAY);
        fitnessClass.setScheduledTime(LocalTime.of(6, 0));
        fitnessClass.setDurationMinutes(45);
        fitnessClass.setActive(true);

        booking = new ClassBooking();
        booking.setId(1L);
        booking.setMember(member);
        booking.setFitnessClass(fitnessClass);
        booking.setStatus(BookingStatus.BOOKED);
    }

    @Test
    @DisplayName("bookClass creates booking when class has capacity")
    void bookClass_success_whenCapacityAvailable() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(classRepository.findById(1L)).thenReturn(Optional.of(fitnessClass));
        when(bookingRepository.existsByMemberIdAndFitnessClassId(1L, 1L)).thenReturn(false);
        when(bookingRepository.save(any(ClassBooking.class))).thenReturn(booking);
        when(classRepository.save(any(FitnessClass.class))).thenReturn(fitnessClass);

        ClassBooking result = bookingService.bookClass(1L, 1L);

        assertThat(result.getStatus()).isEqualTo(BookingStatus.BOOKED);
        verify(bookingRepository, times(1)).save(any(ClassBooking.class));
        verify(classRepository, times(1)).save(any(FitnessClass.class)); // enrollment incremented
    }

    @Test
    @DisplayName("bookClass throws CustomException when class is fully booked")
    void bookClass_throwsCustomException_whenClassFull() {
        fitnessClass.setCurrentEnrollment(20); // at capacity

        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(classRepository.findById(1L)).thenReturn(Optional.of(fitnessClass));
        when(bookingRepository.existsByMemberIdAndFitnessClassId(1L, 1L)).thenReturn(false);

        assertThatThrownBy(() -> bookingService.bookClass(1L, 1L))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("fully booked");

        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("bookClass throws CustomException when member already booked this class")
    void bookClass_throwsCustomException_whenAlreadyBooked() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(classRepository.findById(1L)).thenReturn(Optional.of(fitnessClass));
        when(bookingRepository.existsByMemberIdAndFitnessClassId(1L, 1L)).thenReturn(true);

        assertThatThrownBy(() -> bookingService.bookClass(1L, 1L))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("already booked");

        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("bookClass throws ResourceNotFoundException when member not found")
    void bookClass_throwsResourceNotFoundException_whenMemberNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.bookClass(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("bookClass throws ResourceNotFoundException when class not found")
    void bookClass_throwsResourceNotFoundException_whenClassNotFound() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(classRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.bookClass(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getMemberBookings returns list of bookings for member")
    void getMemberBookings_returnsList() {
        when(bookingRepository.findByMemberId(1L)).thenReturn(List.of(booking));

        List<ClassBooking> result = bookingService.getMemberBookings(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMember().getMemberId()).isEqualTo("MEM001");
    }

    @Test
    @DisplayName("cancelBooking changes status to CANCELLED and decrements enrollment")
    void cancelBooking_changesStatusToCancelled() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(ClassBooking.class))).thenReturn(booking);
        when(classRepository.save(any(FitnessClass.class))).thenReturn(fitnessClass);

        bookingService.cancelBooking(1L);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(classRepository, times(1)).save(fitnessClass); // enrollment decremented
    }
}
