package com.gym.erp.repository;

import com.gym.erp.entity.Member;
import com.gym.erp.entity.enums.Gender;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
class MemberRepositoryTest {

    @Autowired
    private MemberRepository memberRepository;

    private Member member;

    @BeforeEach
    void setUp() {
        member = new Member();
        member.setMemberId("MEM001");
        member.setUsername("johndoe");
        member.setPassword("encoded_password");
        member.setEmail("john@gym.com");
        member.setFirstName("John");
        member.setLastName("Doe");
        member.setPhone("9876543210");
        member.setDob(LocalDate.of(1995, 5, 15));
        member.setAge(29);
        member.setGender(Gender.MALE);
        member.setHeightCm(175.0);
        member.setWeightKg(75.0);
        member.setHealthConditions("None");
        member.setFitnessGoals("Weight loss");
        member.setTrainerPreference("Experienced");
    }

    @Test
    @DisplayName("Save member persists and generates ID")
    void saveMember_persistsAndGeneratesId() {
        Member saved = memberRepository.save(member);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getMemberId()).isEqualTo("MEM001");
    }

    @Test
    @DisplayName("findByEmail returns correct member")
    void findByEmail_returnsCorrectMember() {
        memberRepository.save(member);
        Optional<Member> found = memberRepository.findByEmail("john@gym.com");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("johndoe");
    }

    @Test
    @DisplayName("findByEmail returns empty for non-existent email")
    void findByEmail_returnsEmpty_whenNotFound() {
        Optional<Member> found = memberRepository.findByEmail("nonexistent@gym.com");
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("findByUsername returns correct member")
    void findByUsername_returnsCorrectMember() {
        memberRepository.save(member);
        Optional<Member> found = memberRepository.findByUsername("johndoe");
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("john@gym.com");
    }

    @Test
    @DisplayName("existsByEmail returns true for existing email")
    void existsByEmail_returnsTrue_whenExists() {
        memberRepository.save(member);
        assertThat(memberRepository.existsByEmail("john@gym.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmail returns false for missing email")
    void existsByEmail_returnsFalse_whenMissing() {
        assertThat(memberRepository.existsByEmail("missing@gym.com")).isFalse();
    }

    @Test
    @DisplayName("existsByUsernameOrEmailOrMemberId detects all duplicate types")
    void existsByUsernameOrEmailOrMemberId_detectsDuplicates() {
        memberRepository.save(member);
        assertThat(memberRepository.existsByUsernameOrEmailOrMemberId("johndoe", "other@gym.com", "OTHER")).isTrue();
        assertThat(memberRepository.existsByUsernameOrEmailOrMemberId("other", "john@gym.com", "OTHER")).isTrue();
        assertThat(memberRepository.existsByUsernameOrEmailOrMemberId("other", "other@gym.com", "MEM001")).isTrue();
        assertThat(memberRepository.existsByUsernameOrEmailOrMemberId("other", "other@gym.com", "OTHER")).isFalse();
    }

    @Test
    @DisplayName("Duplicate email throws DataIntegrityViolationException")
    void saveDuplicateEmail_throwsException() {
        memberRepository.save(member);
        Member duplicate = new Member();
        duplicate.setMemberId("MEM002");
        duplicate.setUsername("janedoe");
        duplicate.setPassword("pass");
        duplicate.setEmail("john@gym.com"); // duplicate email
        duplicate.setFirstName("Jane");
        duplicate.setLastName("Doe");
        duplicate.setPhone("9876543211");
        duplicate.setDob(LocalDate.of(1998, 3, 10));
        duplicate.setAge(26);
        duplicate.setGender(Gender.FEMALE);
        duplicate.setHeightCm(160.0);
        duplicate.setWeightKg(55.0);
        assertThatThrownBy(() -> memberRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("findByMemberId returns correct member")
    void findByMemberId_returnsCorrectMember() {
        memberRepository.save(member);
        Optional<Member> found = memberRepository.findByMemberId("MEM001");
        assertThat(found).isPresent();
    }
}
