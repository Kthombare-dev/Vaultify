'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from '@/components/ui/search';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, Clock, FileText, Brain, Zap, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AuroraText } from "@/components/magicui/aurora-text";
import { useRouter } from 'next/navigation';
import { ShimmerEffect } from '@/components/magicui/shimmer-effect';
import Counter from '@/components/Counter';

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
  countTo: number;
  prefix?: string;
  suffix?: string;
}

const stats: Stat[] = [
  {
    icon: FileText,
    value: '0',
    countTo: 100,
    label: 'Papers Available',
    suffix: '+'
  },
  {
    icon: Clock,
    value: '0',
    countTo: 50,
    label: 'Faster Preparation',
    suffix: '%'
  },
  {
    icon: Brain,
    value: '0',
    countTo: 85,
    label: 'Better Understanding',
    suffix: '%'
  },
  {
    icon: Zap,
    value: '0',
    countTo: 3,
    label: 'More Practice',
    prefix: '',
    suffix: 'x'
  }
];

const IconAnimation: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => (
  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 relative overflow-hidden">
    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    <ShimmerEffect />
  </div>
);

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    margin: "-100px",
    amount: 0.2
  });

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/browse?search=${encodeURIComponent(term.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };

  return (
    <div ref={ref} className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Spreading from Top Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-[120vw] h-[40vh] pointer-events-none">
        <div className="w-full h-full bg-gradient-radial from-blue-400/40 via-purple-300/20 to-transparent rounded-b-full blur-3xl opacity-80" />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      
      <div className="relative max-w-7xl mx-auto text-center z-10 w-full">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 sm:mb-8 relative overflow-hidden">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          Trusted by 10,000+ students worldwide
          <ShimmerEffect />
        </div>

        {/* Product Hunt Launch */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <a 
            href="https://www.producthunt.com/products/vaultify?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-vaultify" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition-opacity"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=983499&theme=light&t=1750812763201" 
              alt="Vaultify - AI Study Assistant & Smart Paper Management" 
              width="250" 
              height="54" 
              style={{ width: '250px', height: '54px' }}
            />
          </a>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 sm:mb-6 relative px-4 sm:px-6">
          Your Academic Resource
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mt-2">
            <AuroraText>Papers & AI Study Assistant</AuroraText>
          </span>
          <ShimmerEffect />
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6">
          Access a vast collection of previous year mid-semester papers for free, enhanced with 
          AI-powered study assistance. Browse, search, and master your subjects with intelligent support.
        </p>

        {/* Search Section */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto hidden md:block px-4 sm:px-6">
          <Card className="p-2 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden">
            <ShimmerEffect />
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Search
                    placeholder="Search papers by subject, year, or ask questions..."
                    className="border-0 shadow-none focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button 
                  size="lg" 
                  className="px-4 sm:px-8 w-full sm:w-auto"
                  onClick={() => handleSearch(searchTerm)}
                  disabled={!searchTerm.trim()}
                >
                  Search & Ask
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-6">
          <Button size="lg" asChild className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
            <Link href="/browse">
              Browse Papers
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg w-full sm:w-auto">
            <Link href="/upload">
              Upload Papers
            </Link>
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16">
          <Separator className="mb-6 sm:mb-8" />
          <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-4 px-4 sm:px-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="mx-auto mb-2 sm:mb-3">
                  <IconAnimation icon={stat.icon} />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  <Counter 
                    value={stat.countTo} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4 sm:px-6">
          {['📚 Free Papers', '🤖 AI Assistant', '🎯 Mid Sems', '⚡ Quick Access'].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs sm:text-sm relative overflow-hidden">
                {text}
                <ShimmerEffect />
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero; 