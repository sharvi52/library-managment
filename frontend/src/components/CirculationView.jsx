import React, { useState, useMemo } from 'react';
import {
  Repeat,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Plus,
  RotateCcw,
  CreditCard,
  Calendar,
} from 'lucide-react';

export default function CirculationView({
  loans,
  loading,
  searchQuery,
  onOpenIssueModal,
  onReturnBook,
  onRenewLoan,
  onPayFine,
}) {
  const [statusTab, setStatusTab] = useState('ACTIVE'); // 'ALL' | 'ACTIVE' | 'OVERDUE' | 'RETURNED'

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchQuery =
        !searchQuery ||
        loan.book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.book?.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.member?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.member?.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase());

      let matchTab = true;
      if (statusTab === 'ACTIVE') {
        matchTab = loan.status === 'BORROWED' || loan.status === 'EXTENDED' || loan.status === 'OVERDUE';
      } else if (statusTab === 'OVERDUE') {
        matchTab = loan.status === 'OVERDUE';
      } else if (statusTab === 'RETURNED') {
        matchTab = loan.status === 'RETURNED';
      }

      return matchQuery && matchTab;
    });
  }, [loans, searchQuery, statusTab]);

  // Compute counts for tab badges
  const activeCount = loans.filter((l) => l.status === 'BORROWED' || l.status === 'EXTENDED' || l.status === 'OVERDUE').length;
  const overdueCount = loans.filter((l) => l.status === 'OVERDUE').length;
  const returnedCount = loans.filter((l) => l.status === 'RETURNED').length;

  return (
    <div className="circulation-view">
      {/* Tab Navigation & Controls */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${statusTab === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusTab('ACTIVE')}
          >
            <Clock size={14} /> Active Loans ({activeCount})
          </button>
          <button
            className={`btn btn-sm ${statusTab === 'OVERDUE' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setStatusTab('OVERDUE')}
          >
            <AlertTriangle size={14} /> Overdue Only ({overdueCount})
          </button>
          <button
            className={`btn btn-sm ${statusTab === 'RETURNED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusTab('RETURNED')}
          >
            <CheckCircle size={14} /> Returned History ({returnedCount})
          </button>
          <button
            className={`btn btn-sm ${statusTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusTab('ALL')}
          >
            All Transactions ({loans.length})
          </button>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenIssueModal}>
          <Plus size={15} /> Issue Book to Patron
        </button>
      </div>

      {/* Circulation Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
          Loading circulation records...
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Repeat size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Records in this Tab</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            There are currently no transactions matching your selection.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Details</th>
                <th>Patron</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fines</th>
                <th style={{ textAlign: 'right' }}>Circulation Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const isOverdue = loan.status === 'OVERDUE';
                const isReturned = loan.status === 'RETURNED';

                return (
                  <tr key={loan.id} style={isOverdue ? { backgroundColor: 'rgba(244, 63, 94, 0.03)' } : {}}>
                    {/* Book */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={loan.book?.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=100&q=80'}
                          alt={loan.book?.title}
                          style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{loan.book?.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            by {loan.book?.author} &bull; ISBN: {loan.book?.isbn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Member */}
                    <td>
                      <div style={{ fontWeight: 600 }}>{loan.member?.fullName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        {loan.member?.membershipNumber}
                      </div>
                    </td>

                    {/* Borrow Date */}
                    <td>{loan.borrowDate}</td>

                    {/* Due Date */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={isOverdue ? { color: 'var(--accent-rose)', fontWeight: 700 } : {}}>
                          {loan.dueDate}
                        </span>
                        {isOverdue && (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                            Overdue
                          </span>
                        )}
                      </div>
                      {isReturned && loan.returnDate && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                          Returned: {loan.returnDate}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`badge ${
                          loan.status === 'BORROWED'
                            ? 'badge-primary'
                            : loan.status === 'EXTENDED'
                            ? 'badge-cyan'
                            : loan.status === 'OVERDUE'
                            ? 'badge-danger'
                            : 'badge-success'
                        }`}
                      >
                        {loan.status} {loan.renewCount > 0 && `(+${loan.renewCount})`}
                      </span>
                    </td>

                    {/* Fines */}
                    <td>
                      {loan.fineAmount > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              color: loan.finePaid ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                              fontWeight: 700,
                            }}
                          >
                            ${loan.fineAmount.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {loan.finePaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>$0.00</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {!isReturned ? (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => onReturnBook(loan)}
                              title="Process Book Return"
                            >
                              <CheckCircle size={14} /> Return
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onRenewLoan(loan.id)}
                              title="Renew Due Date (+14 days)"
                            >
                              <RotateCcw size={14} /> Renew
                            </button>
                          </>
                        ) : null}

                        {loan.fineAmount > 0 && !loan.finePaid && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onPayFine(loan.id)}
                            title="Collect Fine Payment"
                          >
                            <DollarSign size={14} /> Pay Fine
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
