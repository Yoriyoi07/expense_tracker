import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export function exportTransactionsToCsv(items, filename = 'transactions.csv') {
  const data = (items || []).map((t) => ({
    id: t._id || '',
    type: t.type,
    amount: t.amount,
    category: t.category,
    note: t.note || '',
    date: new Date(t.date).toISOString(),
  }));
  const csv = Papa.unparse(data, { header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}
