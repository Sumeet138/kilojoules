package com.gym.erp.repository;

import com.gym.erp.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByUsername(String username);

    Optional<Member> findByMemberId(String memberId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMemberId(String memberId);

    boolean existsByUsernameOrEmailOrMemberId(String username, String email, String memberId);
}
