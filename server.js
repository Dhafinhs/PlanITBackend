const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug log request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/users', require('./routes/users'));

// Root path (wajib untuk Railway/Render healthcheck)
app.get('/', (req, res) => {
  res.send('✅ PlanIT backend is running!');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🔥 Error Handler Triggered:', {
    message: err.message,
    stack: err.stack,
    query: err.query || null,
  });

  res.status(500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Optional: Shutdown handling (catch container stop)
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully.');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🌐 Loaded Environment Variables:', {
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
  });
});
