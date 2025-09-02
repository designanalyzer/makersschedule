'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check for errors in URL hash first
        const hash = window.location.hash;
        if (hash.includes('error=')) {
          const errorParams = new URLSearchParams(hash.substring(1));
          const error = errorParams.get('error');
          const errorCode = errorParams.get('error_code');
          const errorDescription = errorParams.get('error_description');
          
          console.log('Error in URL hash:', { error, errorCode, errorDescription });
          
          if (errorCode === 'otp_expired') {
            setStatus('error');
            setMessage('Email verification link has expired. Please request a new verification email.');
            return;
          } else if (error === 'access_denied') {
            setStatus('error');
            setMessage('Verification link is invalid. Please request a new verification email.');
            return;
          }
        }
        
        // Get the token from URL parameters - Supabase might use different parameter names
        const token = searchParams.get('token') || searchParams.get('access_token') || searchParams.get('token_hash');
        const type = searchParams.get('type') || searchParams.get('token_type');
        
        console.log('Verification params:', { token, type });
        console.log('All search params:', Object.fromEntries(searchParams.entries()));
        
        if (!token) {
          setStatus('error');
          setMessage('No verification token found. Please check your email link.');
          return;
        }

        // Try to verify the email with Supabase
        let verificationResult;
        try {
          verificationResult = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });
        } catch (verifyError) {
          console.error('Verification attempt failed:', verifyError);
          // Try alternative verification method
          try {
            verificationResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email'
            });
          } catch (altError) {
            console.error('Alternative verification also failed:', altError);
            setStatus('error');
            setMessage('Verification failed. Please request a new verification email.');
            return;
          }
        }

        const { data, error } = verificationResult;

        console.log('Verification result:', { data, error });

        if (error) {
          console.error('Email verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Email verification failed. Please try again.');
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Email verified successfully! Welcome to LifePlanner!');
          
          // Redirect to onboarding after a short delay
          setTimeout(() => {
            router.push('/onboarding');
          }, 3000);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email Verified!</h3>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-2 text-sm text-gray-500">Redirecting to onboarding...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Failed</h3>
              <p className="mt-2 text-gray-600">{message}</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push('/landing')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
