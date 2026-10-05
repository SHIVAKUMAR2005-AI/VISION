const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Static frontend serving
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'User Management Profile Service'
  });
});

// Fallback for SPA routing - serve index.html for non-API routes
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint '${req.path}' not found.`
    });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred. Please try again later.'
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 User Profile Management Server running on port ${PORT}`);
      console.log(`🌐 Local Application URL: http://localhost:${PORT}`);
      console.log(`📡 Profile API Endpoint: http://localhost:${PORT}/api/profile`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to initialize server or database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
