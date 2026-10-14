package com.library.config;

import com.library.model.*;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public DataSeeder(BookRepository bookRepository,
                      MemberRepository memberRepository,
                      BorrowRecordRepository borrowRecordRepository) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println("🌱 Seeding realistic Library Management System data...");

        // 1. Seed Books
        List<Book> books = new ArrayList<>();

        books.add(new Book(
                "Clean Code: A Handbook of Agile Software Craftsmanship",
                "Robert C. Martin",
                "978-0132350884",
                "Computer Science",
                2008,
                "Prentice Hall",
                5,
                4,
                "Aisle 2, Shelf CS-101",
                "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
                "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours are lost because of poorly written code."
        ));

        books.add(new Book(
                "Designing Data-Intensive Applications",
                "Martin Kleppmann",
                "978-1449373320",
                "Computer Science",
                2017,
                "O'Reilly Media",
                4,
                3,
                "Aisle 2, Shelf CS-104",
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                "Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability."
        ));

        books.add(new Book(
                "The Pragmatic Programmer: Your Journey To Mastery",
                "David Thomas, Andrew Hunt",
                "978-0135957059",
                "Computer Science",
                2019,
                "Addison-Wesley",
                6,
                5,
                "Aisle 2, Shelf CS-108",
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
                "Straight through the core of programming wisdom: the classic guide on software engineering craft, architectural thinking, and pragmatic continuous improvement."
        ));

        books.add(new Book(
                "To Kill a Mockingbird",
                "Harper Lee",
                "978-0060935467",
                "Fiction",
                1960,
                "J. B. Lippincott & Co.",
                4,
                3,
                "Aisle 1, Shelf FIC-201",
                "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
                "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice."
        ));

        books.add(new Book(
                "1984",
                "George Orwell",
                "978-0451524935",
                "Fiction",
                1949,
                "Secker & Warburg",
                5,
                4,
                "Aisle 1, Shelf FIC-205",
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
                "Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With every lie he writes, he grows to hate the Party that seeks power for its own sake."
        ));

        books.add(new Book(
                "Sapiens: A Brief History of Humankind",
                "Yuval Noah Harari",
                "978-0062316097",
                "History",
                2014,
                "Harper",
                4,
                2,
                "Aisle 3, Shelf HIST-01",
                "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
                "100,000 years ago, at least six human species inhabited the earth. Today there is just one: Homo sapiens. What happened to the others? And what may happen to us?"
        ));

        books.add(new Book(
                "Cosmos",
                "Carl Sagan",
                "978-0345539434",
                "Science",
                1980,
                "Random House",
                3,
                2,
                "Aisle 4, Shelf SCI-303",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                "Cosmos retraces the fourteen billion years of cosmic evolution that have transformed matter into consciousness, exploring science, civilization, and our place in the universe."
        ));

        books.add(new Book(
                "Meditations",
                "Marcus Aurelius",
                "978-0140449334",
                "Philosophy",
                2006,
                "Penguin Classics",
                4,
                4,
                "Aisle 5, Shelf PHIL-12",
                "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
                "A series of personal spiritual reflections and exercise in Stoic philosophy by the Roman Emperor Marcus Aurelius."
        ));

        books.add(new Book(
                "Steve Jobs",
                "Walter Isaacson",
                "978-1451648539",
                "Biography",
                2011,
                "Simon & Schuster",
                3,
                3,
                "Aisle 6, Shelf BIO-44",
                "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
                "Based on more than forty interviews with Steve Jobs conducted over two years, an unvarnished biography of an extraordinary Silicon Valley visionary."
        ));

        books.add(new Book(
                "The Design of Everyday Things",
                "Don Norman",
                "978-0465050659",
                "Arts & Design",
                2013,
                "Basic Books",
                3,
                2,
                "Aisle 7, Shelf DES-09",
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
                "Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on, or whether to push, pull, or slide a door."
        ));

        books = bookRepository.saveAll(books);

        // 2. Seed Members
        List<Member> members = new ArrayList<>();

        members.add(new Member(
                "LIB-1001",
                "Dr. Eleanor Vance",
                "eleanor.vance@university.edu",
                "+1 (555) 234-5678",
                MembershipType.FACULTY,
                10,
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
        ));

        members.add(new Member(
                "LIB-1002",
                "Alexander Hayes",
                "alex.hayes@student.edu",
                "+1 (555) 345-6789",
                MembershipType.STUDENT,
                5,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
        ));

        members.add(new Member(
                "LIB-1003",
                "Sophia Patel",
                "sophia.patel@student.edu",
                "+1 (555) 456-7890",
                MembershipType.STUDENT,
                5,
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
        ));

        members.add(new Member(
                "LIB-1004",
                "Marcus Miller",
                "marcus.m@readingsociety.org",
                "+1 (555) 567-8901",
                MembershipType.GENERAL,
                4,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        ));

        members.add(new Member(
                "LIB-1005",
                "Elena Rostova",
                "elena.r@luxurymedia.com",
                "+1 (555) 678-9012",
                MembershipType.VIP,
                15,
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
        ));

        members = memberRepository.saveAll(members);

        // 3. Seed Realistic Loans
        LocalDate today = LocalDate.now();

        // Loan 1: Active Clean Loan
        BorrowRecord loan1 = new BorrowRecord(books.get(0), members.get(1), today.minusDays(5), today.plusDays(9));
        loan1.setStatus(LoanStatus.BORROWED);
        loan1.setNotes("Semester coursework preparation");
        borrowRecordRepository.save(loan1);

        // Loan 2: Active Clean Loan
        BorrowRecord loan2 = new BorrowRecord(books.get(1), members.get(0), today.minusDays(8), today.plusDays(6));
        loan2.setStatus(LoanStatus.BORROWED);
        loan2.setNotes("Department research reference");
        borrowRecordRepository.save(loan2);

        // Loan 3: OVERDUE Loan (Demonstrates fine tracking!)
        BorrowRecord loan3 = new BorrowRecord(books.get(5), members.get(2), today.minusDays(20), today.minusDays(6));
        loan3.setStatus(LoanStatus.OVERDUE);
        loan3.setFineAmount(6.00); // 6 days overdue @ $1.00/day
        loan3.setFinePaid(false);
        loan3.setNotes("First reminder email dispatched");
        borrowRecordRepository.save(loan3);

        // Loan 4: Another Overdue Loan
        BorrowRecord loan4 = new BorrowRecord(books.get(6), members.get(3), today.minusDays(18), today.minusDays(4));
        loan4.setStatus(LoanStatus.OVERDUE);
        loan4.setFineAmount(4.00); // 4 days overdue
        loan4.setFinePaid(false);
        loan4.setNotes("Astronomy club project");
        borrowRecordRepository.save(loan4);

        // Loan 5: Active Extended Loan
        BorrowRecord loan5 = new BorrowRecord(books.get(2), members.get(4), today.minusDays(12), today.plusDays(16));
        loan5.setStatus(LoanStatus.EXTENDED);
        loan5.setRenewCount(1);
        loan5.setNotes("Renewed online via patron self-service");
        borrowRecordRepository.save(loan5);

        // Loan 6: Active Loan
        BorrowRecord loan6 = new BorrowRecord(books.get(3), members.get(1), today.minusDays(3), today.plusDays(11));
        loan6.setStatus(LoanStatus.BORROWED);
        borrowRecordRepository.save(loan6);

        // Loan 7: Past Returned Loan
        BorrowRecord loan7 = new BorrowRecord(books.get(4), members.get(0), today.minusDays(40), today.minusDays(26));
        loan7.setReturnDate(today.minusDays(27));
        loan7.setStatus(LoanStatus.RETURNED);
        loan7.setFineAmount(0.0);
        loan7.setNotes("Returned in pristine condition");
        borrowRecordRepository.save(loan7);

        // Update active loan counts for members
        members.get(0).setActiveLoansCount(1);
        members.get(1).setActiveLoansCount(2);
        members.get(2).setActiveLoansCount(1);
        members.get(3).setActiveLoansCount(1);
        members.get(4).setActiveLoansCount(1);
        memberRepository.saveAll(members);

        System.out.println("✅ Data Seeding complete! 10 books, 5 members, 7 loan transactions ready.");
    }
}
