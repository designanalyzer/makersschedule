# Secret Generation Script for Life Planner App (PowerShell)
# This script generates strong, cryptographically secure secrets for production

Write-Host "🔐 Generating Production Secrets for Life Planner App" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

# Function to generate random base64 string
function Generate-RandomBase64 {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $rng.Dispose()
    return [Convert]::ToBase64String($bytes)
}

Write-Host "✅ Generating JWT Secret..." -ForegroundColor Yellow
$JWT_SECRET = Generate-RandomBase64 32
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Generating Session Secret..." -ForegroundColor Yellow
$SESSION_SECRET = Generate-RandomBase64 32
Write-Host "SESSION_SECRET=$SESSION_SECRET" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Generating Database Password (if needed)..." -ForegroundColor Yellow
$DB_PASSWORD = Generate-RandomBase64 32
Write-Host "DB_PASSWORD=$DB_PASSWORD" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Copy these secrets to your .env file:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor White
Write-Host "SESSION_SECRET=$SESSION_SECRET" -ForegroundColor White
Write-Host "DB_PASSWORD=$DB_PASSWORD" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT SECURITY NOTES:" -ForegroundColor Red
Write-Host "============================" -ForegroundColor Red
Write-Host "1. Store these secrets securely - never commit them to version control" -ForegroundColor Yellow
Write-Host "2. Use different secrets for each environment (dev, staging, prod)" -ForegroundColor Yellow
Write-Host "3. Rotate secrets regularly (recommended: every 90 days)" -ForegroundColor Yellow
Write-Host "4. Use a secrets management service in production" -ForegroundColor Yellow
Write-Host "5. Ensure your .env file is in .gitignore" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔒 Additional Security Recommendations:" -ForegroundColor Blue
Write-Host "======================================" -ForegroundColor Blue
Write-Host "- Use HTTPS in production" -ForegroundColor White
Write-Host "- Set up proper CORS origins" -ForegroundColor White
Write-Host "- Implement rate limiting" -ForegroundColor White
Write-Host "- Add security monitoring" -ForegroundColor White
Write-Host "- Regular security audits" -ForegroundColor White
Write-Host ""

Write-Host "✅ Secret generation complete!" -ForegroundColor Green 