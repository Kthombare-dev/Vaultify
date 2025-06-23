'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const PaperPreview = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Preview Our Papers
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get a glimpse of our extensive collection of academic papers and study materials.
          </p>
        </div>

        {/* Paper Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Sample Paper 1 */}
          <div className="group relative">
            <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs sm:text-sm">Computer Science</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">2023</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Data Structures Mid Semester</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
                  <p>• Binary Trees and Graph Theory</p>
                  <p>• Time Complexity Analysis</p>
                  <p>• Dynamic Programming</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Paper 2 */}
          <div className="group relative">
            <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs sm:text-sm">Mathematics</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">2023</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Linear Algebra Mid Term</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
                  <p>• Vector Spaces</p>
                  <p>• Matrix Operations</p>
                  <p>• Eigenvalues and Eigenvectors</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sample Paper 3 */}
          <div className="group relative">
            <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs sm:text-sm">Physics</Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">2023</Badge>
                </div>
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-white">Quantum Mechanics Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 space-y-2">
                  <p>• Wave Functions</p>
                  <p>• Schrödinger Equation</p>
                  <p>• Quantum States</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button asChild size="lg" className="px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg">
            <Link href="/browse">
              Browse All Papers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PaperPreview; 