import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { HeroUIProvider } from '@heroui/react';
import { Navbar } from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vaultify',
  description: 'A platform for sharing and accessing previous year exam papers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeroUIProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </HeroUIProvider>
      </body>
    </html>
  );
}
