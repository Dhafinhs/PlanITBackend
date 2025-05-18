const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware (opsional, untuk log setiap request)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/users', require('./routes/users'));

// Route default untuk platform healthcheck
app.get('/', (req, res) => {
  res.send('✅ PlanIT backend is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    query: err.query || 'n/a'
  });

  res.status(500).json({ 
    error: err.message,
    detail: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Shutdown handler (log kalau container dihentikan)
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🌐 Environment Variables:', {
    PORT: process.env.PORT,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
  });
});
