package com.library.repository;

import com.library.model.Member;
import com.library.model.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByMembershipNumber(String membershipNumber);

    boolean existsByEmail(String email);

    boolean existsByMembershipNumber(String membershipNumber);

    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.membershipNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Member> searchMembers(@Param("query") String query);

    long countByStatus(MemberStatus status);
}
