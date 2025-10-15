import React, { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import { listTransactions, createTransaction, updateTransaction, deleteTransaction } from './api';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import BudgetGoals from './components/BudgetGoals';
import StatusBadge from './components/StatusBadge';
import ConfirmDialog from './components/ConfirmDialog';
import { exportTransactionsToCsv } from './utils/exportCsv';

function pad(n) { return String(n).padStart(2, '0'); }
function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [month, setMonth] = useState(currentMonth());
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Keyboard shortcut: Alt+T toggles theme
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.altKey && String(e.key).toLowerCase() === 't') {
        e.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTransactions({ month });
      setItems(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load');
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const onAdd = async (payload) => {
    try {
      await createTransaction(payload);
      setEditing(null);
      fetchItems();
      toast.success('Transaction added');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to create');
    }
  };

  const onUpdate = async (payload) => {
    try {
      await updateTransaction(editing._id, payload);
      setEditing(null);
      fetchItems();
      toast.success('Transaction updated');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update');
    }
  };

  const onDelete = (id) => {
    setConfirmState({ open: true, id });
  };

  const confirmDelete = async () => {
    const id = confirmState.id;
    setConfirmState({ open: false, id: null });
    try {
      await deleteTransaction(id);
      fetchItems();
      toast.success('Transaction deleted');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    }
  };

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    for (const t of items) {
      if (t.type === 'income') income += t.amount; else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  }, [items]);

  const onInlineSave = async (id, payload) => {
    try {
      await updateTransaction(id, payload);
      toast.success('Transaction updated');
      fetchItems();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="container">
      <Toaster position="top-right" />
      <ConfirmDialog
        open={confirmState.open}
        title="Delete transaction?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setConfirmState({ open: false, id: null })}
      />
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0 }}>Expense Tracker</h1>
          <div className="header-actions">
            <StatusBadge />
            <button
              className="btn-ghost theme-switch"
              data-checked={theme === 'dark'}
              aria-label="Toggle theme"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              <span className="switch"><span className="dot" /></span>
            </button>
          </div>
        </div>

        <div className="filters">
          <label>
            Month
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </label>
          <div className="summary">
            <span>Income: <strong>{totals.income.toLocaleString()}</strong></span>
            <span>Expenses: <strong>{totals.expense.toLocaleString()}</strong></span>
            <span>Balance: <strong>{totals.balance.toLocaleString()}</strong></span>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <section>
        <h2>{editing ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <TransactionForm onSubmit={editing ? onUpdate : onAdd} initialData={editing} onCancel={() => setEditing(null)} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn btn-ghost export-btn" onClick={() => exportTransactionsToCsv(items, `transactions-${month}.csv`)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L11 12.586V4a1 1 0 0 1 1-1z"/><path d="M5 18a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"/></svg>
            Export CSV
          </button>
        </div>
      </section>

      <section>
        <Dashboard items={items} />
        <BudgetGoals month={month} totals={totals} />
      </section>

      <section>
        <h2>Transactions</h2>
        <div className="table-container">
          {loading ? <p style={{ padding: 12 }}>Loading...</p> : <TransactionList items={items} onEdit={setEditing} onDelete={onDelete} onInlineSave={onInlineSave} />}
        </div>
      </section>
    </div>
  );
}

export default App;
