package com.gym.erp.controller;

import com.gym.erp.entity.Transaction;
import com.gym.erp.entity.enums.PaymentMethod;
import com.gym.erp.entity.enums.TransactionStatus;
import com.gym.erp.entity.enums.TransactionType;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> recordTransaction(
            @RequestParam Long memberId,
            @RequestParam("transactionType") String transactionType,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("paymentMethod") String paymentMethod) {
        try {
            Transaction transaction = new Transaction();
            transaction.setTransactionType(TransactionType.valueOf(transactionType.toUpperCase()));
            transaction.setAmount(amount);
            transaction.setDescription(description);
            transaction.setPaymentMethod(PaymentMethod.valueOf(paymentMethod.toUpperCase()));

            Transaction saved = transactionService.recordTransaction(memberId, transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error recording transaction: " + ex.getMessage());
        }
    }

    @GetMapping("/member/{memberId}")
    public List<Transaction> getMemberTransactions(@PathVariable Long memberId) {
        return transactionService.getMemberTransactions(memberId);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/trainer/{trainerId}")
    public List<Transaction> getTrainerTransactions(@PathVariable Long trainerId) {
        return transactionService.getTrainerTransactions(trainerId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Transaction updated = transactionService.updateTransactionStatus(id, TransactionStatus.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            transactionService.deleteTransaction(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
