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
}
