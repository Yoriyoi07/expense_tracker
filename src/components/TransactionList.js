import React, { useState } from 'react';
import { DEFAULT_CATEGORIES } from '../constants';

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString();
}

const CAT_COLORS = {
  food: '#ef4444',
  bills: '#f59e0b',
  transport: '#10b981',
  leisure: '#8b5cf6',
  health: '#06b6d4',
  shopping: '#ec4899',
  rent: '#6366f1',
  utilities: '#22c55e',
  other: '#9ca3af'
};

export default function TransactionList({ items, onEdit, onDelete, onInlineSave, searchQuery = '', typeFilter = 'all' }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: 'asc' };
      return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' };
    });
  };

  const filtered = (items || []).filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const fields = [
      t.note || '',
      t.category || '',
      t.type || '',
      String(t.amount || ''),
      new Date(t.date).toLocaleDateString(),
    ];
    return fields.some((f) => String(f).toLowerCase().includes(q));
  });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sort.dir === 'asc' ? 1 : -1;
    const get = (t) => {
      if (sort.key === 'date') return new Date(t.date).getTime();
      if (sort.key === 'type') return t.type || '';
      if (sort.key === 'category') return t.category || '';
      return 0;
    };
    const av = get(a);
    const bv = get(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });

  const startEdit = (t) => {
    setEditingId(t._id);
    setDraft({ ...t, date: new Date(t.date).toISOString().slice(0, 10) });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };
  const saveEdit = () => {
    if (!draft) return;
    onInlineSave(draft._id, {
      type: draft.type,
      amount: Number(draft.amount),
      category: draft.category,
      note: draft.note,
      date: new Date(draft.date).toISOString(),
    });
    setEditingId(null);
    setDraft(null);
  };
  if (!items?.length) return <p className="empty">No transactions yet.</p>;
  return (
    <table className="tx-table">
      <thead>
        <tr>
          <th>
            <button className="th-btn" onClick={() => toggleSort('date')} aria-label="Sort by date">
              Date {sort.key === 'date' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
            </button>
          </th>
          <th>
            <button className="th-btn" onClick={() => toggleSort('type')} aria-label="Sort by type">
              Type {sort.key === 'type' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
            </button>
          </th>
          <th>
            <button className="th-btn" onClick={() => toggleSort('category')} aria-label="Sort by category">
              Category {sort.key === 'category' ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
            </button>
          </th>
          <th>Note</th>
          <th style={{ textAlign: 'right' }}>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((t) => {
          const isEditing = editingId === t._id;
          return (
            <tr key={t._id}>
              <td>
                {isEditing ? (
                  <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
                ) : (
                  formatDate(t.date)
                )}
              </td>
              <td>
                {isEditing ? (
                  <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
                    <option value="income">income</option>
                    <option value="expense">expense</option>
                  </select>
                ) : (
                  t.type
                )}
              </td>
              <td>
                {isEditing ? (
                  <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                    {(DEFAULT_CATEGORIES[draft.type] || DEFAULT_CATEGORIES.expense).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, background: CAT_COLORS[t.category] || CAT_COLORS.other, borderRadius: '50%' }} />
                    <span>{t.category}</span>
                  </span>
                )}
              </td>
              <td>
                {isEditing ? (
                  <input value={draft.note || ''} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
                ) : (
                  (() => {
                    const note = t.note?.trim();
                    if (!note) return '-';
                    const LIMIT = 80;
                    const isLong = note.length > LIMIT;
                    const expanded = !!expandedNotes[t._id];
                    const display = expanded || !isLong ? note : note.slice(0, LIMIT) + '…';
                    return (
                      <span style={{ display: 'inline' }}>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{display}</span>
                        {isLong && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setExpandedNotes((prev) => ({ ...prev, [t._id]: !expanded }));
                            }}
                            aria-expanded={expanded}
                            style={{
                              marginLeft: 8,
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              padding: 0,
                              textDecoration: 'underline'
                            }}
                          >
                            {expanded ? 'See less' : 'See more'}
                          </button>
                        )}
                      </span>
                    );
                  })()
                )}
              </td>
              <td style={{ textAlign: 'right', color: (isEditing ? draft.type : t.type) === 'expense' ? '#c0392b' : '#27ae60' }}>
                {isEditing ? (
                  <input type="number" step="0.01" min="0" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} style={{ width: 110 }} />
                ) : (
                  <>{t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}</>
                )}
              </td>
              <td>
                {isEditing ? (
                  <>
                    <button onClick={(e) => { e.preventDefault(); saveEdit(); }}>Save</button>
                    <button className="secondary" onClick={(e) => { e.preventDefault(); cancelEdit(); }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={(e) => { e.preventDefault(); startEdit(t); }}>Edit</button>
                    <button className="danger" onClick={(e) => { e.preventDefault(); onDelete(t._id); }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
