package com.library.service;

import com.library.dto.DashboardStats;
import com.library.dto.TopBookDto;
import com.library.model.Book;
import com.library.model.LoanStatus;
import com.library.model.MemberStatus;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowService borrowService;

    public DashboardService(BookRepository bookRepository,
                            MemberRepository memberRepository,
                            BorrowRecordRepository borrowRecordRepository,
                            BorrowService borrowService) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.borrowService = borrowService;
    }

    public DashboardStats getDashboardStats() {
        borrowService.updateOverdueStatuses();

        DashboardStats stats = new DashboardStats();

        long totalBooks = bookRepository.count();
        long totalCopies = bookRepository.sumTotalCopies();
        long availableCopies = bookRepository.sumAvailableCopies();
        long issuedCopies = Math.max(0, totalCopies - availableCopies);

        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByStatus(MemberStatus.ACTIVE);

        long activeLoans = borrowRecordRepository.countByStatusIn(
                Arrays.asList(LoanStatus.BORROWED, LoanStatus.EXTENDED, LoanStatus.OVERDUE)
        );
        long overdueLoans = borrowRecordRepository.countByStatus(LoanStatus.OVERDUE);

        double unpaidFines = borrowRecordRepository.sumUnpaidFines();
        double paidFines = borrowRecordRepository.sumPaidFines();

        // Category breakdown
        List<Book> allBooks = bookRepository.findAll();
        Map<String, Long> categoryCount = allBooks.stream()
                .filter(b -> b.getCategory() != null)
                .collect(Collectors.groupingBy(Book::getCategory, Collectors.counting()));

        // Top borrowed books
        List<Object[]> rawTopBooks = borrowRecordRepository.findTopBorrowedBooksRaw();
        List<TopBookDto> topBooks = new ArrayList<>();
        for (int i = 0; i < Math.min(rawTopBooks.size(), 5); i++) {
            Object[] row = rawTopBooks.get(i);
            topBooks.add(new TopBookDto(
                    (Long) row[0],
                    (String) row[1],
                    (String) row[2],
                    (String) row[3],
                    (Long) row[4]
            ));
        }

        // Recent loans
        stats.setTotalBooks(totalBooks);
        stats.setTotalCopies(totalCopies);
        stats.setAvailableCopies(availableCopies);
        stats.setIssuedCopies(issuedCopies);
        stats.setTotalMembers(totalMembers);
        stats.setActiveMembers(activeMembers);
        stats.setActiveLoansCount(activeLoans);
        stats.setOverdueLoansCount(overdueLoans);
        stats.setTotalUnpaidFines(unpaidFines);
        stats.setTotalPaidFines(paidFines);
        stats.setCategoryBreakdown(categoryCount);
        stats.setTopBooks(topBooks);
        stats.setRecentLoans(borrowRecordRepository.findTop15ByOrderByCreatedAtDesc());

        return stats;
    }
}
