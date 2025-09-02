'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const isAdmin = user?.email === 'hello.emprove@gmail.com'; // Only show design system for admin user

  const navigation = [
    { name: 'Clients', href: '/projects' },
    { name: 'Calendar', href: '/' },
    { name: 'Notes', href: '/notes' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/landing';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const fullName = user.user_metadata?.full_name || user.email || '';
    return fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 bg-black rounded-sm"></div>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-lg blur-sm -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tight">Maker's Schedule</span>
                <span className="text-xs text-gray-300 font-medium tracking-wide hidden sm:block">From busy to focused.</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  pathname === item.href
                    ? 'text-white bg-brand-purple/20 ring-1 ring-brand-purple/30 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-brand-blue/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-blue/20 transition-all duration-200 border border-white/20"
              >
                <span className="text-sm font-medium text-white">{getUserInitials()}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-[#222] hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <>
                        <Link
                          href="/design-system"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-[#222] hover:bg-gray-100"
                        >
                          Design System
                        </Link>
                        <Link
                          href="/onboarding"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-[#222] hover:bg-gray-100"
                        >
                          Onboarding
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#222] hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-white bg-brand-purple/20 ring-1 ring-brand-purple/30 backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white hover:bg-brand-blue/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-700 pt-4">
              <div className="px-3 py-2 text-sm text-gray-300">
                <p className="font-medium">{getUserDisplayName()}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 