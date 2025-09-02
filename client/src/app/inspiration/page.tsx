'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '../../components/AuthModal';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  date: string;
  category: string;
}

export default function InspirationPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-lg blur-sm -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">Maker's Schedule</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">From busy to focused.</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/landing" className="text-gray-500 hover:text-gray-900 text-sm">Home</Link>
              <Link href="/inspiration" className="text-gray-900 font-medium text-sm">Inspiration</Link>
              <button
                type="button"
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="flex items-center space-x-2 text-gray-500 hover:text-brand-purple text-sm transition-colors"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-blue/20">
                  <svg className="w-3 h-3 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
                className="flex items-center space-x-2 px-4 py-2 font-semibold rounded-md shadow transition-colors text-sm bg-brand-purple text-white hover:bg-brand-blue"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 mr-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span>Sign Up</span>
              </button>
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
                <Link href="/landing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Home</Link>
                <Link href="/inspiration" className="block px-3 py-2 text-gray-900 font-medium">Inspiration</Link>
                <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
                <Link href="/login" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link href="/signup" className="flex items-center space-x-2 px-3 py-2 text-brand-purple hover:text-brand-blue font-medium">
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get inspired by what others are building
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Best work is done in sprints. Or projects as we call them. We need deadlines, routines and accountability. Success lies in quality hours you put in.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Manager's vs Maker's Schedule */}
            <Link href="/blog/makers-vs-managers-schedule" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Paul Graham</h3>
                    <p className="text-sm text-gray-500">Founder, Y Combinator</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Maker's vs Manager's Schedule</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  The fundamental difference between how managers and makers organize their time for maximum productivity.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Productivity</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>

            {/* Guillaume Moubeche - Monk Mode */}
            <Link href="/blog/guillaume-moubeche-monk-mode" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Guillaume Moubeche</h3>
                    <p className="text-sm text-gray-500">Founder, Lempire</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Monk Mode: The $50M Strategy</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  How the founder of Lempire used monk mode to build a $50M+ company through intense focus and deep work.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Productivity</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>

            {/* Noah Kagan - Million Dollar Weekend */}
            <Link href="/blog/noah-kagan-million-dollar-weekend" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">N</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Noah Kagan</h3>
                    <p className="text-sm text-gray-500">Founder, AppSumo</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Million Dollar Weekend</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  How Noah Kagan built a million-dollar business in just one weekend through rapid validation and execution.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Entrepreneurship</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>

            {/* Pat Walls - Starter Story */}
            <Link href="/blog/pat-walls-coffee-shop-routine" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Pat Walls</h3>
                    <p className="text-sm text-gray-500">Founder, Starter Story</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Starter Story: 2 Hours in a Coffee Shop</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  How the founder of Starter Story uses daily coffee shop sessions for deep work and strategic thinking.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Entrepreneurship</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>

            {/* Steve Jobs - Think Week */}
            <Link href="/blog/steve-jobs-think-week" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Steve Jobs</h3>
                    <p className="text-sm text-gray-500">Co-founder, Apple</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">Think Week: Deep Reflection for Breakthroughs</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  How Steve Jobs used dedicated think weeks to make Apple's biggest decisions and drive innovation.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Leadership</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>

            {/* Four Burners Theory */}
            <Link href="/blog/four-burners-theory" className="block">
              <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">James Clear</h3>
                    <p className="text-sm text-gray-500">Author, Atomic Habits</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-3">The Four Burners Theory</h4>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Understanding the fundamental trade-off between work, health, family, and friends.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Productivity</span>
                  <span className="text-sm text-gray-400">Click to read</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to join these builders?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of creators, developers, and builders who are making progress every day with Maker's Schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 rounded-md font-medium transition-colors shadow gap-2 bg-brand-purple text-white hover:bg-brand-blue"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Post Modal */}
      {isModalOpen && selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{selectedPost.author.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedPost.author}</h3>
                    <p className="text-sm text-gray-500">{selectedPost.date} • {selectedPost.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedPost.title}</h2>
              <p className="text-xl text-gray-600 mb-8">{selectedPost.description}</p>
              
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  {selectedPost.content.split('\n\n').map((section, index) => {
                    const lines = section.trim().split('\n');
                    const title = lines[0];
                    const content = lines.slice(1).join('\n');
                    
                    return (
                      <div key={index}>
                        <h3 className="text-xl font-medium text-gray-900 mb-4">{title}</h3>
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-8">
                          {content}
                        </div>
                        {index < selectedPost.content.split('\n\n').length - 1 && index > 0 && (
                          <div className="w-full h-px bg-green-200 my-8"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // TODO: Redirect to dashboard after successful auth
          console.log('Auth successful!');
        }}
      />

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Maker's Schedule. Built for creators, developers, and builders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 