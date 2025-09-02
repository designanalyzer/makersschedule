# 🚀 Quick Email Setup - 2 Minutes

## Step 1: Enable Email Confirmation in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `okbuuzrovceswziutgof`
3. Go to **Authentication** → **Settings**
4. Scroll down to **User Signups**
5. **Enable "Enable email confirmations"** ✅
6. Click **Save**

## Step 2: Add Redirect URL

1. In the same **Authentication** → **Settings** page
2. Scroll to **Redirect URLs**
3. Add: `http://localhost:3000/verify-email`
4. Click **Save**

## Step 3: Test

1. Go to your app: http://localhost:3000
2. Click "Sign up"
3. Enter email and password
4. Check your email for verification link
5. Click the link
6. Should redirect to onboarding page

## That's it! 🎉

The email confirmation will now work exactly like your other app:
- User signs up → Gets email → Clicks link → Goes to onboarding
