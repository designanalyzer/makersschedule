'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../components/AuthGuard';

export default function OnboardingPage() {
  const router = useRouter();

  const handleReady = () => {
    router.push('/projects');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#DAFF7D] to-[#A3C900] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Maker's Schedule!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You're about to discover a completely different way to organize your time and achieve meaningful progress.
            </p>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">The Maker's Philosophy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Traditional calendars are built for managers who schedule hour-long meetings. But you're a <strong>maker</strong> - a creator, developer, or builder who needs <strong>uninterrupted blocks of time</strong> to do your best work.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
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
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
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

        {/* Real-World Examples */}
        <div className="space-y-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How Real Makers Use This 🛠️
          </h2>

          {/* Musician Example */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎵</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Independent Musician</h3>
                                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This musician is recording their debut album while teaching music lessons. They use <strong>Projects</strong> to track album production and lesson planning, <strong>Calendar</strong> to block 3-hour studio sessions, and <strong>Notes</strong> to capture song ideas and lesson notes.
                  </p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">📅 Their Typical Week:</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <div><strong>Monday:</strong> 9-12am (Studio Recording) | 2-5pm (Music Lessons)</div>
                    <div><strong>Tuesday:</strong> 9-12am (Songwriting) | 1-3pm (Lesson Prep)</div>
                    <div><strong>Wednesday:</strong> 9-11am (Mixing/Mastering) | 2-4pm (Student Recitals)</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Their Secret:</h4>
                  <p className="text-sm text-gray-700">
                    "I never schedule lessons during my morning creative blocks. That's when my musical ideas flow best."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Writer Example */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">✍️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Technical Writer</h3>
                                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This writer creates documentation and blog posts. They use <strong>Projects</strong> to track book and article deadlines, <strong>Calendar</strong> to schedule 2-hour writing blocks, and <strong>Notes</strong> to capture research and outline ideas.
                  </p>
                
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2">📅 Their Writing Schedule:</h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <div><strong>Monday:</strong> 8-10am (Book Chapter) | 2-4pm (Blog Research)</div>
                    <div><strong>Tuesday:</strong> 9-11am (Book Chapter) | 1-3pm (Article Writing)</div>
                    <div><strong>Wednesday:</strong> 10-12am (Editing) | 2-4pm (Client Documentation)</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Their Secret:</h4>
                  <p className="text-sm text-gray-700">
                    "I write in the morning when my mind is fresh, and do research/editing in the afternoon."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Designer Example */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">🎨</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">UI/UX Designer</h3>
                                  <p className="text-gray-600 mb-4 leading-relaxed">
                    This designer creates mobile apps and websites. They use <strong>Projects</strong> to track client projects and personal portfolio work, <strong>Calendar</strong> to block 4-hour design sessions, and <strong>Notes</strong> to sketch ideas and track design decisions.
                  </p>
                
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-purple-900 mb-2">📅 Their Design Flow:</h4>
                  <div className="text-sm text-purple-800 space-y-2">
                    <div><strong>Monday:</strong> 9-1pm (Client App Design) | 2-4pm (Client Feedback)</div>
                    <div><strong>Tuesday:</strong> 9-1pm (Portfolio Website) | 2-4pm (Design Research)</div>
                    <div><strong>Wednesday:</strong> 10-2pm (Client App Iterations) | 3-5pm (Design Systems)</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">💡 Their Secret:</h4>
                  <p className="text-sm text-gray-700">
                    "I need long blocks to get into the design flow. Short sessions just don't work for creative work."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Principles */}
        <div className="mb-16">
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

        {/* Ready Button */}
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Start Building? 🚀
            </h2>
            <p className="text-gray-600">
              Let's create your first project and start making real progress.
            </p>
          </div>
          
          <button
            onClick={handleReady}
            className="inline-flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>I'm Ready!</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
} 