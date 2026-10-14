import React from 'react';
import { Search, PlusCircle, BookPlus, UserPlus } from 'lucide-react';

export default function Topbar({
  currentView,
  searchQuery,
  setSearchQuery,
  onOpenIssueModal,
  onOpenBookModal,
  onOpenMemberModal,
}) {
  const titles = {
    dashboard: { title: 'Executive Overview', desc: 'Real-time metrics, loans, and inventory health' },
    books: { title: 'Book Catalog', desc: 'Manage titles, physical copies, barcodes, and shelving' },
    members: { title: 'Patron Directory', desc: 'Manage member cards, quotas, and profiles' },
    circulation: { title: 'Circulation & Loans', desc: 'Monitor active borrowings, overdue alerts, and returns' },
  };

  const currentMeta = titles[currentView] || titles.dashboard;

  return (
    <header className="topbar">
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentMeta.title}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{currentMeta.desc}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Global Search */}
        <div className="search-box-global">
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder={`Search ${currentView === 'dashboard' ? 'catalog, members...' : currentView}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="topbar-actions">
          <button
            className="btn btn-primary"
            onClick={onOpenIssueModal}
            title="Issue book to patron"
          >
            <PlusCircle size={16} />
            <span>Issue Book</span>
          </button>

          {currentView === 'books' && (
            <button
              className="btn btn-secondary"
              onClick={onOpenBookModal}
              title="Add new title"
            >
              <BookPlus size={16} />
              <span>Add Book</span>
            </button>
          )}

          {currentView === 'members' && (
            <button
              className="btn btn-secondary"
              onClick={onOpenMemberModal}
              title="Register new patron"
            >
              <UserPlus size={16} />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
