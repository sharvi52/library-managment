package com.library.controller;

import com.library.dto.BorrowRequest;
import com.library.dto.ReturnRequest;
import com.library.model.BorrowRecord;
import com.library.model.LoanStatus;
import com.library.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @GetMapping
    public ResponseEntity<List<BorrowRecord>> getAllLoans(
            @RequestParam(required = false) LoanStatus status,
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) Long bookId) {
        return ResponseEntity.ok(borrowService.getAllLoans(status, memberId, bookId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowRecord> getLoanById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.getLoanById(id));
    }

    @PostMapping
    public ResponseEntity<BorrowRecord> checkoutBook(@Valid @RequestBody BorrowRequest request) {
        return new ResponseEntity<>(borrowService.checkoutBook(request), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<BorrowRecord> returnBook(
            @PathVariable Long id,
            @RequestBody(required = false) ReturnRequest request) {
        return ResponseEntity.ok(borrowService.returnBook(id, request));
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<BorrowRecord> renewLoan(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Integer> payload) {
        Integer extraDays = (payload != null && payload.containsKey("extraDays")) ? payload.get("extraDays") : 14;
        return ResponseEntity.ok(borrowService.renewLoan(id, extraDays));
    }

    @PostMapping("/{id}/pay-fine")
    public ResponseEntity<BorrowRecord> payFine(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.payFine(id));
    }
}
