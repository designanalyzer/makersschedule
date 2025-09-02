# 🛡️ CSRF Protection Implementation Guide

This document explains the Cross-Site Request Forgery (CSRF) protection implemented in the Life Planner app.

---

## 🔍 **What is CSRF?**

Cross-Site Request Forgery (CSRF) is an attack where malicious websites trick authenticated users into performing unwanted actions on your application. For example:

- A user is logged into your app in one tab
- They visit a malicious site in another tab
- The malicious site makes a request to your app using the user's session
- Your app processes the request as if it came from the user

---

## 🏗️ **Implementation Overview**

### **Backend Protection (Express.js)**
- **Token Generation**: Cryptographically secure CSRF tokens
- **Token Validation**: Server-side validation of all state-changing requests
- **Session Binding**: Tokens are bound to user sessions
- **Automatic Cleanup**: Expired tokens are automatically removed

### **Frontend Protection (Next.js)**
- **Token Management**: Automatic token retrieval and caching
- **Request Interception**: All API calls include CSRF tokens
- **Error Handling**: Graceful handling of token validation failures

---

## 🔧 **Backend Implementation**

### **CSRF Middleware (`src/middleware/csrf.ts`)**

```typescript
// Generate CSRF token
export function generateCSRFToken(sessionId: string): string

// Validate CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean

// CSRF protection middleware
export const csrfProtection = (req, res, next) => void

// Add CSRF token to response
export const addCSRFToken = (req, res, next) => void
```

### **Key Features:**
- ✅ **Cryptographically Secure**: Uses `crypto.randomBytes(32)` for token generation
- ✅ **Session-Bound**: Tokens are tied to user sessions
- ✅ **Time-Limited**: Tokens expire after 24 hours
- ✅ **Automatic Cleanup**: Expired tokens are removed hourly
- ✅ **Flexible Input**: Accepts tokens from headers or request body

### **Protected Routes:**
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/subscriptions/*` - Subscription management
- `/api/analytics/*` - Analytics endpoints
- `/api/dashboard/*` - Dashboard endpoints

### **Exempt Routes:**
- `/api/csrf/token` - CSRF token endpoint
- `/health` - Health check endpoint
- All GET requests (read-only operations)

---

## 🎨 **Frontend Implementation**

### **CSRF Manager (`client/src/utils/csrf.ts`)**

```typescript
// Main CSRF manager
export const csrfManager = new CSRFManager()

// Convenience API methods
export const csrfApi = {
  get: <T>(url: string, options?: RequestInit): Promise<T>
  post: <T>(url: string, data?: any, options?: RequestInit): Promise<T>
  put: <T>(url: string, data?: any, options?: RequestInit): Promise<T>
  delete: <T>(url: string, options?: RequestInit): Promise<T>
  patch: <T>(url: string, data?: any, options?: RequestInit): Promise<T>
}
```

### **Key Features:**
- ✅ **Automatic Token Management**: Fetches and caches tokens automatically
- ✅ **Request Interception**: All API calls include CSRF tokens
- ✅ **Error Recovery**: Handles token validation failures gracefully
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Session Persistence**: Uses credentials for session management

---

## 🚀 **Usage Examples**

### **Making Protected API Calls**

```typescript
import { csrfApi } from '@/utils/csrf';

// GET request
const users = await csrfApi.get<User[]>('/api/users');

// POST request
const newUser = await csrfApi.post<User>('/api/users', {
  email: 'user@example.com',
  name: 'John Doe'
});

// PUT request
const updatedUser = await csrfApi.put<User>(`/api/users/${id}`, {
  name: 'Jane Doe'
});

// DELETE request
await csrfApi.delete(`/api/users/${id}`);
```

### **Manual Token Management**

```typescript
import { csrfManager } from '@/utils/csrf';

// Get token manually
const token = await csrfManager.getToken();

// Make custom request
const response = await fetch('/api/custom-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token
  },
  credentials: 'include',
  body: JSON.stringify(data)
});

// Clear token (useful for logout)
csrfManager.clearToken();
```

---

## 🔒 **Security Features**

### **Token Security:**
- **Cryptographic Strength**: 256-bit random tokens
- **Session Binding**: Tokens are tied to specific sessions
- **Time Limitation**: 24-hour expiration
- **Single Use**: Each token is validated once per request

### **Request Security:**
- **Header Validation**: Checks `X-CSRF-Token` header
- **Body Validation**: Checks `_csrf` field in request body
- **Method Filtering**: Only protects state-changing methods (POST, PUT, DELETE, PATCH)
- **Origin Validation**: Works with CORS configuration

### **Error Handling:**
- **Graceful Degradation**: Clear error messages for token issues
- **Automatic Retry**: Client can retry with fresh token
- **Session Validation**: Ensures valid session before token generation

---

## 🧪 **Testing CSRF Protection**

### **Test 1: Valid Token**
```bash
# Get CSRF token
curl -c cookies.txt -b cookies.txt http://localhost:3001/api/csrf/token

# Use token in request
curl -c cookies.txt -b cookies.txt \
  -H "X-CSRF-Token: YOUR_TOKEN_HERE" \
  -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### **Test 2: Invalid Token**
```bash
# Request without token (should fail)
curl -c cookies.txt -b cookies.txt \
  -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
# Expected: 403 Forbidden
```

### **Test 3: Expired Token**
```bash
# Use old token (should fail)
curl -c cookies.txt -b cookies.txt \
  -H "X-CSRF-Token: OLD_TOKEN" \
  -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
# Expected: 403 Forbidden
```

---

## 🔧 **Configuration**

### **Environment Variables:**
```env
# CSRF Protection
CSRF_SECRET=your-super-secure-csrf-secret-key-here-minimum-32-characters
```

### **Server Configuration:**
```typescript
// Add CSRF middleware to all routes
app.use(addCSRFToken);

// Protect specific routes
app.use('/api/protected', csrfProtection, protectedRoutes);
```

### **Client Configuration:**
```typescript
// No additional configuration needed
// CSRF protection is automatic for all API calls
```

---

## 🚨 **Important Notes**

### **Supabase Integration:**
- The app primarily uses Supabase for data operations
- Supabase has built-in CSRF protection
- Express backend CSRF protection is for additional security
- Both systems work together for comprehensive protection

### **Session Requirements:**
- CSRF protection requires valid user sessions
- Anonymous requests are not protected (by design)
- Session cookies must be enabled

### **Performance Impact:**
- Minimal overhead (single token validation per request)
- Tokens are cached for 23 hours on client
- Automatic cleanup prevents memory leaks

---

## 🔄 **Token Lifecycle**

1. **Generation**: Token created when user session starts
2. **Storage**: Token stored in server memory (session-bound)
3. **Distribution**: Token sent to client via `/api/csrf/token`
4. **Caching**: Client caches token for 23 hours
5. **Validation**: Token validated on each protected request
6. **Expiration**: Token expires after 24 hours
7. **Cleanup**: Expired tokens removed automatically

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

**"CSRF token required" error:**
- Ensure session is valid
- Check that token is included in request headers
- Verify token hasn't expired

**"Invalid CSRF token" error:**
- Token may have expired
- Session may have changed
- Clear client-side token cache

**Token not being sent:**
- Check that `credentials: 'include'` is set
- Verify session cookies are enabled
- Ensure proper CORS configuration

### **Debug Mode:**
```typescript
// Enable debug logging
console.log('CSRF Token:', await csrfManager.getToken());
```

---

## 📚 **Additional Resources**

- [OWASP CSRF Prevention](https://owasp.org/www-community/attacks/csrf)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

## ✅ **Security Checklist**

- [ ] CSRF_SECRET is properly configured (32+ characters)
- [ ] All state-changing endpoints are protected
- [ ] Tokens are cryptographically secure
- [ ] Token expiration is properly configured
- [ ] Client-side token management is working
- [ ] Error handling is graceful
- [ ] Session management is secure
- [ ] CORS is properly configured
- [ ] Security headers are enabled
- [ ] Regular security testing is performed 