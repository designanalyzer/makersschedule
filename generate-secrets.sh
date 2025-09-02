#!/bin/bash

# Secret Generation Script for Life Planner App
# This script generates strong, cryptographically secure secrets for production

echo "🔐 Generating Production Secrets for Life Planner App"
echo "=================================================="
echo ""

# Check if openssl is available
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl is not installed. Please install it first."
    exit 1
fi

echo "✅ Generating JWT Secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

echo "✅ Generating Session Secret..."
SESSION_SECRET=$(openssl rand -base64 32)
echo "SESSION_SECRET=$SESSION_SECRET"
echo ""

echo "✅ Generating Database Password (if needed)..."
DB_PASSWORD=$(openssl rand -base64 32)
echo "DB_PASSWORD=$DB_PASSWORD"
echo ""

echo "📝 Copy these secrets to your .env file:"
echo "========================================"
echo "JWT_SECRET=$JWT_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
echo "DB_PASSWORD=$DB_PASSWORD"
echo ""

echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "============================"
echo "1. Store these secrets securely - never commit them to version control"
echo "2. Use different secrets for each environment (dev, staging, prod)"
echo "3. Rotate secrets regularly (recommended: every 90 days)"
echo "4. Use a secrets management service in production"
echo "5. Ensure your .env file is in .gitignore"
echo ""

echo "🔒 Additional Security Recommendations:"
echo "======================================"
echo "- Use HTTPS in production"
echo "- Set up proper CORS origins"
echo "- Implement rate limiting"
echo "- Add security monitoring"
echo "- Regular security audits"
echo ""

echo "✅ Secret generation complete!" 