import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReturnModal({
  isOpen,
  onClose,
  loan,
  onConfirmReturn,
}) {
  const [notes, setNotes] = useState('');
  const [waiveFine, setWaiveFine] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !loan) return null;

  const isOverdue = loan.status === 'OVERDUE' || (loan.fineAmount && loan.fineAmount > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirmReturn(loan.id, notes, waiveFine);
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
            <CheckCircle size={20} color="var(--accent-emerald)" />
            <h3>Process Book Return</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Summary Card */}
            <div
              style={{
                backgroundColor: 'var(--bg-input)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>
                {loan.book?.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                by {loan.book?.author} &bull; ISBN: {loan.book?.isbn}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Patron: </span>
                  <strong>{loan.member?.fullName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Card No: </span>
                  <code>{loan.member?.membershipNumber}</code>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Borrowed On: </span>
                  <span>{loan.borrowDate}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Due Date: </span>
                  <span style={isOverdue ? { color: 'var(--accent-rose)', fontWeight: 700 } : {}}>
                    {loan.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Overdue Alert & Fine Management */}
            {isOverdue && (
              <div
                style={{
                  backgroundColor: 'var(--accent-rose-bg)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 700 }}>
                  <AlertTriangle size={18} />
                  <span>Overdue Notice</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>
                  This loan is overdue. The calculated fine amount is{' '}
                  <strong style={{ color: 'var(--accent-rose)', fontSize: '1rem' }}>
                    ${(loan.fineAmount || 1.0).toFixed(2)}
                  </strong>.
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    checked={waiveFine}
                    onChange={(e) => setWaiveFine(e.target.checked)}
                  />
                  <span>Mark fine as Paid / Waived during return</span>
                </label>
              </div>
            )}

            {/* Return Notes */}
            <div className="form-group">
              <label className="form-label">Return Condition / Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Good condition, returned to front desk"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Return & Restock Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
