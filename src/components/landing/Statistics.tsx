'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Brain, Target, Users, BookOpen } from 'lucide-react';
import Counter from '@/components/Counter';

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  isInView: boolean;
}

const stats: StatItem[] = [
  {
    icon: Clock,
    value: 50,
    suffix: '%',
    label: 'Faster Preparation',
    description: 'Reduce study time with organized papers'
  },
  {
    icon: Brain,
    value: 85,
    suffix: '%',
    label: 'Better Understanding',
    description: 'AI-powered concept explanations'
  },
  {
    icon: Target,
    value: 3,
    suffix: 'x',
    label: 'More Practice',
    description: 'Access to comprehensive paper sets'
  },
  {
    icon: Users,
    value: 95,
    suffix: '%',
    label: 'Student Satisfaction',
    description: 'Based on user feedback'
  }
];

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, suffix, isInView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      setCount(0); // Reset count when coming into view
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.span 
      className="text-4xl font-bold text-blue-600 dark:text-blue-400"
      animate={{
        scale: isInView ? [1, 1.05, 1] : 1,
        opacity: isInView ? [0.8, 1, 0.8] : 1
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {count}{suffix}
    </motion.span>
  );
};

const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      x: ['-100%', '100%'],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const IconAnimation: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => (
  <motion.div 
    className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 relative overflow-hidden"
    animate={{
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    <ShimmerEffect />
  </motion.div>
);

const Statistics = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See how Vaultify is transforming academic preparation and study efficiency.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Active Users */}
          <Card className="p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <Counter value={1000} suffix="+" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Active Users</p>
            </div>
          </Card>

          {/* Papers Available */}
          <Card className="p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <Counter value={100} suffix="+" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Papers Available</p>
            </div>
          </Card>

          {/* Study Efficiency */}
          <Card className="p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <Counter value={85} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Better Understanding</p>
            </div>
          </Card>

          {/* Time Saved */}
          <Card className="p-6 sm:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <Counter value={50} suffix="%" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Faster Preparation</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Statistics; 