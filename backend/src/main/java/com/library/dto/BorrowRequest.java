package com.library.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotNull(message = "Member ID is required")
    private Long memberId;

    private Integer loanDays = 14;

    private String notes;

    public BorrowRequest() {}

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Integer getLoanDays() {
        return (loanDays != null && loanDays > 0) ? loanDays : 14;
    }

    public void setLoanDays(Integer loanDays) {
        this.loanDays = loanDays;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
