import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import DashboardView from './components/DashboardView';
import BooksView from './components/BooksView';
import MembersView from './components/MembersView';
import CirculationView from './components/CirculationView';

// Modals
import IssueBookModal from './components/IssueBookModal';
import BookModal from './components/BookModal';
import MemberModal from './components/MemberModal';
import ReturnModal from './components/ReturnModal';
import BookDetailModal from './components/BookDetailModal';
import MemberDetailModal from './components/MemberDetailModal';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'books' | 'members' | 'circulation'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [preselectedBook, setPreselectedBook] = useState(null);

  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState(null);

  const [bookDetailOpen, setBookDetailOpen] = useState(false);
  const [bookToInspect, setBookToInspect] = useState(null);

  const [memberDetailOpen, setMemberDetailOpen] = useState(false);
  const [memberToInspect, setMemberToInspect] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data Loading
  const loadAllData = useCallback(async () => {
    try {
      const [statsRes, booksRes, membersRes, loansRes, catsRes] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getBooks().catch(() => []),
        api.getMembers().catch(() => []),
        api.getLoans().catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      if (booksRes) setBooks(booksRes);
      if (membersRes) setMembers(membersRes);
      if (loansRes) setLoans(loansRes);
      if (catsRes) setCategories(catsRes);
    } catch (err) {
      addToast('Failed to load system data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Actions
  const handleIssueBook = async (bookId, memberId, loanDays, notes) => {
    try {
      await api.checkoutBook(bookId, memberId, loanDays, notes);
      addToast('Book issued successfully!', 'success');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const handleSaveBook = async (bookData, id) => {
    try {
      if (id) {
        await api.updateBook(id, bookData);
        addToast('Book details updated!', 'success');
      } else {
        await api.createBook(bookData);
        addToast('New book added to catalog!', 'success');
      }
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this title?')) return;
    try {
      await api.deleteBook(id);
      addToast('Book deleted from catalog', 'info');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSaveMember = async (memberData, id) => {
    try {
      if (id) {
        await api.updateMember(id, memberData);
        addToast('Patron profile updated!', 'success');
      } else {
        await api.createMember(memberData);
        addToast('New patron registered!', 'success');
      }
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to remove this patron member?')) return;
    try {
      await api.deleteMember(id);
      addToast('Patron profile removed', 'info');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleConfirmReturn = async (loanId, notes, waiveFine) => {
    try {
      await api.returnBook(loanId, notes, waiveFine);
      addToast('Book returned and inventory restocked!', 'success');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await api.renewLoan(loanId, 14);
      addToast('Loan renewed for 14 additional days!', 'success');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePayFine = async (loanId) => {
    try {
      await api.payFine(loanId);
      addToast('Fine payment received & recorded!', 'success');
      await loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Quick Open Modal Helpers
  const openQuickIssue = (book) => {
    setPreselectedBook(book);
    setIssueModalOpen(true);
  };

  const openBookEdit = (book) => {
    setBookToEdit(book);
    setBookModalOpen(true);
  };

  const openBookDetails = (book) => {
    setBookToInspect(book);
    setBookDetailOpen(true);
  };

  const openMemberEdit = (member) => {
    setMemberToEdit(member);
    setMemberModalOpen(true);
  };

  const openMemberDetails = (member) => {
    setMemberToInspect(member);
    setMemberDetailOpen(true);
  };

  const openReturnModal = (loan) => {
    setLoanToReturn(loan);
    setReturnModalOpen(true);
  };

  const overdueCount = loans.filter((l) => l.status === 'OVERDUE').length;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSearchQuery('');
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        overdueCount={overdueCount}
      />

      {/* Main Workspace */}
      <main className="main-content">
        <Topbar
          currentView={currentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenIssueModal={() => {
            setPreselectedBook(null);
            setIssueModalOpen(true);
          }}
          onOpenBookModal={() => {
            setBookToEdit(null);
            setBookModalOpen(true);
          }}
          onOpenMemberModal={() => {
            setMemberToEdit(null);
            setMemberModalOpen(true);
          }}
        />

        <div className="page-body">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              loading={loading}
              setCurrentView={setCurrentView}
              onOpenIssueModal={() => {
                setPreselectedBook(null);
                setIssueModalOpen(true);
              }}
              onOpenBookModal={() => {
                setBookToEdit(null);
                setBookModalOpen(true);
              }}
              onOpenMemberModal={() => {
                setMemberToEdit(null);
                setMemberModalOpen(true);
              }}
            />
          )}

          {currentView === 'books' && (
            <BooksView
              books={books}
              categories={categories}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenBookModal={() => {
                setBookToEdit(null);
                setBookModalOpen(true);
              }}
              onEditBook={openBookEdit}
              onDeleteBook={handleDeleteBook}
              onViewBookDetails={openBookDetails}
              onQuickIssue={openQuickIssue}
            />
          )}

          {currentView === 'members' && (
            <MembersView
              members={members}
              loading={loading}
              searchQuery={searchQuery}
              onOpenMemberModal={() => {
                setMemberToEdit(null);
                setMemberModalOpen(true);
              }}
              onEditMember={openMemberEdit}
              onDeleteMember={handleDeleteMember}
              onViewMemberDetails={openMemberDetails}
            />
          )}

          {currentView === 'circulation' && (
            <CirculationView
              loans={loans}
              loading={loading}
              searchQuery={searchQuery}
              onOpenIssueModal={() => {
                setPreselectedBook(null);
                setIssueModalOpen(true);
              }}
              onReturnBook={openReturnModal}
              onRenewLoan={handleRenewLoan}
              onPayFine={handlePayFine}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <IssueBookModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        books={books}
        members={members}
        preselectedBook={preselectedBook}
        onIssue={handleIssueBook}
      />

      <BookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        bookToEdit={bookToEdit}
        categories={categories}
        onSave={handleSaveBook}
      />

      <MemberModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        memberToEdit={memberToEdit}
        onSave={handleSaveMember}
      />

      <ReturnModal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        loan={loanToReturn}
        onConfirmReturn={handleConfirmReturn}
      />

      <BookDetailModal
        isOpen={bookDetailOpen}
        onClose={() => setBookDetailOpen(false)}
        book={bookToInspect}
        loans={loans}
        onQuickIssue={openQuickIssue}
      />

      <MemberDetailModal
        isOpen={memberDetailOpen}
        onClose={() => setMemberDetailOpen(false)}
        member={memberToInspect}
        loans={loans}
        onReturnBook={openReturnModal}
      />

      {/* Toast Alert Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
