'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Brain, Zap, Target, Search, Bot, Library } from 'lucide-react';
import { NeonGradientCard } from '@/components/magicui/neon-gradient-card';

const features = [
  {
    title: "Smart Paper Search",
    description: "Find relevant papers quickly with our intelligent search system that understands context and suggests related materials.",
    icon: Target,
    badge: "Smart Search"
  },
  {
    title: "AI Study Assistant",
    description: "Get personalized help with concepts, solve problems, and receive instant explanations from our AI assistant.",
    icon: Brain,
    badge: "AI Powered"
  },
  {
    title: "Instant Access",
    description: "Access and download papers instantly. Our optimized system ensures quick delivery of study materials.",
    icon: Zap,
    badge: "Fast Access"
  },
  {
    title: "Organized Library",
    description: "All papers are properly categorized by subject, year, and topics for easy navigation and efficient study planning.",
    icon: FileText,
    badge: "Library"
  }
];

const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      x: ['-100%', '100%'],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const IconAnimation: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => (
  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 relative overflow-hidden">
    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    <ShimmerEffect />
  </div>
);

const Features = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Vaultify?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience a smarter way to study with our comprehensive features designed to enhance your academic journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Smart Paper Search */}
          <div className="group relative">
            <NeonGradientCard>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    Smart Paper Search
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Find exactly what you need with our intelligent search system. Filter by subject, year, or topic to access relevant study materials instantly.
                </p>
              </div>
            </NeonGradientCard>
          </div>

          {/* AI Study Assistant */}
          <div className="group relative">
            <NeonGradientCard>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    AI Study Assistant
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Get personalized help with our AI-powered study assistant. Ask questions, get explanations, and deepen your understanding.
                </p>
              </div>
            </NeonGradientCard>
          </div>

          {/* Instant Access */}
          <div className="group relative">
            <NeonGradientCard>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    Instant Access
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Access your study materials anytime, anywhere. No more waiting or searching through physical papers.
                </p>
              </div>
            </NeonGradientCard>
          </div>

          {/* Organized Library */}
          <div className="group relative">
            <NeonGradientCard>
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Library className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                    Organized Library
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Keep all your study materials organized and easily accessible in one place. Never lose track of important papers again.
                </p>
              </div>
            </NeonGradientCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 