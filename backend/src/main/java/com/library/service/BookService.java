package com.library.service;

import com.library.model.Book;
import com.library.model.BookStatus;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public BookService(BookRepository bookRepository, BorrowRecordRepository borrowRecordRepository) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public List<Book> getAllBooks(String query, String category) {
        if (query != null && !query.trim().isEmpty()) {
            return bookRepository.searchBooks(query.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            return bookRepository.findByCategoryIgnoreCase(category.trim());
        }
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));
    }

    @Transactional
    public Book createBook(Book book) {
        if (bookRepository.findByIsbn(book.getIsbn()).isPresent()) {
            throw new IllegalArgumentException("A book with ISBN '" + book.getIsbn() + "' already exists.");
        }
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book updatedBook) {
        Book existing = getBookById(id);

        // Check if ISBN belongs to another book
        bookRepository.findByIsbn(updatedBook.getIsbn()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new IllegalArgumentException("Another book already has ISBN: " + updatedBook.getIsbn());
            }
        });

        existing.setTitle(updatedBook.getTitle());
        existing.setAuthor(updatedBook.getAuthor());
        existing.setIsbn(updatedBook.getIsbn());
        existing.setCategory(updatedBook.getCategory());
        existing.setPublicationYear(updatedBook.getPublicationYear());
        existing.setPublisher(updatedBook.getPublisher());
        existing.setShelfLocation(updatedBook.getShelfLocation());
        existing.setCoverUrl(updatedBook.getCoverUrl());
        existing.setDescription(updatedBook.getDescription());

        // Adjust copies
        int issuedCount = existing.getTotalCopies() - existing.getAvailableCopies();
        if (updatedBook.getTotalCopies() < issuedCount) {
            throw new IllegalArgumentException("Total copies cannot be less than currently issued copies (" + issuedCount + ").");
        }
        existing.setTotalCopies(updatedBook.getTotalCopies());
        existing.setAvailableCopies(updatedBook.getTotalCopies() - issuedCount);
        existing.updateStatus();

        return bookRepository.save(existing);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = getBookById(id);
        int issuedCount = book.getTotalCopies() - book.getAvailableCopies();
        if (issuedCount > 0) {
            throw new IllegalStateException("Cannot delete book. " + issuedCount + " copies are currently borrowed.");
        }
        bookRepository.delete(book);
    }

    public List<String> getAllCategories() {
        return bookRepository.findDistinctCategories();
    }
}
