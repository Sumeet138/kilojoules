package com.gym.erp.repository;

import com.gym.erp.entity.MemberMembership;
import com.gym.erp.entity.enums.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberMembershipRepository extends JpaRepository<MemberMembership, Long> {

    List<MemberMembership> findByMemberId(Long memberId);

    Optional<MemberMembership> findByMemberIdAndStatus(Long memberId, MembershipStatus status);

    boolean existsByMemberIdAndStatus(Long memberId, MembershipStatus status);
}
