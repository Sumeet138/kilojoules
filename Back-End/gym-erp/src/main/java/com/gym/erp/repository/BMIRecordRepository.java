package com.gym.erp.repository;

import com.gym.erp.entity.BMIRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BMIRecordRepository extends JpaRepository<BMIRecord, Long> {

    List<BMIRecord> findByMemberIdOrderByRecordDateDesc(Long memberId);

    List<BMIRecord> findTop5ByMemberIdOrderByRecordDateDesc(Long memberId);
}
