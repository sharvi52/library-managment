package com.library.dto;

import com.library.model.BorrowRecord;
import java.util.List;
import java.util.Map;

public class DashboardStats {

    private long totalBooks;
    private long totalCopies;
    private long availableCopies;
    private long issuedCopies;
    private long totalMembers;
    private long activeMembers;
    private long activeLoansCount;
    private long overdueLoansCount;
    private double totalUnpaidFines;
    private double totalPaidFines;
    private Map<String, Long> categoryBreakdown;
    private List<TopBookDto> topBooks;
    private List<BorrowRecord> recentLoans;

    public DashboardStats() {}

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(long totalCopies) {
        this.totalCopies = totalCopies;
    }

    public long getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(long availableCopies) {
        this.availableCopies = availableCopies;
    }

    public long getIssuedCopies() {
        return issuedCopies;
    }

    public void setIssuedCopies(long issuedCopies) {
        this.issuedCopies = issuedCopies;
    }

    public long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(long totalMembers) {
        this.totalMembers = totalMembers;
    }

    public long getActiveMembers() {
        return activeMembers;
    }

    public void setActiveMembers(long activeMembers) {
        this.activeMembers = activeMembers;
    }

    public long getActiveLoansCount() {
        return activeLoansCount;
    }

    public void setActiveLoansCount(long activeLoansCount) {
        this.activeLoansCount = activeLoansCount;
    }

    public long getOverdueLoansCount() {
        return overdueLoansCount;
    }

    public void setOverdueLoansCount(long overdueLoansCount) {
        this.overdueLoansCount = overdueLoansCount;
    }

    public double getTotalUnpaidFines() {
        return totalUnpaidFines;
    }

    public void setTotalUnpaidFines(double totalUnpaidFines) {
        this.totalUnpaidFines = totalUnpaidFines;
    }

    public double getTotalPaidFines() {
        return totalPaidFines;
    }

    public void setTotalPaidFines(double totalPaidFines) {
        this.totalPaidFines = totalPaidFines;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<TopBookDto> getTopBooks() {
        return topBooks;
    }

    public void setTopBooks(List<TopBookDto> topBooks) {
        this.topBooks = topBooks;
    }

    public List<BorrowRecord> getRecentLoans() {
        return recentLoans;
    }

    public void setRecentLoans(List<BorrowRecord> recentLoans) {
        this.recentLoans = recentLoans;
    }
}
