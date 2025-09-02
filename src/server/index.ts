import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import dotenv from 'dotenv';
import path from 'path';

import { logger } from '../utils/logger';
import { errorHandler } from '../middleware/errorHandler';
import { notFoundHandler } from '../middleware/notFoundHandler';
import { csrfProtection, addCSRFToken } from '../middleware/csrf';

// Import routes
import csrfRoutes from '../routes/csrf';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com']
    : process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use(limiter);

// Session configuration
const SQLiteSession = SQLiteStore(session);
app.use(session({
  store: new SQLiteSession({
    db: 'sessions.db',
    dir: './data',
  }) as any,
  secret: getSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSRF protection middleware
app.use(addCSRFToken);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// CSRF token endpoint (no protection needed)
app.use('/api/csrf', csrfRoutes);

// API routes with CSRF protection
// (No API routes currently needed - frontend uses Supabase directly)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
});

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable must be set');
  }
  
  // Validate secret strength in production
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long in production');
  }
  
  return secret;
}