'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Calendar, School, GraduationCap } from 'lucide-react';
import { PaperData } from '@/lib/unified-services';

const samplePapers: Partial<PaperData>[] = [
  {
    subjectName: "Data Structures",
    subjectCode: "CS201",
    semester: "3",
    academicYear: "2023-24",
    branch: "Computer Science Engineering (CSE)",
    paperType: "end-sem",
    description: "Comprehensive coverage of fundamental data structures",
    collegeName: "MIT College of Engineering",
    universityName: "Savitribai Phule Pune University"
  },
  {
    subjectName: "Linear Algebra",
    subjectCode: "MA202",
    semester: "2",
    academicYear: "2023-24",
    branch: "Mathematics",
    paperType: "mid-semester-test 1",
    description: "Coverage of matrices and vector spaces",
    collegeName: "COEP Technological University",
    universityName: "Mumbai University"
  },
  {
    subjectName: "Quantum Physics",
    subjectCode: "PH301",
    semester: "4",
    academicYear: "2023-24",
    branch: "Physics",
    paperType: "end-sem",
    description: "Advanced quantum mechanics concepts",
    collegeName: "IIT Bombay",
    universityName: "IIT Bombay"
  }
];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {samplePapers.map((paper, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {paper.subjectName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{paper.subjectCode}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {paper.paperType?.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>• {paper.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Code size={16} className="text-slate-500" />
                      <span className="font-medium">Sem: {paper.semester}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Calendar size={16} className="text-slate-500" />
                      <span className="font-medium">{paper.academicYear}</span>
                    </div>
                  </div>
                  {(paper.collegeName || paper.universityName) && (
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {paper.collegeName && (
                        <div className="flex items-center gap-3">
                          <School size={16} className="text-slate-500" />
                          <span className="font-medium">{paper.collegeName}</span>
                        </div>
                      )}
                      {paper.universityName && (
                        <div className="flex items-center gap-3 mt-1">
                          <GraduationCap size={16} className="text-slate-500" />
                          <span className="font-medium">{paper.universityName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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