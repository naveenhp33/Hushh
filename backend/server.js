const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

process.on('uncaughtException', (err) => console.error('🔥 UNCAUGHT:', err));
process.on('unhandledRejection', (reason) => console.error('🌊 UNHANDLED:', reason));
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const referralRoutes = require('./routes/referral');
const dashboardRoutes = require('./routes/dashboard');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Allow Firebase popup auth to work (fixes Cross-Origin-Opener-Policy warnings)
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/referral', referralRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve Static Files for Frontend
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all to serve React app for client-side routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexFile = path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      next(); // Fallback if file not found
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
