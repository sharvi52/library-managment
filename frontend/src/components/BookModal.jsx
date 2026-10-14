import React, { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';

export default function BookModal({
  isOpen,
  onClose,
  onSave,
  bookToEdit,
  categories,
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    publicationYear: 2024,
    publisher: '',
    totalCopies: 3,
    shelfLocation: 'Aisle 1, Shelf A',
    coverUrl: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        isbn: bookToEdit.isbn || '',
        category: bookToEdit.category || 'Computer Science',
        publicationYear: bookToEdit.publicationYear || 2024,
        publisher: bookToEdit.publisher || '',
        totalCopies: bookToEdit.totalCopies || 1,
        shelfLocation: bookToEdit.shelfLocation || '',
        coverUrl: bookToEdit.coverUrl || '',
        description: bookToEdit.description || '',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        category: categories.length > 0 ? categories[0] : 'Fiction',
        publicationYear: new Date().getFullYear(),
        publisher: 'Standard Editions',
        totalCopies: 4,
        shelfLocation: 'Aisle 1, Shelf B',
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        description: '',
      });
    }
  }, [bookToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'publicationYear' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(formData, bookToEdit?.id);
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
            <h3>{bookToEdit ? 'Edit Book Details' : 'Add New Title to Catalog'}</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Structure and Interpretation of Computer Programs"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Author *</label>
                <input
                  type="text"
                  name="author"
                  className="form-input"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. Harold Abelson, Gerald Sussman"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ISBN Code *</label>
                <input
                  type="text"
                  name="isbn"
                  className="form-input"
                  required
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="e.g. 978-0262510875"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category / Genre *</label>
                <input
                  type="text"
                  name="category"
                  className="form-input"
                  list="categories-list"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science, Fiction, History"
                />
                <datalist id="categories-list">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                  <option value="Computer Science" />
                  <option value="Fiction" />
                  <option value="Philosophy" />
                  <option value="Science" />
                  <option value="History" />
                  <option value="Biography" />
                  <option value="Arts & Design" />
                </datalist>
              </div>

              <div className="form-group">
                <label className="form-label">Total Copies *</label>
                <input
                  type="number"
                  name="totalCopies"
                  min="1"
                  max="100"
                  className="form-input"
                  required
                  value={formData.totalCopies}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Shelf Location</label>
                <input
                  type="text"
                  name="shelfLocation"
                  className="form-input"
                  value={formData.shelfLocation}
                  onChange={handleChange}
                  placeholder="e.g. Aisle 3, Shelf CS-105"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publication Year</label>
                <input
                  type="number"
                  name="publicationYear"
                  className="form-input"
                  value={formData.publicationYear}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Publisher</label>
              <input
                type="text"
                name="publisher"
                className="form-input"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="e.g. MIT Press"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                name="coverUrl"
                className="form-input"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Summary / Description</label>
              <textarea
                name="description"
                rows={3}
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short synopsis or library catalog notes..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : bookToEdit ? 'Save Changes' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
