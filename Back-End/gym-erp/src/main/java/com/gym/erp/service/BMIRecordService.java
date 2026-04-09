package com.gym.erp.service;

import com.gym.erp.entity.BMIRecord;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.BMICategory;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.BMIRecordRepository;
import com.gym.erp.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BMIRecordService {

    @Autowired
    private BMIRecordRepository bmiRepository;

    @Autowired
    private MemberRepository memberRepository;

    public double computeBMI(double weightKg, double heightCm) {
        double heightM = heightCm / 100.0;
        return Math.round((weightKg / (heightM * heightM)) * 100.0) / 100.0;
    }

    public BMICategory categorizeBMI(double bmi) {
        if (bmi < 18.5) return BMICategory.UNDERWEIGHT;
        if (bmi < 25.0) return BMICategory.NORMAL;
        if (bmi < 30.0) return BMICategory.OVERWEIGHT;
        return BMICategory.OBESE;
    }

    public BMIRecord recordBMI(Long memberId, double heightCm, double weightKg, String notes) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + memberId));

        double bmi = computeBMI(weightKg, heightCm);
        BMICategory category = categorizeBMI(bmi);

        BMIRecord record = new BMIRecord();
        record.setMember(member);
        record.setHeightCm(heightCm);
        record.setWeightKg(weightKg);
        record.setBmi(bmi);
        record.setCategory(category);
        record.setNotes(notes);

        return bmiRepository.save(record);
    }

    public List<BMIRecord> getMemberBMIHistory(Long memberId) {
        return bmiRepository.findByMemberIdOrderByRecordDateDesc(memberId);
    }

    public List<BMIRecord> getRecentBMIHistory(Long memberId) {
        return bmiRepository.findTop5ByMemberIdOrderByRecordDateDesc(memberId);
    }
}
