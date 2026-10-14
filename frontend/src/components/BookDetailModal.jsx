import React from 'react';
import { X, BookOpen, MapPin, Calendar, Layers, Share2, Tag } from 'lucide-react';

export default function BookDetailModal({
  isOpen,
  onClose,
  book,
  loans = [],
  onQuickIssue,
}) {
  if (!isOpen || !book) return null;

  const bookLoans = loans.filter((l) => l.book?.id === book.id);
  const isInStock = book.availableCopies > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--primary)" />
            <h3>Book Catalog Details</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top section: Cover + Info */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
            <img
              src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'}
              alt={book.title}
              style={{
                width: '130px',
                height: '190px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                flexShrink: 0,
                boxShadow: 'var(--shadow-card)',
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple">{book.category}</span>
                <span className={`badge ${isInStock ? 'badge-success' : 'badge-danger'}`}>
                  {isInStock ? `${book.availableCopies}/${book.totalCopies} Available` : 'Out of Stock'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>{book.title}</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                by <strong>{book.author}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>ISBN: </span>
                  <code style={{ fontSize: '0.8rem' }}>{book.isbn}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Publisher: </span>
                  <span>{book.publisher || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Year: </span>
                  <span>{book.publicationYear || 'N/A'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Location: </span>
                  <strong>{book.shelfLocation || 'Main Stacks'}</strong>
                </div>
              </div>

              {isInStock && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onClose();
                      onQuickIssue(book);
                    }}
                  >
                    <Share2 size={14} /> Issue This Title
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Synopsis */}
          {book.description && (
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Description & Synopsis
              </h5>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6', backgroundColor: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                {book.description}
              </p>
            </div>
          )}

          {/* Circulation History */}
          <div>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Circulation History ({bookLoans.length} Records)
            </h5>
            {bookLoans.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem' }}>No loans on record for this title.</div>
            ) : (
              <div className="table-container" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patron</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookLoans.map((l) => (
                      <tr key={l.id}>
                        <td>{l.member?.fullName}</td>
                        <td>{l.borrowDate}</td>
                        <td>{l.dueDate}</td>
                        <td>
                          <span
                            className={`badge ${
                              l.status === 'BORROWED'
                                ? 'badge-primary'
                                : l.status === 'EXTENDED'
                                ? 'badge-cyan'
                                : l.status === 'OVERDUE'
                                ? 'badge-danger'
                                : 'badge-success'
                            }`}
                            style={{ fontSize: '0.65rem' }}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
