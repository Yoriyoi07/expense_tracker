import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';

export default function BudgetGoals({ month, totals }) {
  // Keep as string for input so it doesn't show a default 0; convert to number when needed
  const [budget, setBudget] = useState('');
  const key = `budget:${month}`;

  useEffect(() => {
    let ignore = false;
    const raw = localStorage.getItem(key);
    if (raw != null) setBudget(raw);
    (async () => {
      try {
        const res = await api.get(`/api/budgets/${month}`);
        if (!ignore) {
          const amt = res?.data?.amount ?? 0;
          setBudget(amt ? String(amt) : '');
          localStorage.setItem(key, amt ? String(amt) : '');
        }
      } catch (e) {
        // keep local cache fallback
      }
    })();
    return () => { ignore = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  // Auto-save changes with debounce (persist to API and cache) with toast feedback
  const initialChange = useRef(true);
  const lastToastAt = useRef(0);
  useEffect(() => {
    const to = setTimeout(async () => {
      const val = budget === '' ? '' : String(budget);
      localStorage.setItem(key, val);
      const num = Number(val || 0);
      if (initialChange.current) {
        initialChange.current = false;
        return; // skip put/toast on initial load
      }
      try {
        await api.put(`/api/budgets/${month}`, { amount: num });
        const now = Date.now();
        if (now - lastToastAt.current > 2500) {
          toast.success('Budget saved');
          lastToastAt.current = now;
        }
      } catch (e) {
        toast.error('Failed to save budget');
      }
    }, 400);
    return () => clearTimeout(to);
  }, [budget, key, month]);
  const budgetNum = Number(budget || 0);
  const remaining = Math.max(0, budgetNum - totals.expense);
  const pct = budgetNum ? Math.min(100, Math.round((totals.expense / budgetNum) * 100)) : 0;

  return (
    <div className="budget">
      <div className="row">
        <label>
          Monthly Budget
          <input
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter amount"
          />
        </label>
        <button className="btn btn-ghost" type="button" title="Clear budget" onClick={() => setBudget('')}>Clear</button>
      </div>
      <div className="meta">
        Spent: <strong>{totals.expense.toLocaleString()}</strong> · Budget: <strong>{budgetNum.toLocaleString()}</strong> · Remaining: <strong>{remaining.toLocaleString()}</strong>
      </div>
      <div className="bar">
        <div className={`fill ${pct > 100 ? 'over' : ''}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}
