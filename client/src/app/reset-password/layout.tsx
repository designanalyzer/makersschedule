'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '../../components/layout/Footer';

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as landing page */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#C70D3A]/20 to-[#ED5107]/20 rounded-lg blur-sm -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">Maker's Schedule</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">From busy to focused.</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/landing" className="text-gray-900 font-medium text-sm">Home</Link>
              <Link href="/inspiration" className="text-gray-500 hover:text-gray-900 text-sm">Inspiration</Link>
              <Link href="/landing" className="flex items-center space-x-2 text-gray-500 hover:text-[#A3C900] text-sm transition-colors">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: '#DAFF7D' }}>
                  <svg className="w-3 h-3" style={{ color: '#A3C900' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </span>
                <span>Sign In</span>
              </Link>
              <Link href="/landing" className="flex items-center space-x-2 px-4 py-2 font-semibold rounded-md shadow transition-colors text-sm"
                style={{ backgroundColor: '#DAFF7D', color: '#222' }}>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-80 mr-1">
                  <svg className="w-3 h-3" style={{ color: '#A3C900' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span>Sign Up</span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                <Link href="/landing" className="block px-3 py-2 text-gray-900 font-medium">Home</Link>
                <Link href="/inspiration" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Inspiration</Link>
                <Link href="/landing" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link href="/landing" className="flex items-center space-x-2 px-3 py-2 text-[#A3C900] hover:text-[#DAFF7D] font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
} 