package com.gym.erp.repository;

import com.gym.erp.entity.Notification;
import com.gym.erp.entity.enums.RecipientType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientTypeOrderByCreatedAtDesc(RecipientType recipientType);

    @Query("SELECT n FROM Notification n WHERE n.recipientType = :type OR n.recipientType = 'ALL' ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientTypeOrAll(RecipientType type);

    List<Notification> findByIsReadFalseAndRecipientType(RecipientType recipientType);
}
