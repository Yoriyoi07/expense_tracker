const express = require('express');
const Budget = require('../models/Budget');

const router = express.Router();

// GET /api/budgets/:month  (YYYY-MM)
router.get('/:month', async (req, res, next) => {
  try {
    const { month } = req.params;
    const doc = await Budget.findOne({ month });
    res.json(doc || { month, amount: 0 });
  } catch (err) {
    next(err);
  }
});

// PUT /api/budgets/:month { amount: number }
router.put('/:month', async (req, res, next) => {
  try {
    const { month } = req.params;
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount < 0) return res.status(400).json({ message: 'Invalid amount' });
    const doc = await Budget.findOneAndUpdate(
      { month },
      { month, amount },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
