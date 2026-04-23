package com.gym.erp.repository;

import com.gym.erp.entity.Transaction;
import com.gym.erp.entity.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByMemberIdOrderByTransactionDateDesc(Long memberId);

    List<Transaction> findByTransactionType(TransactionType type);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.member.id = :memberId")
    BigDecimal sumAmountByMemberId(Long memberId);

    @Query("SELECT t FROM Transaction t WHERE t.member.id IN " +
           "(SELECT b.member.id FROM ClassBooking b WHERE b.fitnessClass.trainer.id = :trainerId " +
           "AND b.status <> com.gym.erp.entity.enums.BookingStatus.CANCELLED) " +
           "AND t.transactionType = com.gym.erp.entity.enums.TransactionType.PERSONAL_TRAINER " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByTrainerId(@org.springframework.data.repository.query.Param("trainerId") Long trainerId);
}
