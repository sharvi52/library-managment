import React from 'react';
import {
  BookOpen,
  Users,
  Repeat,
  AlertTriangle,
  Layers,
  DollarSign,
  TrendingUp,
  Bookmark,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function DashboardView({
  stats,
  loading,
  setCurrentView,
  onOpenIssueModal,
  onOpenBookModal,
  onOpenMemberModal,
}) {
  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Loading Athenaeum Dashboard...</div>
        <div style={{ fontSize: '0.85rem' }}>Fetching live circulation metrics and database states</div>
      </div>
    );
  }

  const {
    totalBooks = 0,
    totalCopies = 0,
    availableCopies = 0,
    issuedCopies = 0,
    totalMembers = 0,
    activeMembers = 0,
    activeLoansCount = 0,
    overdueLoansCount = 0,
    totalUnpaidFines = 0,
    categoryBreakdown = {},
    topBooks = [],
    recentLoans = [],
  } = stats;

  const availabilityPct = totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100) : 100;

  return (
    <div className="dashboard-view">
      {/* KPI Stats Grid */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-purple-bg)', color: 'var(--accent-purple)' }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalBooks}</h3>
            <p>Unique Titles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Layers size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalCopies}</h3>
            <p>Total Copies ({availableCopies} In-Stock)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-cyan-bg)', color: 'var(--accent-cyan)' }}>
            <Repeat size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeLoansCount}</h3>
            <p>Active Loans</p>
          </div>
        </div>

        <div className="stat-card" style={overdueLoansCount > 0 ? { borderColor: 'rgba(244, 63, 94, 0.4)' } : {}}>
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-rose-bg)', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3 style={overdueLoansCount > 0 ? { color: 'var(--accent-rose)' } : {}}>{overdueLoansCount}</h3>
            <p>Overdue Books</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-emerald-bg)', color: 'var(--accent-emerald)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{activeMembers}</h3>
            <p>Active Patrons ({totalMembers} Total)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-amber-bg)', color: 'var(--accent-amber)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <h3 style={{ color: 'var(--accent-amber)' }}>${totalUnpaidFines.toFixed(2)}</h3>
            <p>Uncollected Fines</p>
          </div>
        </div>
      </div>

      {/* Row: Quick Launch & Inventory Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Inventory Health Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inventory Circulation Ratio</h4>
            <span className="badge badge-primary">{availabilityPct}% Available</span>
          </div>

          <div style={{ height: '12px', borderRadius: '6px', backgroundColor: 'var(--bg-input)', overflow: 'hidden', display: 'flex', marginBottom: '16px' }}>
            <div
              style={{
                width: `${availabilityPct}%`,
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                transition: 'width 0.4s ease',
              }}
              title={`Available: ${availableCopies}`}
            />
            <div
              style={{
                width: `${100 - availabilityPct}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                transition: 'width 0.4s ease',
              }}
              title={`Issued: ${issuedCopies}`}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
              <span>Available Copies on Shelves: <strong>{availableCopies}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }}></span>
              <span>Issued to Patrons: <strong>{issuedCopies}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Dispatch / Workflow Actions */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Desk Operations</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onOpenIssueModal} style={{ padding: '12px' }}>
              <Repeat size={16} /> Issue Book
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentView('circulation')} style={{ padding: '12px' }}>
              <CheckCircle size={16} /> Returns & Fines
            </button>
            <button className="btn btn-secondary" onClick={onOpenBookModal} style={{ padding: '12px' }}>
              <BookOpen size={16} /> Add Catalog Title
            </button>
            <button className="btn btn-secondary" onClick={onOpenMemberModal} style={{ padding: '12px' }}>
              <Users size={16} /> Register Patron
            </button>
          </div>
        </div>
      </div>

      {/* Row: Categories & Top Borrowed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Categories Breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Genre & Category Distribution</h4>
            <button
              onClick={() => setCurrentView('books')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Browse Catalog <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.keys(categoryBreakdown).length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No categories recorded.</div>
            ) : (
              Object.entries(categoryBreakdown).map(([category, count]) => {
                const pct = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} {count === 1 ? 'title' : 'titles'} ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          backgroundColor: 'var(--primary)',
                          height: '100%',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Most Borrowed Leaderboard */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Most Circulated Books</h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>All-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topBooks.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No circulation history yet.</div>
            ) : (
              topBooks.map((book, idx) => (
                <div
                  key={book.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card-hover)',
                  }}
                >
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#64748b',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=100&q=80'}
                    alt={book.title}
                    style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{book.author}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-primary">{book.borrowCount} Loans</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Loans Audit Log */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Circulation Log</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest borrowing and return transactions</p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentView('circulation')}
          >
            View All Records
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Patron</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine Pending</th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '24px' }}>
                    No recent loans found.
                  </td>
                </tr>
              ) : (
                recentLoans.slice(0, 7).map((loan) => (
                  <tr key={loan.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{loan.book?.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>ISBN: {loan.book?.isbn}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{loan.member?.fullName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{loan.member?.membershipNumber}</div>
                    </td>
                    <td>{loan.borrowDate}</td>
                    <td>{loan.dueDate}</td>
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
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      {loan.fineAmount > 0 ? (
                        <span style={{ color: loan.finePaid ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
                          ${loan.fineAmount.toFixed(2)} {loan.finePaid ? '(Paid)' : '(Unpaid)'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>$0.00</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
