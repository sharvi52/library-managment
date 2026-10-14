package com.library.service;

import com.library.model.LoanStatus;
import com.library.model.Member;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public MemberService(MemberRepository memberRepository, BorrowRecordRepository borrowRecordRepository) {
        this.memberRepository = memberRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public List<Member> getAllMembers(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return memberRepository.searchMembers(query.trim());
        }
        return memberRepository.findAll();
    }

    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
    }

    @Transactional
    public Member createMember(Member member) {
        if (memberRepository.existsByEmail(member.getEmail())) {
            throw new IllegalArgumentException("A member with email '" + member.getEmail() + "' already exists.");
        }
        if (member.getMembershipNumber() != null && !member.getMembershipNumber().isBlank()) {
            if (memberRepository.existsByMembershipNumber(member.getMembershipNumber())) {
                throw new IllegalArgumentException("Membership number '" + member.getMembershipNumber() + "' is already in use.");
            }
        } else {
            member.setMembershipNumber("LIB-" + (1000 + (long)(Math.random() * 9000)));
        }
        return memberRepository.save(member);
    }

    @Transactional
    public Member updateMember(Long id, Member updated) {
        Member existing = getMemberById(id);

        memberRepository.findByEmail(updated.getEmail()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new IllegalArgumentException("Email '" + updated.getEmail() + "' is already registered to another member.");
            }
        });

        existing.setFullName(updated.getFullName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setMembershipType(updated.getMembershipType());
        existing.setStatus(updated.getStatus());
        existing.setMaxBooksAllowed(updated.getMaxBooksAllowed());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setAvatarUrl(updated.getAvatarUrl());

        return memberRepository.save(existing);
    }

    @Transactional
    public void deleteMember(Long id) {
        Member member = getMemberById(id);
        long activeLoans = borrowRecordRepository.findActiveByMemberId(id, Arrays.asList(LoanStatus.BORROWED, LoanStatus.OVERDUE, LoanStatus.EXTENDED)).size();
        if (activeLoans > 0) {
            throw new IllegalStateException("Cannot delete member. Member currently has " + activeLoans + " active book loan(s).");
        }
        memberRepository.delete(member);
    }
}
