'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DesignSystemPage() {
  const router = useRouter();
  const isAdmin = true; // TODO: Replace with actual admin check from auth context

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Design System</h1>
              <p className="text-gray-600">Component library and design tokens for Maker's Schedule</p>
            </div>
            <div className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium">
              Admin Only
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Brand */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Brand</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
                        <div className="w-7 h-7 bg-white/90 rounded-sm"></div>
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-lg blur-sm -z-10"></div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-gray-900 tracking-tight">
                        Maker's Schedule
                      </div>
                      <p className="text-sm text-gray-500">Primary logo with glow effect</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Typography</h3>
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900">
                        Outfit Font - All Text
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">Used for ALL text in the app - headings, body, UI elements</p>
                      <p className="text-sm text-gray-500">Font weights: 400, 500, 600, 700</p>
                    </div>
                    <div>
                      <p className="text-base text-gray-900">Body text - This is the default body text using Outfit font.</p>
                      <p className="text-sm text-gray-500 mt-1">Default font for everything in the app</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Colors</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="w-full h-16 bg-brand-dark rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Brand Dark</p>
                      <p className="text-xs text-gray-500">#181818</p>
                      <p className="text-xs text-gray-500">Hero/nav background</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-brand-purple rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Brand Purple</p>
                      <p className="text-xs text-gray-500">#8758FF</p>
                      <p className="text-xs text-gray-500">Primary highlights</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-brand-blue rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Brand Blue</p>
                      <p className="text-xs text-gray-500">#5CB8E4</p>
                      <p className="text-xs text-gray-500">Secondary highlights</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-brand-light rounded-md mb-2 border border-gray-200"></div>
                      <p className="text-sm font-medium text-gray-900">Brand Light</p>
                      <p className="text-xs text-gray-500">#F2F2F2</p>
                      <p className="text-xs text-gray-500">Light surfaces</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">UI Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="w-full h-16 bg-black rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Black</p>
                      <p className="text-xs text-gray-500">#000000</p>
                      <p className="text-xs text-gray-500">Primary buttons</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-gray-900 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Gray 900</p>
                      <p className="text-xs text-gray-500">#111827</p>
                      <p className="text-xs text-gray-500">Headings</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-gray-100 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">Gray 100</p>
                      <p className="text-xs text-gray-500">#F3F4F6</p>
                      <p className="text-xs text-gray-500">Backgrounds</p>
                    </div>
                    <div>
                      <div className="w-full h-16 bg-white border border-gray-200 rounded-md mb-2"></div>
                      <p className="text-sm font-medium text-gray-900">White</p>
                      <p className="text-xs text-gray-500">#FFFFFF</p>
                      <p className="text-xs text-gray-500">Cards</p>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Buttons</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2">
                      Primary (Purple)
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-purple focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2">
                      Secondary (Blue)
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2">
                      Success (Green)
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2">
                      Tertiary
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-brand-purple rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2">
                      Small
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2">
                      Default
                    </button>
                    <button className="px-6 py-3 text-base font-medium text-white bg-brand-purple rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2">
                      Large
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Elements */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Elements</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Input
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    placeholder="Enter text..."
                  />
                  <p className="text-sm text-gray-500 mt-1">Standard text input with focus ring</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Textarea
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent"
                    rows={3}
                    placeholder="Enter text..."
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">Multi-line text input</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-transparent">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Dropdown selection</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
                <p className="text-gray-600">Standard card with shadow and border</p>
                <p className="text-sm text-gray-500 mt-2">Used for content containers</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Card</h3>
                <p className="text-gray-600 mb-4">Card with action buttons</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm font-medium text-white bg-brand-purple rounded-md hover:bg-brand-blue">
                    Action
                  </button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Spacing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Spacing</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Spacing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-black rounded"></div>
                      <span className="text-sm text-gray-600">2px - Extra small spacing</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-black rounded"></div>
                      <span className="text-sm text-gray-600">4px - Small spacing</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 bg-black rounded"></div>
                      <span className="text-sm text-gray-600">6px - Medium spacing</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-black rounded"></div>
                      <span className="text-sm text-gray-600">8px - Large spacing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 