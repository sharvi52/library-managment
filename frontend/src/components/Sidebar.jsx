import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Repeat,
  Sun,
  Moon,
  Database,
  Library,
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  theme,
  toggleTheme,
  overdueCount = 0,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Book Catalog', icon: BookOpen },
    { id: 'members', label: 'Patrons & Members', icon: Users },
    {
      id: 'circulation',
      label: 'Circulation & Loans',
      icon: Repeat,
      badge: overdueCount > 0 ? overdueCount : null,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <Library size={22} />
        </div>
        <div className="brand-text">
          <h1>Athenaeum</h1>
          <span className="brand-subtitle">Library System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-badge danger">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Controls */}
      <div className="sidebar-footer">
        <button
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Toggle
          </span>
        </button>

        <div className="system-status">
          <div className="status-dot"></div>
          <Database size={13} style={{ color: 'var(--text-dim)' }} />
          <span>Spring Boot 3.4 &bull; H2 DB</span>
        </div>
      </div>
    </aside>
  );
}
