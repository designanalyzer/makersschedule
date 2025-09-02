# 🔐 Production Secrets Setup Guide
## Secure Secret Management for Life Planner App

This guide walks you through generating and configuring strong secrets for production deployment.

---

## 🚨 **CRITICAL: Before Production Deployment**

Your app will **NOT START** without proper secrets configured. Follow this guide carefully.

---

## 📋 **Required Secrets**

### **1. JWT Secret** (Required)
- **Purpose**: Signing and verifying JWT tokens
- **Length**: Minimum 32 characters (recommended: 64+)
- **Generation**: Cryptographically secure random

### **2. Session Secret** (Required)
- **Purpose**: Encrypting session data
- **Length**: Minimum 32 characters (recommended: 64+)
- **Generation**: Cryptographically secure random

### **3. CSRF Secret** (Required)
- **Purpose**: CSRF token generation and validation
- **Length**: Minimum 32 characters (recommended: 64+)
- **Generation**: Cryptographically secure random

### **4. Database Password** (If using PostgreSQL)
- **Purpose**: Database authentication
- **Length**: Minimum 16 characters
- **Generation**: Strong password with special characters

---

## 🛠️ **Method 1: Automated Generation (Recommended)**

### **Linux/Mac Users:**
```bash
# Make script executable
chmod +x generate-secrets.sh

# Generate secrets
./generate-secrets.sh
```

### **Windows Users:**
```powershell
# Run PowerShell script
.\generate-secrets.ps1
```

### **What these scripts do:**
- ✅ Generate cryptographically secure secrets
- ✅ Validate secret strength
- ✅ Provide copy-paste ready output
- ✅ Include security best practices

---

## 🛠️ **Method 2: Manual Generation**

### **Using OpenSSL (Linux/Mac):**
```bash
# Generate JWT Secret
echo "JWT_SECRET=$(openssl rand -base64 32)"

# Generate Session Secret  
echo "SESSION_SECRET=$(openssl rand -base64 32)"

# Generate CSRF Secret
echo "CSRF_SECRET=$(openssl rand -base64 32)"

# Generate Database Password
echo "DB_PASSWORD=$(openssl rand -base64 24)"
```

### **Using Node.js:**
```javascript
// Generate secrets using Node.js
const crypto = require('crypto');

console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('SESSION_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('CSRF_SECRET=' + crypto.randomBytes(32).toString('base64'));
console.log('DB_PASSWORD=' + crypto.randomBytes(24).toString('base64'));
```

### **Using Online Generators (Less Secure):**
- [Random.org](https://www.random.org/passwords/)
- [LastPass Password Generator](https://www.lastpass.com/features/password-generator)

---

## 📝 **Configuration Steps**

### **Step 1: Create Production Environment File**
```bash
# Copy example file
cp env.example .env.production

# Edit the file
nano .env.production
```

### **Step 2: Add Generated Secrets**
```env
# Production Environment
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-generated-jwt-secret-here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-generated-session-secret-here

# CSRF Configuration
CSRF_SECRET=your-generated-csrf-secret-here

# Database Configuration (if using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/lifeplanner

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Other production settings...
```

### **Step 3: Validate Configuration**
```bash
# Test that secrets are properly set
node -e "
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  console.error('❌ JWT_SECRET is too weak or missing');
  process.exit(1);
}
console.log('✅ JWT_SECRET is properly configured');
"
```

---

## 🔒 **Security Best Practices**

### **✅ DO:**
- Use different secrets for each environment (dev, staging, prod)
- Generate secrets using cryptographically secure methods
- Store secrets in environment variables, not in code
- Rotate secrets regularly (every 90 days recommended)
- Use secrets management services in production (AWS Secrets Manager, Azure Key Vault, etc.)
- Monitor for secret exposure

### **❌ DON'T:**
- Use the same secrets across environments
- Commit secrets to version control
- Use weak or predictable secrets
- Share secrets via email or chat
- Store secrets in client-side code
- Use default/example secrets

---

## 🚀 **Production Deployment Checklist**

### **Before Deployment:**
- [ ] Generate strong secrets using provided scripts
- [ ] Configure all environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Configure database with strong passwords

### **During Deployment:**
- [ ] Use secrets management service (recommended)
- [ ] Set environment variables securely
- [ ] Verify secrets are not logged
- [ ] Test application startup

### **After Deployment:**
- [ ] Verify application starts without errors
- [ ] Test authentication flows
- [ ] Monitor for security issues
- [ ] Set up secret rotation schedule

---

## 🧪 **Testing Your Configuration**

### **Test 1: Secret Validation**
```bash
# Start the application
npm start

# Check for secret validation errors
# Should see: "✅ Server running on port 3001"
# Should NOT see: "JWT_SECRET must be at least 32 characters"
```

### **Test 2: Authentication Flow**
```bash
# Test user registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Should return JWT token, not error
```

### **Test 3: Session Management**
```bash
# Test session creation
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return session data, not error
```

---

## 🚨 **Troubleshooting**

### **Error: "JWT_SECRET environment variable must be set"**
**Solution:**
1. Check your `.env` file exists
2. Verify `JWT_SECRET=` is set with a value
3. Ensure no spaces around the `=` sign
4. Restart the application

### **Error: "JWT_SECRET must be at least 32 characters long"**
**Solution:**
1. Generate a new, longer secret
2. Use the provided generation scripts
3. Ensure the secret is at least 32 characters

### **Error: "SESSION_SECRET environment variable must be set"**
**Solution:**
1. Check your `.env` file exists
2. Verify `SESSION_SECRET=` is set with a value
3. Ensure no spaces around the `=` sign
4. Restart the application

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your `.env` file format
3. Test with the provided scripts
4. Review security best practices

**Remember:** Strong secrets are your first line of defense. Never compromise on secret security!

---

## 🔄 **Secret Rotation**

### **When to Rotate:**
- Every 90 days (recommended)
- After security incidents
- When team members leave
- After suspected compromise

### **How to Rotate:**
1. Generate new secrets
2. Update environment variables
3. Restart application
4. Monitor for issues
5. Update documentation

**Note:** Rotating secrets will invalidate all existing sessions and tokens. 