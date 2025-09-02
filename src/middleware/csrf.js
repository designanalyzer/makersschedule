"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCSRFToken = exports.csrfProtection = void 0;
exports.generateCSRFToken = generateCSRFToken;
exports.validateCSRFToken = validateCSRFToken;
exports.cleanupExpiredTokens = cleanupExpiredTokens;
const crypto_1 = __importDefault(require("crypto"));
const csrfTokens = new Map();
function getCSRFSecret() {
    const secret = process.env.CSRF_SECRET;
    if (!secret) {
        throw new Error('CSRF_SECRET environment variable must be set');
    }
    if (process.env.NODE_ENV === 'production' && secret.length < 32) {
        throw new Error('CSRF_SECRET must be at least 32 characters long in production');
    }
    return secret;
}
function generateCSRFToken(sessionId) {
    const secret = getCSRFSecret();
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expires = Date.now() + (24 * 60 * 60 * 1000);
    csrfTokens.set(sessionId, { token, expires });
    return token;
}
function validateCSRFToken(sessionId, token) {
    const stored = csrfTokens.get(sessionId);
    if (!stored) {
        return false;
    }
    if (Date.now() > stored.expires) {
        csrfTokens.delete(sessionId);
        return false;
    }
    return stored.token === token;
}
function cleanupExpiredTokens() {
    const now = Date.now();
    for (const [sessionId, data] of csrfTokens.entries()) {
        if (now > data.expires) {
            csrfTokens.delete(sessionId);
        }
    }
}
const csrfProtection = (req, res, next) => {
    try {
        if (req.method === 'GET' || req.path === '/health') {
            return next();
        }
        const sessionId = req.session?.id;
        if (!sessionId) {
            const error = new Error('Session required for CSRF protection');
            error.statusCode = 401;
            throw error;
        }
        const token = req.headers['x-csrf-token'] || req.body._csrf;
        if (!token) {
            const error = new Error('CSRF token required');
            error.statusCode = 403;
            throw error;
        }
        if (!validateCSRFToken(sessionId, token)) {
            const error = new Error('Invalid CSRF token');
            error.statusCode = 403;
            throw error;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.csrfProtection = csrfProtection;
const addCSRFToken = (req, res, next) => {
    try {
        const sessionId = req.session?.id;
        if (!sessionId) {
            return next();
        }
        const stored = csrfTokens.get(sessionId);
        if (!stored || Date.now() > stored.expires) {
            const token = generateCSRFToken(sessionId);
            req.csrfToken = token;
        }
        else {
            req.csrfToken = stored.token;
        }
        res.setHeader('X-CSRF-Token', req.csrfToken);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.addCSRFToken = addCSRFToken;
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
//# sourceMappingURL=csrf.js.map