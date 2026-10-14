import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Plus,
  BookOpen,
  MapPin,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Share2,
  Eye,
} from 'lucide-react';

export default function BooksView({
  books,
  categories,
  loading,
  searchQuery,
  setSearchQuery,
  onOpenBookModal,
  onEditBook,
  onDeleteBook,
  onViewBookDetails,
  onQuickIssue,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, IN_STOCK, OUT_OF_STOCK
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchQuery =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'ALL' ||
        book.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchStock =
        stockFilter === 'ALL' ||
        (stockFilter === 'IN_STOCK' && book.availableCopies > 0) ||
        (stockFilter === 'OUT_OF_STOCK' && book.availableCopies <= 0);

      return matchQuery && matchCategory && matchStock;
    });
  }, [books, searchQuery, selectedCategory, stockFilter]);

  return (
    <div className="books-view">
      {/* Controls & Filters Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={15} color="var(--text-dim)" />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories ({books.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Availability Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="ALL">All Availability</option>
            <option value="IN_STOCK">In Stock Only</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredBooks.length}</strong> of {books.length} titles
          </span>
        </div>

        {/* View Toggle & Add Book */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '3px' }}>
            <button
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                border: 'none',
              }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                border: 'none',
              }}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <ListIcon size={16} />
            </button>
          </div>

          <button className="btn btn-primary btn-sm" onClick={onOpenBookModal}>
            <Plus size={15} /> Add New Title
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
          Loading catalog...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} color="var(--text-dim)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Books Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
            No titles matched your query or selected category filters.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedCategory('ALL');
              setStockFilter('ALL');
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Books Grid View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
          {filteredBooks.map((book) => {
            const isInStock = book.availableCopies > 0;
            return (
              <div
                key={book.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Book Cover */}
                <div
                  style={{
                    height: '190px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '14px',
                    backgroundColor: 'var(--bg-input)',
                  }}
                >
                  <img
                    src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {/* Category Pill Over Cover */}
                  <span
                    className="badge badge-purple"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {book.category}
                  </span>

                  {/* Stock Badge */}
                  <span
                    className={`badge ${isInStock ? 'badge-success' : 'badge-danger'}`}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    {isInStock ? `${book.availableCopies}/${book.totalCopies} In-Stock` : 'Out of Stock'}
                  </span>
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      lineHeight: '1.3',
                      marginBottom: '4px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => onViewBookDetails(book)}
                    title={book.title}
                  >
                    {book.title}
                  </h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    by <strong>{book.author}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span>{book.shelfLocation || 'Main Stacks'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} />
                      <span>Year: {book.publicationYear || 'N/A'} &bull; ISBN: {book.isbn}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      disabled={!isInStock}
                      onClick={() => onQuickIssue(book)}
                      title={isInStock ? 'Checkout this book' : 'Currently unavailable'}
                    >
                      <Share2 size={13} /> {isInStock ? 'Issue Book' : 'Issued Out'}
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => onViewBookDetails(book)}
                      title="View Details & Loans"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => onEditBook(book)}
                      title="Edit Title"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '32px', height: '32px', color: 'var(--accent-rose)' }}
                      onClick={() => onDeleteBook(book.id)}
                      title="Delete Title"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Books Table View */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title & Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Shelf Location</th>
                <th>Copies Available</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const isInStock = book.availableCopies > 0;
                return (
                  <tr key={book.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={book.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=100&q=80'}
                          alt={book.title}
                          style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <div
                            style={{ fontWeight: 700, cursor: 'pointer' }}
                            onClick={() => onViewBookDetails(book)}
                          >
                            {book.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{book.category}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{book.isbn}</td>
                    <td>{book.shelfLocation || 'Stacks'}</td>
                    <td>
                      <strong>{book.availableCopies}</strong> / {book.totalCopies}
                    </td>
                    <td>
                      <span className={`badge ${isInStock ? 'badge-success' : 'badge-danger'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={!isInStock}
                          onClick={() => onQuickIssue(book)}
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Issue
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onViewBookDetails(book)}
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => onEditBook(book)}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ width: '28px', height: '28px', color: 'var(--accent-rose)' }}
                          onClick={() => onDeleteBook(book.id)}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
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
