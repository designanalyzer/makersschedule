import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from './errorHandler';

interface CSRFRequest extends Request {
  csrfToken?: string;
}

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Generate CSRF secret
function getCSRFSecret() {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    throw new Error('CSRF_SECRET environment variable must be set');
  }
  
  // Validate secret strength in production
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('CSRF_SECRET must be at least 32 characters long in production');
  }
  
  return secret;
}

// Generate a CSRF token
export function generateCSRFToken(sessionId: string): string {
  const secret = getCSRFSecret();
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  
  csrfTokens.set(sessionId, { token, expires });
  
  return token;
}

// Validate CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  // Check if token has expired
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

// Clean up expired tokens (run periodically)
export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}

// CSRF middleware for protected routes
export const csrfProtection = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  try {
    // Skip CSRF check for GET requests and health checks
    if (req.method === 'GET' || req.path === '/health') {
      return next();
    }

    const sessionId = req.session?.id;
    if (!sessionId) {
      const error = new Error('Session required for CSRF protection') as AppError;
      error.statusCode = 401;
      throw error;
    }

    // Get token from header or body
    const token = req.headers['x-csrf-token'] as string || req.body._csrf;
    
    if (!token) {
      const error = new Error('CSRF token required') as AppError;
      error.statusCode = 403;
      throw error;
    }

    if (!validateCSRFToken(sessionId, token)) {
      const error = new Error('Invalid CSRF token') as AppError;
      error.statusCode = 403;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to add CSRF token to response
export const addCSRFToken = (req: CSRFRequest, res: Response, next: NextFunction): void => {
  try {
    const sessionId = req.session?.id;
    if (!sessionId) {
      return next();
    }

    // Generate new token if none exists or if expired
    const stored = csrfTokens.get(sessionId);
    if (!stored || Date.now() > stored.expires) {
      const token = generateCSRFToken(sessionId);
      req.csrfToken = token;
    } else {
      req.csrfToken = stored.token;
    }

    // Add token to response headers for easy access
    res.setHeader('X-CSRF-Token', req.csrfToken);
    
    next();
  } catch (error) {
    next(error);
  }
};

// Start cleanup interval (run every hour)
setInterval(cleanupExpiredTokens, 60 * 60 * 1000); 