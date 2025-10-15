import React, { useState, useEffect } from 'react';
import { DEFAULT_CATEGORIES } from '../constants';

function toDateInputValue(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function TransactionForm({ onSubmit, initialData, onCancel }) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount?.toString?.() || '');
  const [category, setCategory] = useState(initialData?.category || 'food');
  const [note, setNote] = useState(initialData?.note || '');
  const [date, setDate] = useState(initialData?.date ? toDateInputValue(initialData.date) : toDateInputValue(new Date()));

  // When initialData changes (user clicks Edit or cancels), sync the form fields
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount != null ? String(initialData.amount) : '');
      setCategory(initialData.category || 'food');
      setNote(initialData.note || '');
      setDate(initialData.date ? toDateInputValue(initialData.date) : toDateInputValue(new Date()));
    } else {
      // Reset to defaults when clearing edit
      setType('expense');
      setAmount('');
      setCategory('food');
      setNote('');
      setDate(toDateInputValue(new Date()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    // Reset category when type switches
    if (!DEFAULT_CATEGORIES[type].includes(category)) {
      setCategory(DEFAULT_CATEGORIES[type][0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      type,
      amount: Number(amount),
      category,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    };
    if (!payload.amount || payload.amount < 0) return;
    onSubmit(payload);
  };

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {DEFAULT_CATEGORIES[type].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
      </div>
      <label className="note">
        Note
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
      </label>
      <div className="actions">
        <button type="submit">{initialData ? 'Update' : 'Add'} Transaction</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
