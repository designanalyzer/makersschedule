# 📧 Supabase Email Verification Setup Guide

This guide explains how to configure Supabase email verification for the LifePlanner app.

## 🔧 **Supabase Dashboard Configuration**

### 1. **Enable Email Confirmation**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Under **User Signups**, enable **Enable email confirmations**
5. Save the changes

### 2. **Configure Email Templates**

1. In the same **Authentication** → **Settings** page
2. Scroll down to **Email Templates**
3. Customize the **Confirm signup** template if desired
4. The default template will work fine

### 3. **Set Site URL**

1. In **Authentication** → **Settings**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. For development, you can leave it as `http://localhost:3000`

### 4. **Configure Redirect URLs**

1. In **Authentication** → **Settings**
2. Under **Redirect URLs**, add:
   - `http://localhost:3000/verify-email` (for development)
   - `https://yourdomain.com/verify-email` (for production)

## 🔄 **How It Works**

### **Signup Flow:**
1. User fills out signup form
2. Supabase sends verification email automatically
3. User clicks link in email
4. User is redirected to `/verify-email` page
5. Page verifies the token and activates account
6. User is redirected to onboarding

### **Login Flow:**
1. User tries to login
2. If email not verified, shows error message
3. User can click "Resend verification" link
4. New verification email is sent

### **Resend Verification:**
1. User clicks "Resend verification" in login modal
2. Enters email address
3. New verification email is sent
4. User can then verify and login

## 🛡️ **Security Features**

- ✅ **Email Confirmation Required**: Users must verify email before accessing app
- ✅ **Secure Tokens**: Supabase handles token generation and validation
- ✅ **Time-Limited Links**: Verification links expire automatically
- ✅ **Single Use**: Each verification link can only be used once
- ✅ **Rate Limiting**: Built-in protection against spam

## 🧪 **Testing**

### **Test Signup:**
1. Go to your app
2. Click "Sign up"
3. Enter email and password
4. Check your email for verification link
5. Click the link
6. Should redirect to verification page, then onboarding

### **Test Unverified Login:**
1. Try to login with unverified account
2. Should see error: "Please verify your email address before logging in"
3. Click "Resend verification" link
4. Enter email and resend
5. Check email for new verification link

## 🚨 **Important Notes**

### **Development vs Production:**
- **Development**: Uses `http://localhost:3000` URLs
- **Production**: Must use HTTPS URLs
- **Email Templates**: Can be customized in Supabase dashboard

### **Email Service:**
- Supabase uses their built-in email service
- No need for external services like Resend
- Emails are sent from `noreply@supabase.io` by default
- Can be customized with your own domain

### **Troubleshooting:**
- **Emails not sending**: Check Supabase dashboard for email limits
- **Links not working**: Verify redirect URLs are configured correctly
- **Verification failing**: Check browser console for errors

## 📚 **Additional Resources**

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Redirect URLs Configuration](https://supabase.com/docs/guides/auth/auth-redirect-urls)
