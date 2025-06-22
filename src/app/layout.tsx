import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { HeroUIProvider } from '@heroui/react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/layout/Footer';

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <HeroUIProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </HeroUIProvider>
      </body>
    </html>
  );
}
