import React from 'react';
import { X, Users, Mail, Phone, Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function MemberDetailModal({
  isOpen,
  onClose,
  member,
  loans = [],
  onReturnBook,
}) {
  if (!isOpen || !member) return null;

  const memberLoans = loans.filter((l) => l.member?.id === member.id);
  const activeLoans = memberLoans.filter((l) => l.status !== 'RETURNED');
  const pastLoans = memberLoans.filter((l) => l.status === 'RETURNED');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--primary)" />
            <h3>Patron Membership Record</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Patron Header */}
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
            <img
              src={
                member.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=6366f1&color=fff`
              }
              alt={member.fullName}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-medium)',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{member.fullName}</h3>
                <span
                  className={`badge ${
                    member.membershipType === 'FACULTY'
                      ? 'badge-primary'
                      : member.membershipType === 'VIP'
                      ? 'badge-warning'
                      : 'badge-cyan'
                  }`}
                >
                  {member.membershipType}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                Card ID: {member.membershipNumber}
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-input)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.82rem',
              marginBottom: '20px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Email: </span>
              <strong>{member.email}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Phone: </span>
              <span>{member.phone || 'N/A'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Joined: </span>
              <span>{member.registeredDate || '2026-01-01'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)' }}>Borrowing Limit: </span>
              <strong>{member.maxBooksAllowed} Books</strong>
            </div>
          </div>

          {/* Active Borrowed Books */}
          <div style={{ marginBottom: '24px' }}>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Currently Checked Out ({activeLoans.length})
            </h5>
            {activeLoans.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem' }}>No active loans for this member.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeLoans.map((loan) => (
                  <div
                    key={loan.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-card-hover)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{loan.book?.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Due on: <span style={loan.status === 'OVERDUE' ? { color: 'var(--accent-rose)', fontWeight: 700 } : {}}>{loan.dueDate}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        className={`badge ${loan.status === 'OVERDUE' ? 'badge-danger' : 'badge-primary'}`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {loan.status}
                      </span>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          onClose();
                          onReturnBook(loan);
                        }}
                      >
                        <CheckCircle size={13} /> Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Loans History */}
          <div>
            <h5 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Borrowing History ({pastLoans.length} Returned)
            </h5>
            {pastLoans.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.84rem' }}>No past loan history.</div>
            ) : (
              <div className="table-container" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Borrow Date</th>
                      <th>Return Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastLoans.map((l) => (
                      <tr key={l.id}>
                        <td>{l.book?.title}</td>
                        <td>{l.borrowDate}</td>
                        <td>{l.returnDate}</td>
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
