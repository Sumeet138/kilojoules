package com.gym.erp.service;

import com.gym.erp.entity.BMIRecord;
import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.BMICategory;
import com.gym.erp.exception.ResourceNotFoundException;
import com.gym.erp.repository.BMIRecordRepository;
import com.gym.erp.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BMIRecordServiceTest {

    @Mock
    private BMIRecordRepository bmiRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private BMIRecordService bmiService;

    private Member member;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setId(1L);
        member.setMemberId("MEM001");
        member.setFirstName("John");
        member.setLastName("Doe");
    }

    // ===== BMI Computation Tests (Four Boundary Values) =====

    @Test
    @DisplayName("BMI < 18.5 categorized as UNDERWEIGHT")
    void computeBMICategory_underweight() {
        // height=170cm, weight=50kg => bmi = 50/(1.70^2) = 17.3
        double bmi = bmiService.computeBMI(50.0, 170.0);
        BMICategory category = bmiService.categorizeBMI(bmi);
        assertThat(bmi).isLessThan(18.5);
        assertThat(category).isEqualTo(BMICategory.UNDERWEIGHT);
    }

    @Test
    @DisplayName("BMI between 18.5 and 24.9 categorized as NORMAL")
    void computeBMICategory_normal() {
        // height=170cm, weight=68kg => bmi = 68/(1.70^2) = 23.5
        double bmi = bmiService.computeBMI(68.0, 170.0);
        BMICategory category = bmiService.categorizeBMI(bmi);
        assertThat(bmi).isBetween(18.5, 24.9);
        assertThat(category).isEqualTo(BMICategory.NORMAL);
    }

    @Test
    @DisplayName("BMI between 25.0 and 29.9 categorized as OVERWEIGHT")
    void computeBMICategory_overweight() {
        // height=170cm, weight=75kg => bmi = 75/(1.70^2) = 25.95
        double bmi = bmiService.computeBMI(75.0, 170.0);
        BMICategory category = bmiService.categorizeBMI(bmi);
        assertThat(bmi).isBetween(25.0, 29.9);
        assertThat(category).isEqualTo(BMICategory.OVERWEIGHT);
    }

    @Test
    @DisplayName("BMI >= 30.0 categorized as OBESE")
    void computeBMICategory_obese() {
        // height=170cm, weight=90kg => bmi = 90/(1.70^2) = 31.1
        double bmi = bmiService.computeBMI(90.0, 170.0);
        BMICategory category = bmiService.categorizeBMI(bmi);
        assertThat(bmi).isGreaterThanOrEqualTo(30.0);
        assertThat(category).isEqualTo(BMICategory.OBESE);
    }

    @Test
    @DisplayName("recordBMI saves record with computed BMI and category")
    void recordBMI_savesWithComputedValues() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(bmiRepository.save(any(BMIRecord.class))).thenAnswer(inv -> inv.getArgument(0));

        BMIRecord result = bmiService.recordBMI(1L, 170.0, 68.0, null);

        assertThat(result.getBmi()).isBetween(18.0, 25.0);
        assertThat(result.getCategory()).isEqualTo(BMICategory.NORMAL);
        verify(bmiRepository, times(1)).save(any(BMIRecord.class));
    }

    @Test
    @DisplayName("recordBMI throws ResourceNotFoundException when member not found")
    void recordBMI_throwsResourceNotFoundException_whenMemberNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bmiService.recordBMI(99L, 170.0, 68.0, null))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("getMemberBMIHistory returns list ordered by date desc")
    void getMemberBMIHistory_returnsList() {
        BMIRecord record = new BMIRecord();
        record.setId(1L);
        record.setMember(member);
        record.setBmi(23.5);
        record.setCategory(BMICategory.NORMAL);

        when(bmiRepository.findByMemberIdOrderByRecordDateDesc(1L)).thenReturn(List.of(record));

        List<BMIRecord> result = bmiService.getMemberBMIHistory(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategory()).isEqualTo(BMICategory.NORMAL);
    }
}
