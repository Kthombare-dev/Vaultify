'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RainbowButton } from "@/components/magicui/rainbow-button";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background shape */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg
          width="900"
          height="400"
          viewBox="0 0 900 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-30 dark:opacity-20"
        >

          <defs>
            <linearGradient
              id="hero-gradient"
              x1="0"
              y1="0"
              x2="900"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
        >
          Your Academic Resource <br />
          <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
            Vaultify
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Access and share previous year <span className="font-semibold text-blue-700">Mid Term papers</span>, study materials, and academic resources—all in one secure, easy-to-use platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <RainbowButton size="lg">
            <Link href="/browse">
              Browse Papers
            </Link>
          </RainbowButton>
          <Button size="lg" className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100" asChild>
            <Link href="/upload">
              Upload Papers
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;