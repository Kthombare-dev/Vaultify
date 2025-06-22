'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from '@/components/ui/search';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, Clock, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useState } from 'react';
import { AuroraText } from "@/components/magicui/aurora-text";

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1500);
  });

  const handleSearch = (value: string) => {
    // Handle search logic here
    console.log('Searching for:', value);
  };

  const stats = [
    { label: 'Users', value: '10K+', icon: Users },
    { label: 'Papers', value: '50K+', icon: FileText },
    { label: 'Hours Saved', value: '100K+', icon: Clock },
    { label: 'Rating', value: '4.9', icon: Star },
  ];

  const loadingVariants = {
    loading: {
      opacity: 0.5,
      scale: 0.98,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    loaded: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const shimmerVariants = {
    loading: {
      x: ["-100%", "100%"],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Spreading from Top Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-[120vw] h-[40vh] pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-blue-400/40 via-purple-300/20 to-transparent rounded-b-full blur-3xl opacity-80" />
      </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      
      <motion.div 
        className="relative max-w-7xl mx-auto text-center z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Loading Shimmer Effect */}
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={{
              loading: {
                x: ["-100%", "100%"],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear" as const
                }
              }
            }}
            animate="loading"
          />
        )}

        {/* Badge */}
        <motion.div 
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8"
        >
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Trusted by 10,000+ students worldwide
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
        >
          Your Academic Resource
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mt-2">
            <AuroraText>Vaultify</AuroraText>
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Access and share previous year exam papers, study materials, and academic resources all in one secure platform. 
          Built for students, by students.
        </motion.p>

        {/* Search Section */}
        <motion.div 
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="mt-10 max-w-2xl mx-auto"
        >
          <Card className="p-2 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Search
                    placeholder="Search for papers, subjects, or branches..."
                    className="border-0 shadow-none focus-visible:ring-0"
                    onSearch={handleSearch}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button size="lg" className="px-8" disabled={isLoading}>
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" asChild className="px-8 py-3 text-lg" disabled={isLoading}>
            <Link href="/browse">
              Browse Papers
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8 py-3 text-lg" disabled={isLoading}>
            <Link href="/upload">
              Upload Papers
            </Link>
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="mt-16"
        >
          <Separator className="mb-8" />
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center group"
                animate={isLoading ? "loading" : "loaded"}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          animate={isLoading ? "loading" : "loaded"}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">🔒 Secure</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">⚡ Fast</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">🆓 Free</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">🌍 Global</Badge>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero; 