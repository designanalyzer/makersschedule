'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import AuthGuard from '../AuthGuard';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCalendarPage = pathname === '/' || pathname === '/calendar';
  const shouldShowSidebar = isCalendarPage;
  
  // Pages that should not show the navbar and footer
  const isLandingPage = pathname === '/landing';
  const isInspirationPage = pathname === '/inspiration';
  const isBlogPage = pathname.startsWith('/blog/');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isResetPasswordPage = pathname === '/reset-password';
  const shouldShowLayout = !isLandingPage && !isInspirationPage && !isBlogPage && !isAuthPage && !isResetPasswordPage;
  
  // For public pages, render without AuthGuard
  if (!shouldShowLayout) {
    return <>{children}</>;
  }
  
  // For in-app pages, wrap everything in AuthGuard to prevent flash
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          {/* Desktop Sidebar */}
          {shouldShowSidebar && (
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          )}
          <main className={`flex-1 ${shouldShowSidebar ? 'p-4 lg:p-6' : 'p-4 lg:p-6'}`}>
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
} 