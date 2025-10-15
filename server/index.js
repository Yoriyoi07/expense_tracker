const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const transactionsRouter = require('./routes/transactions');
const budgetsRouter = require('./routes/budgets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);

// Health check with DB status
app.get('/api/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected 1=connected 2=connecting 3=disconnecting
  const map = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ status: 'ok', db: map[state] || 'unknown', readyState: state });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start server - MongoDB connection error:', e.message);
    process.exit(1);
  }
}

start();
