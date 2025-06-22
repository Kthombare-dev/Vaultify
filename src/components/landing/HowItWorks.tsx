'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUp, Search, BookOpen, Brain } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Find Papers",
    description: "Browse or search through our collection of free mid-semester papers",
    badge: "Step 1"
  },
  {
    icon: FileUp,
    title: "Access or Upload",
    description: "Download papers you need or contribute by uploading your own",
    badge: "Step 2"
  },
  {
    icon: Brain,
    title: "Get AI Help",
    description: "Ask questions about any concept or topic in the papers",
    badge: "Step 3"
  },
  {
    icon: BookOpen,
    title: "Excel in Exams",
    description: "Practice with past papers and improve with AI guidance",
    badge: "Step 4"
  }
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  const shimmerVariants: Variants = {
    initial: {
      x: "-100%",
    },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
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
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative"
        >
          {/* Loading Shimmer Effect */}
          {isLoading && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          )}

          <motion.div 
            variants={itemVariants}
            animate={isLoading ? "loading" : "loaded"}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Your Path to Success
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access papers and get AI assistance in four simple steps
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                animate={isLoading ? "loading" : "loaded"}
                className="relative"
              >
                {isLoading && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30"
                        animate={isLoading ? {
                          scale: [1, 1.05, 1],
                          transition: { duration: 1.5, repeat: Infinity }
                        } : {}}
                      >
                        <step.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <Badge variant="secondary" className="text-xs">
                        {step.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2"
                    animate={isLoading ? {
                      opacity: [0.3, 1, 0.3],
                      transition: { duration: 1.5, repeat: Infinity }
                    } : {}}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 