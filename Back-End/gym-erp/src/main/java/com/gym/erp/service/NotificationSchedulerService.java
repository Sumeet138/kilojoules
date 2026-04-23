package com.gym.erp.service;

import com.gym.erp.entity.ClassBooking;
import com.gym.erp.entity.FitnessClass;
import com.gym.erp.entity.MemberMembership;
import com.gym.erp.entity.Notification;
import com.gym.erp.entity.enums.BookingStatus;
import com.gym.erp.entity.enums.MembershipStatus;
import com.gym.erp.entity.enums.RecipientType;
import com.gym.erp.repository.ClassBookingRepository;
import com.gym.erp.repository.FitnessClassRepository;
import com.gym.erp.repository.MemberMembershipRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class NotificationSchedulerService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ClassBookingRepository bookingRepository;

    @Autowired
    private FitnessClassRepository fitnessClassRepository;

    @Autowired
    private MemberMembershipRepository membershipRepository;

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyReminders() {
        sendClassReminders();
        sendMembershipExpiryReminders();
    }

    private void sendClassReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        DayOfWeek tomorrowDay = tomorrow.getDayOfWeek();

        // Find all classes scheduled for tomorrow
        List<FitnessClass> classesTomorrow = fitnessClassRepository.findByScheduledDay(tomorrowDay.name());

        for (FitnessClass fc : classesTomorrow) {
            if (!fc.isActive()) continue;

            // Find all approved bookings for this class
            List<ClassBooking> bookings = bookingRepository
                .findByFitnessClassIdAndStatus(fc.getId(), BookingStatus.BOOKED);

            for (ClassBooking booking : bookings) {
                // Check if we already sent a reminder for this booking today
                // (Simple check: we don't track sent reminders, so we'll send daily for demo)
                Notification notification = new Notification();
                notification.setTitle("Class Reminder ⏰");
                notification.setMessage(
                    "Reminder: Your class " + fc.getClassName() + " is tomorrow (" + 
                    tomorrowDay + " at " + fc.getScheduledTime() + "). Don't forget!"
                );
                notification.setRecipientType(RecipientType.MEMBER);
                notificationService.createNotification(notification);
            }
        }
    }

    private void sendMembershipExpiryReminders() {
        LocalDate sevenDaysFromNow = LocalDate.now().plusDays(7);

        // Find memberships expiring in exactly 7 days
        List<MemberMembership> expiringSoon = membershipRepository
            .findByEndDateAndStatus(sevenDaysFromNow, MembershipStatus.ACTIVE);

        for (MemberMembership membership : expiringSoon) {
            Notification notification = new Notification();
            notification.setTitle("Membership Expiring Soon ⚠️");
            notification.setMessage(
                "Your " + membership.getPlan().getPlanName() + " membership expires in 7 days (" + 
                membership.getEndDate() + "). Renew now to continue accessing the gym!"
            );
            notification.setRecipientType(RecipientType.MEMBER);
            notificationService.createNotification(notification);
        }
    }
}
