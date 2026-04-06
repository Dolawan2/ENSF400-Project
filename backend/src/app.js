const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { authenticate, requireAdmin } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const requestTimer = require('./middleware/requestTimer');

const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const generateRoutes = require('./routes/generate.routes');
const downloadRoutes = require('./routes/download.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(requestTimer);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/upload', authenticate, uploadRoutes);
app.use('/api/generate', authenticate, generateRoutes);
app.use('/api/download', authenticate, downloadRoutes);
app.use('/api/user', authenticate, userRoutes);

// Admin routes
app.use('/api/admin', authenticate, requireAdmin, adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
