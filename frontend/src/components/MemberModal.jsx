import React, { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';

export default function MemberModal({
  isOpen,
  onClose,
  onSave,
  memberToEdit,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipType: 'STUDENT',
    maxBooksAllowed: 5,
    avatarUrl: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        fullName: memberToEdit.fullName || '',
        email: memberToEdit.email || '',
        phone: memberToEdit.phone || '',
        membershipType: memberToEdit.membershipType || 'STUDENT',
        maxBooksAllowed: memberToEdit.maxBooksAllowed || 5,
        avatarUrl: memberToEdit.avatarUrl || '',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        membershipType: 'STUDENT',
        maxBooksAllowed: 5,
        avatarUrl: '',
      });
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxBooksAllowed' ? Number(value) : value,
    }));
  };

  const handleTypeChange = (type) => {
    let limit = 5;
    if (type === 'FACULTY') limit = 10;
    else if (type === 'VIP') limit = 15;
    else if (type === 'GENERAL') limit = 4;
    setFormData((prev) => ({
      ...prev,
      membershipType: type,
      maxBooksAllowed: limit,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData, memberToEdit?.id);
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
            <Users size={20} color="var(--primary)" />
            <h3>{memberToEdit ? 'Edit Patron Member' : 'Register New Patron'}</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Liam Henderson"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. liam.h@institution.edu"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Membership Tier</label>
                <select
                  className="form-select"
                  value={formData.membershipType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option value="STUDENT">Student (5 books quota)</option>
                  <option value="FACULTY">Faculty / Professor (10 books quota)</option>
                  <option value="VIP">VIP Researcher (15 books quota)</option>
                  <option value="GENERAL">General Public (4 books quota)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Allowed Borrows</label>
                <input
                  type="number"
                  name="maxBooksAllowed"
                  min="1"
                  max="50"
                  className="form-input"
                  value={formData.maxBooksAllowed}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Avatar Photo URL (Optional)</label>
              <input
                type="url"
                name="avatarUrl"
                className="form-input"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : memberToEdit ? 'Save Changes' : 'Register Patron'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
