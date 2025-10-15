import React, { useMemo } from 'react';

// Lazy import to avoid crash before install; consumers should ensure recharts is installed
let Recharts = {};
try {
  // eslint-disable-next-line global-require
  Recharts = require('recharts');
} catch (e) {
  // no-op fallback rendering
}

const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } = Recharts;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9b59b6', '#e67e22', '#2ecc71', '#e74c3c', '#3498db'];

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function Dashboard({ items }) {
  const { byCategory, byMonth, totals } = useMemo(() => {
    const cat = new Map();
    const mon = new Map();
    let income = 0;
    let expense = 0;
    for (const t of items || []) {
      if (t.type === 'income') income += t.amount; else expense += t.amount;
      // category pie should only reflect expenses
      if (t.type === 'expense') {
        const k = t.category || 'other';
        cat.set(k, (cat.get(k) || 0) + t.amount);
      }
      // month
      const mk = monthKey(t.date);
      const rec = mon.get(mk) || { month: mk, income: 0, expense: 0 };
      rec[t.type] += t.amount;
      mon.set(mk, rec);
    }
    const byCategory = Array.from(cat.entries())
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);
    const byMonth = Array.from(mon.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
    return { byCategory, byMonth, totals: { income, expense, balance: income - expense } };
  }, [items]);

  return (
    <div className="dashboard">
      <div className="charts">
        <div className="chart">
          <h3>Category Breakdown (Expenses)</h3>
          {PieChart ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={100} label>
                  {byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>Install Recharts to see charts.</p>
          )}
        </div>

        <div className="chart">
          <h3>Monthly Income vs Expense</h3>
          {BarChart ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#2ecc71" />
                <Bar dataKey="expense" fill="#e74c3c" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Install Recharts to see charts.</p>
          )}
        </div>
      </div>
    </div>
  );
}
