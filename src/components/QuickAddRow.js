import React, { useMemo, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../constants';

function toDateInputValue(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function QuickAddRow({ onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateInputValue(new Date()));

  const categories = useMemo(() => DEFAULT_CATEGORIES[type] || DEFAULT_CATEGORIES.expense, [type]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      type,
      amount: Number(amount),
      category,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    };
    if (!payload.amount || payload.amount < 0) return;
    onAdd(payload);
    // reset minimal fields
    setAmount('');
    setNote('');
  };

  return (
    <form className="quick-add" onSubmit={submit}>
      <select value={type} onChange={(e) => { setType(e.target.value); if (!(DEFAULT_CATEGORIES[e.target.value]||[]).includes(category)) setCategory((DEFAULT_CATEGORIES[e.target.value]||[])[0]); }}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="number" step="0.01" min="0" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input type="text" placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button className="btn" type="submit">Add</button>
    </form>
  );
}
