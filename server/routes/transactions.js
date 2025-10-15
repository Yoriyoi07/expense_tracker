const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

// GET /api/transactions
// Optional query: month=YYYY-MM to filter by calendar month
router.get('/', async (req, res, next) => {
  try {
    const { month } = req.query;
    let filter = {};
    if (month) {
      const [year, m] = month.split('-').map(Number);
      if (!year || !m) return res.status(400).json({ message: 'Invalid month format. Use YYYY-MM' });
      const start = new Date(Date.UTC(year, m - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, m, 0, 23, 59, 59, 999));
      filter.date = { $gte: start, $lte: end };
    }
    const items = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const { type, amount, category, note, date } = req.body;
    const tx = await Transaction.create({ type, amount, category, note, date: new Date(date) });
    return res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, amount, category, note, date } = req.body;
    const tx = await Transaction.findByIdAndUpdate(
      id,
      { type, amount, category, note, date: new Date(date) },
      { new: true, runValidators: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    return res.json(tx);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findByIdAndDelete(id);
    if (!tx) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
