package com.library.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String membershipNumber;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MembershipType membershipType = MembershipType.GENERAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status = MemberStatus.ACTIVE;

    @NotNull
    private Integer maxBooksAllowed = 5;

    private Integer activeLoansCount = 0;

    private LocalDate registeredDate;

    private LocalDate expiryDate;

    private String avatarUrl;

    public Member() {}

    public Member(String membershipNumber, String fullName, String email, String phone,
                  MembershipType membershipType, Integer maxBooksAllowed, String avatarUrl) {
        this.membershipNumber = membershipNumber;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.membershipType = membershipType;
        this.maxBooksAllowed = (maxBooksAllowed != null) ? maxBooksAllowed : 5;
        this.avatarUrl = avatarUrl;
        this.status = MemberStatus.ACTIVE;
        this.activeLoansCount = 0;
    }

    @PrePersist
    protected void onCreate() {
        if (this.registeredDate == null) {
            this.registeredDate = LocalDate.now();
        }
        if (this.expiryDate == null) {
            this.expiryDate = this.registeredDate.plusYears(1);
        }
        if (this.activeLoansCount == null) {
            this.activeLoansCount = 0;
        }
        if (this.membershipNumber == null || this.membershipNumber.isBlank()) {
            this.membershipNumber = "LIB-" + System.currentTimeMillis() % 1000000;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMembershipNumber() {
        return membershipNumber;
    }

    public void setMembershipNumber(String membershipNumber) {
        this.membershipNumber = membershipNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public MembershipType getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(MembershipType membershipType) {
        this.membershipType = membershipType;
    }

    public MemberStatus getStatus() {
        return status;
    }

    public void setStatus(MemberStatus status) {
        this.status = status;
    }

    public Integer getMaxBooksAllowed() {
        return maxBooksAllowed;
    }

    public void setMaxBooksAllowed(Integer maxBooksAllowed) {
        this.maxBooksAllowed = maxBooksAllowed;
    }

    public Integer getActiveLoansCount() {
        return activeLoansCount;
    }

    public void setActiveLoansCount(Integer activeLoansCount) {
        this.activeLoansCount = activeLoansCount;
    }

    public LocalDate getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(LocalDate registeredDate) {
        this.registeredDate = registeredDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
