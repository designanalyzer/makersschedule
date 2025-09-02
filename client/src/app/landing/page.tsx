'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '../../components/AuthModal';

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <Link href="/landing" className="text-gray-900 font-medium text-sm">Home</Link>
              <Link href="/inspiration" className="text-gray-500 hover:text-gray-900 text-sm">Inspiration</Link>
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
                <Link href="/landing" className="block px-3 py-2 text-gray-900 font-medium">Home</Link>
                <Link href="/inspiration" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Inspiration</Link>
                <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
                <Link href="/login" className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link href="/signup" className="flex items-center space-x-2 px-3 py-2 text-[#A3C900] hover:text-[#DAFF7D] font-medium">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Don't spend your best brain in busywork.<br />
              Start building things.
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Too often our calendars suddenly start shifting to manager schedules, full of ad-hoc work and random meetings. But you're a <strong>maker</strong> - a creator, developer, or builder who needs <strong>uninterrupted blocks of time</strong> to do your best work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center justify-center px-8 py-4 rounded-md font-medium transition-colors shadow gap-2 bg-brand-purple text-white hover:bg-brand-blue"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                Get Started Free
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-brand-purple font-medium transition-colors"
                onClick={() => setIsLearnMoreOpen(true)}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue/20">
                  <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

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

      {/* Philosophy Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The Maker's Philosophy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Take back control of your days. Either you run your day or the day runs you. What you need, is to block 2-4 hour chunks of time, turn off notifications, create your focus zone, and amazing things start to happen.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">❌</span>
                  <h3 className="font-semibold text-gray-900">Manager's Schedule</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Hour-long blocks for meetings</li>
                  <li>• Constant interruptions</li>
                  <li>• Reactive, not productive</li>
                  <li>• Built for coordination</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">✅</span>
                  <h3 className="font-semibold text-gray-900">Maker's Schedule</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Half-day blocks for deep work</li>
                  <li>• Protected focus time</li>
                  <li>• Proactive and productive</li>
                  <li>• Built for creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your Three Core Tools 🛠️
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to turn your big ideas into reality. No complexity, just focused tools that work. Even when you have multiple projects going on simultaneously.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Projects Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Projects</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This is where you define what you're building. Think of projects as your <strong>north star</strong> - the big things you want to accomplish. Each project should have clear milestones and deadlines.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 How to use it:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Create 2-3 active projects maximum</li>
                      <li>• Break each project into specific milestones</li>
                      <li>• Set realistic deadlines (weeks, not days)</li>
                      <li>• Review progress weekly</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Example Project:</h4>
                    <p className="text-sm text-gray-700">
                      <strong>"Build a SaaS Dashboard"</strong><br/>
                      Milestones: Design UI → Build backend → Add analytics → Launch beta
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📅</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Calendar</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This is your <strong>weekly battle plan</strong>. Instead of scheduling meetings, you're scheduling <strong>deep work sessions</strong>. Each block represents focused time to move your projects forward.
                  </p>
                  
                  <div className="bg-brand-blue/10 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-brand-blue mb-2">💡 How to use it:</h4>
                    <ul className="text-sm text-brand-blue space-y-1">
                      <li>• Block 2-4 hour sessions for each project</li>
                      <li>• Use different colors for different project types</li>
                      <li>• Leave buffer time between sessions</li>
                      <li>• Plan your week on Sunday or Monday</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📅 Example Schedule:</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Monday:</strong> 9-12am (SaaS Dashboard) | 2-4pm (Marketing Site)<br/>
                      <strong>Tuesday:</strong> 9-11am (SaaS Dashboard) | 1-3pm (Client Work)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Notes</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Your <strong>thinking space</strong>. Capture ideas, work through problems, and document your progress. This is where you process your thoughts and plan your next moves.
                  </p>
                  
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-purple-900 mb-2">💡 How to use it:</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Write daily reflections on your progress</li>
                      <li>• Capture ideas that come during deep work</li>
                      <li>• Work through technical problems</li>
                      <li>• Document decisions and their reasoning</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📝 Example Notes:</h4>
                    <p className="text-sm text-gray-700">
                      <strong>"SaaS Dashboard Ideas"</strong><br/>
                      - Need user analytics section<br/>
                      - Consider dark mode toggle<br/>
                      - Research competitor features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Principles */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            🚀 Success Principles
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Focus on Few</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Work on 2-3 projects maximum. More projects = less progress on each. 
                    <span className="block mt-2 text-sm text-gray-500">
                      <strong>Why it works:</strong> Deep focus on fewer things produces better results than scattered attention across many.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⏰</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Protect Your Time</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Block 2-4 hour sessions. Turn off notifications. Create your focus zone.
                    <span className="block mt-2 text-sm text-gray-500">
                      <strong>Why it works:</strong> Uninterrupted time allows your brain to reach deep focus states where breakthrough work happens.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📈</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Measure Progress</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Track your weekly hours. Celebrate milestones. Learn from setbacks.
                    <span className="block mt-2 text-sm text-gray-500">
                      <strong>Why it works:</strong> What gets measured gets improved. Regular tracking keeps you accountable and motivated.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Ready to Start Section */}
      <section className="bg-black py-16 w-full">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center rounded-2xl shadow-2xl" style={{ background: 'black' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Building? 🚀</h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl">Let's create your first project and start making real progress. It only takes a minute to get started!</p>
          <button
            onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
            className="px-10 py-4 bg-brand-purple text-white font-bold rounded-lg shadow-lg text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple flex items-center gap-2 hover:bg-brand-blue"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            I'm Ready!
          </button>
        </div>
      </section>

      {/* Learn More Modal */}
      {isLearnMoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
              onClick={() => setIsLearnMoreOpen(false)}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What can you do with Maker's Schedule?</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-blue/20">
                  <svg className="w-7 h-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Set and achieve your projects</div>
                  <div className="text-gray-600 text-sm">Break down big dreams into actionable steps, set deadlines, and track your progress visually.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-blue/20">
                  <svg className="w-7 h-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Plan your week for deep work</div>
                  <div className="text-gray-600 text-sm">Drag and drop tasks into your calendar, block out focus hours, and build a routine that sticks.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-blue/20">
                  <svg className="w-7 h-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                <div>
                  <div className="font-bold text-gray-900 mb-1">Capture ideas instantly</div>
                  <div className="text-gray-600 text-sm">Jot down thoughts, meeting notes, or next steps—no friction, just a plain note that works.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 