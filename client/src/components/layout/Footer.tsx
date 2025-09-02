import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-100 via-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section - Increased width */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-7 h-7 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#C70D3A]/20 to-[#ED5107]/20 rounded-lg blur-sm -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tight">Maker's Schedule</span>
                  <span className="text-sm text-gray-500 font-medium tracking-wide">From busy to focused.</span>
                </div>
              </div>
              <p className="text-gray-600 text-base leading-relaxed mb-4 max-w-md">
                The maker's productivity companion designed for creators, developers, and builders who want to maximize their deep work sessions and achieve meaningful progress every day.
              </p>
            </div>

            {/* Remove Support Links section entirely */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Maker's Schedule. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Made with ❤️ for makers</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#A3C900] rounded-full animate-pulse"></div>
                <span className="text-[#A3C900] text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 