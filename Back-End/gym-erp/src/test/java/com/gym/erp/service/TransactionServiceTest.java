package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.Transaction;
import com.gym.erp.entity.enums.PaymentMethod;
import com.gym.erp.entity.enums.TransactionStatus;
import com.gym.erp.entity.enums.TransactionType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Member member;
    private Transaction transaction;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setMember(member);
        transaction.setTransactionType(TransactionType.MEMBERSHIP_FEE);
        transaction.setAmount(new BigDecimal("999.00"));
        transaction.setDescription("Monthly membership fee");
        transaction.setPaymentMethod(PaymentMethod.CARD);
        transaction.setStatus(TransactionStatus.COMPLETED);
    }

    @Test
    @DisplayName("recordTransaction saves transaction successfully")
    void recordTransaction_success() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.recordTransaction(1L, transaction);

        assertThat(result.getAmount()).isEqualTo(new BigDecimal("999.00"));
        assertThat(result.getTransactionType()).isEqualTo(TransactionType.MEMBERSHIP_FEE);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }

    @Test
    @DisplayName("recordTransaction throws ResourceNotFoundException when member not found")
    void recordTransaction_throwsResourceNotFoundException_whenMemberNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.recordTransaction(99L, transaction))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getMemberTransactions returns list ordered by date desc")
    void getMemberTransactions_returnsList() {
        when(transactionRepository.findByMemberIdOrderByTransactionDateDesc(1L))
                .thenReturn(List.of(transaction));

        List<Transaction> result = transactionService.getMemberTransactions(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount()).isEqualTo(new BigDecimal("999.00"));
    }

    @Test
    @DisplayName("getAllTransactions returns all transactions")
    void getAllTransactions_returnsAll() {
        when(transactionRepository.findAll()).thenReturn(List.of(transaction));

        List<Transaction> result = transactionService.getAllTransactions();

        assertThat(result).hasSize(1);
    }
}
