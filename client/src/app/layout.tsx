import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '../styles/globals.css';
import LayoutContent from '@/components/layout/LayoutContent';
import { AuthProvider } from '../contexts/AuthContext';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Maker's Schedule",
  description: 'Your personal productivity companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
} 