import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  CreditCard,
} from 'lucide-react';

export default function MembersView({
  members,
  loading,
  searchQuery,
  onOpenMemberModal,
  onEditMember,
  onDeleteMember,
  onViewMemberDetails,
}) {
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchQuery =
        !searchQuery ||
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType =
        typeFilter === 'ALL' || m.membershipType === typeFilter;

      return matchQuery && matchType;
    });
  }, [members, searchQuery, typeFilter]);

  return (
    <div className="members-view">
      {/* Controls Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Patron Types ({members.length})</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
            <option value="VIP">VIP</option>
            <option value="GENERAL">General</option>
          </select>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredMembers.length}</strong> patrons
          </span>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenMemberModal}>
          <UserPlus size={15} /> Register New Patron
        </button>
      </div>

      {/* Grid of Members */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
          Loading patrons...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Patrons Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No patrons match your search filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
          {filteredMembers.map((member) => {
            const quotaPct = Math.round(((member.activeLoansCount || 0) / (member.maxBooksAllowed || 5)) * 100);
            const isNearLimit = (member.activeLoansCount || 0) >= (member.maxBooksAllowed || 5);

            return (
              <div
                key={member.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  position: 'relative',
                }}
              >
                {/* Header: Avatar, Name, Type */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                  <img
                    src={
                      member.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName)}&background=6366f1&color=fff`
                    }
                    alt={member.fullName}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-medium)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        onClick={() => onViewMemberDetails(member)}
                      >
                        {member.fullName}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        className={`badge ${
                          member.membershipType === 'FACULTY'
                            ? 'badge-primary'
                            : member.membershipType === 'VIP'
                            ? 'badge-warning'
                            : member.membershipType === 'STUDENT'
                            ? 'badge-cyan'
                            : 'badge-purple'
                        }`}
                        style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                      >
                        {member.membershipType}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        {member.membershipNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={13} color="var(--text-dim)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={13} color="var(--text-dim)" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={13} color="var(--text-dim)" />
                    <span>Member since: {member.registeredDate || '2026-01-01'}</span>
                  </div>
                </div>

                {/* Quota bar */}
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Borrowing Capacity</span>
                    <strong style={{ color: isNearLimit ? 'var(--accent-rose)' : 'var(--text-main)' }}>
                      {member.activeLoansCount || 0} / {member.maxBooksAllowed} Books
                    </strong>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${quotaPct}%`,
                        backgroundColor: isNearLimit ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        height: '100%',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onViewMemberDetails(member)}
                  >
                    <BookOpen size={13} /> View Loans
                  </button>
                  <button
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => onEditMember(member)}
                    title="Edit Patron"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--accent-rose)' }}
                    onClick={() => onDeleteMember(member.id)}
                    title="Delete Patron"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
