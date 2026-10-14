package com.library.repository;

import com.library.model.BorrowRecord;
import com.library.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByMemberId(Long memberId);

    List<BorrowRecord> findByBookId(Long bookId);

    List<BorrowRecord> findByStatus(LoanStatus status);

    List<BorrowRecord> findByStatusIn(List<LoanStatus> statuses);

    @Query("SELECT r FROM BorrowRecord r WHERE r.dueDate < :today AND r.status IN :statuses")
    List<BorrowRecord> findOverdueRecords(@Param("today") LocalDate today, @Param("statuses") List<LoanStatus> statuses);

    @Query("SELECT r FROM BorrowRecord r WHERE r.member.id = :memberId AND r.status IN :statuses")
    List<BorrowRecord> findActiveByMemberId(@Param("memberId") Long memberId, @Param("statuses") List<LoanStatus> statuses);

    List<BorrowRecord> findTop15ByOrderByCreatedAtDesc();

    long countByStatus(LoanStatus status);

    long countByStatusIn(List<LoanStatus> statuses);

    @Query("SELECT COALESCE(SUM(r.fineAmount), 0.0) FROM BorrowRecord r WHERE r.finePaid = false")
    double sumUnpaidFines();

    @Query("SELECT COALESCE(SUM(r.fineAmount), 0.0) FROM BorrowRecord r WHERE r.finePaid = true")
    double sumPaidFines();

    @Query("SELECT r.book.id, r.book.title, r.book.author, r.book.coverUrl, COUNT(r.id) as borrowCount " +
           "FROM BorrowRecord r GROUP BY r.book.id, r.book.title, r.book.author, r.book.coverUrl " +
           "ORDER BY borrowCount DESC")
    List<Object[]> findTopBorrowedBooksRaw();
}
