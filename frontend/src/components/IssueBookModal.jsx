import React, { useState, useEffect } from 'react';
import { X, BookOpen, Users, Calendar, AlertCircle } from 'lucide-react';

export default function IssueBookModal({
  isOpen,
  onClose,
  books,
  members,
  preselectedBook,
  onIssue,
}) {
  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [loanDays, setLoanDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (preselectedBook) {
      setBookId(preselectedBook.id);
    } else {
      // Find first available book
      const firstAvail = books.find((b) => b.availableCopies > 0);
      if (firstAvail) setBookId(firstAvail.id);
    }
    if (members.length > 0 && !memberId) {
      setMemberId(members[0].id);
    }
  }, [preselectedBook, books, members]);

  if (!isOpen) return null;

  const selectedBook = books.find((b) => String(b.id) === String(bookId));
  const selectedMember = members.find((m) => String(m.id) === String(memberId));

  const isBookOutOfStock = selectedBook && selectedBook.availableCopies <= 0;
  const isMemberOverLimit =
    selectedMember &&
    (selectedMember.activeLoansCount || 0) >= (selectedMember.maxBooksAllowed || 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookId || !memberId) return;

    setSubmitting(true);
    try {
      await onIssue(Number(bookId), Number(memberId), Number(loanDays), notes);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--primary)" />
            <h3>Issue Book to Patron</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Book Selector */}
            <div className="form-group">
              <label className="form-label">Select Book Title</label>
              <select
                className="form-select"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                required
              >
                {books.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    disabled={b.availableCopies <= 0}
                  >
                    {b.title} — {b.author} ({b.availableCopies} available)
                  </option>
                ))}
              </select>
              {isBookOutOfStock && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> Selected title is currently out of stock.
                </div>
              )}
            </div>

            {/* Member Selector */}
            <div className="form-group">
              <label className="form-label">Select Patron Member</label>
              <select
                className="form-select"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.membershipNumber}) &bull; Active Loans: {m.activeLoansCount || 0}/{m.maxBooksAllowed}
                  </option>
                ))}
              </select>
              {isMemberOverLimit && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> Patron has reached maximum borrowing limit ({selectedMember?.maxBooksAllowed} books).
                </div>
              )}
            </div>

            {/* Loan Duration */}
            <div className="form-group">
              <label className="form-label">Loan Duration</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[7, 14, 21, 30].map((days) => (
                  <button
                    type="button"
                    key={days}
                    className={`btn btn-sm ${loanDays === days ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                    onClick={() => setLoanDays(days)}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Circulation Notes (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Research thesis, reserved copy, express return..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isBookOutOfStock || isMemberOverLimit || submitting}
            >
              {submitting ? 'Issuing...' : 'Confirm & Issue Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
