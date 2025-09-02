'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { userPreferencesService } from '../services/userPreferencesService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'resend'>('login');
  const isLogin = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';
  const isResend = mode === 'resend';
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode === 'login' ? 'login' : 'signup');
      setError(null);
      setSuccess(null);
    }
  }, [defaultMode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (isForgot) {
        // Forgot password flow
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
          // Add a custom email body if supported
        });

        if (resetError) {
          throw new Error(resetError.message);
        }

        setSuccess('Password reset email sent! Please check your email (and spam folder) for instructions.');
        setTimeout(() => {
          setMode('login');
          setFormData({
            fullName: '',
            email: '',
            password: '',
            rememberMe: false
          });
        }, 3000);
      } else if (isResend) {
        // Resend verification email flow
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: formData.email
        });

        if (resendError) {
          throw new Error(resendError.message);
        }

        setSuccess('Verification email sent! Please check your email (and spam folder) for the verification link.');
        setTimeout(() => {
          setMode('login');
          setFormData({
            fullName: '',
            email: '',
            password: '',
            rememberMe: false
          });
        }, 3000);
      } else if (isSignup) {
        // Sign up flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            }
          }
        });

        if (signUpError) {
          throw new Error(signUpError.message);
        }

        if (data.user) {
          // Go straight to onboarding - no email verification required
          setSuccess('Welcome to Maker\'s Schedule. Go to your inbox and confirm your email. Message can take few minutes to arrive.');
          // Don't close modal yet - let user see success message
          setTimeout(() => {
            if (onSuccess) {
              onSuccess();
            }
            onClose();
            // Redirect to onboarding page after successful signup
            window.location.href = '/onboarding';
          }, 6000);
        }
      } else {
        // Login flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          throw new Error(signInError.message);
        }

        if (data.user) {
          // No email verification required
          setSuccess('Login successful! Welcome back.');
          setTimeout(async () => {
            if (onSuccess) {
              onSuccess();
            }
            onClose();
            
            // Get user's default page preference
            try {
              const isMobile = window.innerWidth < 768;
              const defaultPage = await userPreferencesService.getDefaultPage(data.user.id, isMobile);
              window.location.href = `/${defaultPage === 'calendar' ? '' : defaultPage}`;
            } catch (error) {
              // Silently fallback to calendar page without showing error
              console.log('Using fallback redirect to calendar page');
              window.location.href = '/';
            }
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setMode(isLogin ? 'signup' : 'login');
    setFormData({
      fullName: '',
      email: '',
      password: '',
      rememberMe: false
    });
    setError(null);
    setSuccess(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isForgot ? 'Reset Password' : isResend ? 'Resend Verification' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600">
            {isForgot ? 'Enter your email to receive reset instructions' : isResend ? 'Enter your email to resend verification link' : isLogin ? 'Sign in to your account' : 'Start your productivity journey'}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-brand-blue/10 border border-brand-blue/30 rounded-lg">
            <p className="text-brand-blue text-sm">{success}</p>
          </div>
        )}
        


        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your full name"
                required={isSignup}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          {!isForgot && !isResend && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required={!isForgot}
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button 
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm font-bold text-black"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed bg-brand-purple text-white hover:bg-brand-blue"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isForgot ? 'Sending Reset Email...' : isResend ? 'Sending Verification...' : isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                {isForgot ? 'Send Reset Email' : isResend ? 'Resend Verification' : isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        {/* Toggle between login/signup/forgot/resend */}
        <div className="mt-6 text-center">
          {isForgot ? (
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-black"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          ) : isResend ? (
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-black"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={handleToggleMode}
                  className="font-bold text-black"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              {isLogin && (
                <p className="text-gray-600">
                  Need to verify your email?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('resend')}
                    className="font-bold text-black"
                    disabled={isLoading}
                  >
                    Resend verification
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 