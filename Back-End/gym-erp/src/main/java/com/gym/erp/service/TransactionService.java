package com.gym.erp.service;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.Transaction;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.MemberRepository;
import com.gym.erp.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private MemberRepository memberRepository;

    public Transaction recordTransaction(Long memberId, Transaction transaction) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));
        transaction.setMember(member);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getMemberTransactions(Long memberId) {
        return transactionRepository.findByMemberIdOrderByTransactionDateDesc(memberId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
