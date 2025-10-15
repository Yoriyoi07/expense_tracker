const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ }, // YYYY-MM
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

BudgetSchema.index({ month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
