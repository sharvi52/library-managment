package com.library.service;

import com.library.dto.BorrowRequest;
import com.library.dto.ReturnRequest;
import com.library.model.*;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    private static final double DAILY_FINE_RATE = 1.0; // $1.00 per day overdue

    public BorrowService(BorrowRecordRepository borrowRecordRepository,
                         BookRepository bookRepository,
                         MemberRepository memberRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public BorrowRecord checkoutBook(BorrowRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + request.getBookId()));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + request.getMemberId()));

        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new IllegalStateException("Member account is " + member.getStatus() + ". Only ACTIVE members can borrow books.");
        }

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("Book '" + book.getTitle() + "' is currently out of stock.");
        }

        if (member.getActiveLoansCount() >= member.getMaxBooksAllowed()) {
            throw new IllegalStateException("Member has reached maximum borrowing limit of " + member.getMaxBooksAllowed() + " books.");
        }

        // Deduct available copy
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Increment member active loan count
        member.setActiveLoansCount(member.getActiveLoansCount() + 1);
        memberRepository.save(member);

        // Create record
        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(request.getLoanDays());

        BorrowRecord record = new BorrowRecord(book, member, today, due);
        record.setNotes(request.getNotes());
        record.setStatus(LoanStatus.BORROWED);

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(Long recordId, ReturnRequest request) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Loan record not found with ID: " + recordId));

        if (record.getStatus() == LoanStatus.RETURNED) {
            throw new IllegalStateException("This book has already been marked as returned.");
        }

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);

        // Fine calculation
        if (today.isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate(), today);
            double fine = daysOverdue * DAILY_FINE_RATE;
            record.setFineAmount(fine);
            if (request != null && request.getWaiveFine()) {
                record.setFinePaid(true);
            } else {
                record.setFinePaid(false);
            }
        }

        if (request != null && request.getNotes() != null && !request.getNotes().isBlank()) {
            record.setNotes(record.getNotes() != null ? record.getNotes() + " | " + request.getNotes() : request.getNotes());
        }

        record.setStatus(LoanStatus.RETURNED);

        // Increment book available copy
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Decrement member active loan count
        Member member = record.getMember();
        if (member.getActiveLoansCount() > 0) {
            member.setActiveLoansCount(member.getActiveLoansCount() - 1);
            memberRepository.save(member);
        }

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord renewLoan(Long recordId, Integer extraDays) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Loan record not found with ID: " + recordId));

        if (record.getStatus() == LoanStatus.RETURNED) {
            throw new IllegalStateException("Cannot renew a book that has already been returned.");
        }

        int daysToAdd = (extraDays != null && extraDays > 0) ? extraDays : 14;
        record.setDueDate(record.getDueDate().plusDays(daysToAdd));
        record.setRenewCount(record.getRenewCount() + 1);
        record.setStatus(LoanStatus.EXTENDED);

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord payFine(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Loan record not found with ID: " + recordId));

        record.setFinePaid(true);
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public void updateOverdueStatuses() {
        LocalDate today = LocalDate.now();
        List<BorrowRecord> activeLoans = borrowRecordRepository.findOverdueRecords(
                today,
                Arrays.asList(LoanStatus.BORROWED, LoanStatus.EXTENDED)
        );

        for (BorrowRecord loan : activeLoans) {
            loan.setStatus(LoanStatus.OVERDUE);
            long daysOverdue = ChronoUnit.DAYS.between(loan.getDueDate(), today);
            loan.setFineAmount(daysOverdue * DAILY_FINE_RATE);
            borrowRecordRepository.save(loan);
        }
    }

    public List<BorrowRecord> getAllLoans(LoanStatus status, Long memberId, Long bookId) {
        updateOverdueStatuses();

        if (memberId != null) {
            return borrowRecordRepository.findByMemberId(memberId);
        }
        if (bookId != null) {
            return borrowRecordRepository.findByBookId(bookId);
        }
        if (status != null) {
            return borrowRecordRepository.findByStatus(status);
        }
        return borrowRecordRepository.findAll();
    }

    public BorrowRecord getLoanById(Long id) {
        return borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan record not found with ID: " + id));
    }
}
