require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Initialize database
require('./db');

const enquiriesRoutes = require('./routes/enquiries');
const plansRoutes = require('./routes/plans');
const settingsRoutes = require('./routes/settings');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static uploads / media if any
const publicDir = path.join(__dirname, '../client/public');
if (fs.existsSync(publicDir)) {
  app.use('/media', express.static(publicDir));
}

// API Routes
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Shree Ji Solar Experts API',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  SHREE JI SOLAR EXPERTS - Server Active       `);
  console.log(`  Port: http://localhost:${PORT}                 `);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});
