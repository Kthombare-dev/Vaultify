'use client';

import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vaultify</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your trusted platform for academic resources and exam papers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/browse" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary">
                  Browse Papers
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary">
                  Upload Papers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://github.com" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary flex items-center">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-base text-gray-600 dark:text-gray-300 hover:text-primary flex items-center">
                  <Twitter className="h-5 w-5 mr-2" />
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col items-center gap-4">
          <p className="text-base text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Vaultify. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            Created with ❤️ by
            <Button variant="link" asChild className="p-0 h-auto text-sm font-semibold">
              <a
                href="https://linktr.ee/Kthombare"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-200 hover:text-primary"
              >
                Ketan Thombare
              </a>
            </Button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 