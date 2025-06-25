import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { HeroUIProvider } from '@heroui/react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vaultify',
  description: 'Your AI-powered study assistant and paper repository',
  icons: {
    icon: '/Icon.ico',
    shortcut: '/Icon.ico',
    apple: '/Icon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <HeroUIProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Analytics />
        </HeroUIProvider>
      </body>
    </html>
  );
}
