const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = errData.message || (errData.errors ? Object.values(errData.errors).join(', ') : 'Request failed');
    } catch {
      errorMsg = response.statusText || 'Request failed';
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Books
  getBooks: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'ALL') params.append('category', category);
    const res = await fetch(`${API_BASE}/books?${params.toString()}`);
    return handleResponse(res);
  },

  getBook: async (id) => {
    const res = await fetch(`${API_BASE}/books/${id}`);
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${API_BASE}/books/categories`);
    return handleResponse(res);
  },

  createBook: async (bookData) => {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    });
    return handleResponse(res);
  },

  updateBook: async (id, bookData) => {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    });
    return handleResponse(res);
  },

  deleteBook: async (id) => {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Members
  getMembers: async (search = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/members?${params.toString()}`);
    return handleResponse(res);
  },

  getMember: async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}`);
    return handleResponse(res);
  },

  createMember: async (memberData) => {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    return handleResponse(res);
  },

  updateMember: async (id, memberData) => {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    return handleResponse(res);
  },

  deleteMember: async (id) => {
    const res = await fetch(`${API_BASE}/members/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Borrow & Circulation
  getLoans: async (status = '', memberId = null, bookId = null) => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (memberId) params.append('memberId', memberId);
    if (bookId) params.append('bookId', bookId);
    const res = await fetch(`${API_BASE}/borrow?${params.toString()}`);
    return handleResponse(res);
  },

  checkoutBook: async (bookId, memberId, loanDays = 14, notes = '') => {
    const res = await fetch(`${API_BASE}/borrow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, memberId, loanDays, notes }),
    });
    return handleResponse(res);
  },

  returnBook: async (loanId, notes = '', waiveFine = false) => {
    const res = await fetch(`${API_BASE}/borrow/${loanId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, waiveFine }),
    });
    return handleResponse(res);
  },

  renewLoan: async (loanId, extraDays = 14) => {
    const res = await fetch(`${API_BASE}/borrow/${loanId}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ extraDays }),
    });
    return handleResponse(res);
  },

  payFine: async (loanId) => {
    const res = await fetch(`${API_BASE}/borrow/${loanId}/pay-fine`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard`);
    return handleResponse(res);
  },
};
