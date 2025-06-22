'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vaultify Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vaultify</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your trusted platform for academic resources and exam papers.
            </p>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/browse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                  Browse Papers
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
                  Upload Papers
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a 
                  href="https://github.com/Kthombare-dev" 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/ThombareKetan"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 1200 1227"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1200 0L741.376 558.736L1183.25 1227H933.348L615.826 756.318L252.506 1227H0L488.168 637.24L37.87 0H292.738L574.358 429.136L925.91 0H1200Z" />
                  </svg>
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Vaultify. All rights reserved.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Created with ❤️ by Ketan Thombare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 