package com.gym.erp.service;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.Notification;
import com.gym.erp.entity.Transaction;
import com.gym.erp.entity.enums.BookingStatus;
import com.gym.erp.entity.enums.PaymentMethod;
import com.gym.erp.entity.enums.RecipientType;
import com.gym.erp.entity.enums.TransactionStatus;
import com.gym.erp.entity.enums.TransactionType;
import com.gym.erp.exception.CustomException;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.ClassBookingRepository;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private NotificationService notificationService;

    private void notify(RecipientType role, String title, String message) {
        Notification n = new Notification();
        n.setTitle(title);
        n.setMessage(message);
        n.setRecipientType(role);
        notificationService.createNotification(n);
    }

    public ClassBooking bookClass(Long memberId, Long classId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));

        FitnessClass fitnessClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with id: " + classId));

        LocalDate today = LocalDate.now();
        if (bookingRepository.existsByMemberIdAndFitnessClassIdAndBookingDate(memberId, classId, today)) {
            throw new CustomException("Member has already booked this class for today.");
        }

        if (fitnessClass.getCurrentEnrollment() >= fitnessClass.getCapacity()) {
            throw new CustomException("Class is fully booked. No spots available.");
        }

        ClassBooking booking = new ClassBooking();
        booking.setMember(member);
        booking.setFitnessClass(fitnessClass);
        booking.setStatus(BookingStatus.PENDING_APPROVAL);

        ClassBooking saved = bookingRepository.save(booking);

        String memberName = member.getFirstName() + " " + member.getLastName();
        notify(RecipientType.ADMIN,
                "New Booking Request",
                memberName + " has requested to book " + fitnessClass.getClassName() +
                " (" + fitnessClass.getScheduledDay() + " " + fitnessClass.getScheduledTime() + "). Please approve or reject.");

        return saved;
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

    public ClassBooking approveBooking(Long bookingId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        if (booking.getStatus() != BookingStatus.PENDING_APPROVAL) {
            throw new CustomException("Booking is not pending approval.");
        }
        booking.setStatus(BookingStatus.BOOKED);

        FitnessClass fc = booking.getFitnessClass();
        fc.setCurrentEnrollment(fc.getCurrentEnrollment() + 1);
        classRepository.save(fc);

        Member member = booking.getMember();
        Transaction tx = new Transaction();
        tx.setMember(member);
        tx.setTransactionType(TransactionType.PERSONAL_TRAINER);
        tx.setAmount(fc.getPrice() != null ? fc.getPrice() : java.math.BigDecimal.valueOf(500));
        tx.setPaymentMethod(PaymentMethod.CASH);
        tx.setStatus(TransactionStatus.PENDING);
        tx.setDescription("Class booking: " + fc.getClassName());
        transactionRepository.save(tx);

        String memberName = member.getFirstName() + " " + member.getLastName();
        notify(RecipientType.MEMBER,
                "Booking Approved ✅",
                "Your booking for " + fc.getClassName() + " (" + fc.getScheduledDay() + " " + fc.getScheduledTime() + ") has been approved!");
        if (fc.getTrainer() != null) {
            notify(RecipientType.TRAINER,
                    "New Member Enrolled",
                    memberName + " has been approved for " + fc.getClassName() + ".");
        }

        return bookingRepository.save(booking);
    }

    public ClassBooking rejectBooking(Long bookingId, String reason) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        if (booking.getStatus() != BookingStatus.PENDING_APPROVAL) {
            throw new CustomException("Booking is not pending approval.");
        }
        booking.setStatus(BookingStatus.CANCELLED);

        FitnessClass fc = booking.getFitnessClass();
        String note = (reason != null && !reason.isBlank()) ? " Reason: " + reason : "";
        notify(RecipientType.MEMBER,
                "Booking Rejected",
                "Your booking for " + fc.getClassName() + " was not approved." + note);

        return bookingRepository.save(booking);
    }

    public List<ClassBooking> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING_APPROVAL);
    }

    public ClassBooking markAttended(Long bookingId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus(BookingStatus.ATTENDED);
        return bookingRepository.save(booking);
    }

    public ClassBooking markNoShow(Long bookingId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        booking.setStatus(BookingStatus.NO_SHOW);
        return bookingRepository.save(booking);
    }

    public List<ClassBooking> getClassBookingsByDate(Long classId, LocalDate date) {
        if (date != null) {
            return bookingRepository.findByFitnessClassIdAndBookingDateAndStatusNot(classId, date, BookingStatus.PENDING_APPROVAL);
        }
        return bookingRepository.findByFitnessClassIdAndStatusNot(classId, BookingStatus.PENDING_APPROVAL);
    }
}
