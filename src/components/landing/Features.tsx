'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Clock, Target, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Search",
    description: "Find exactly what you need with intelligent search that understands context",
    badge: "Smart"
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Reduce study time by 50% with instant access to organized content",
    badge: "Fast"
  },
  {
    icon: Target,
    title: "Better Results",
    description: "Improve your exam scores with targeted practice and revision",
    badge: "Effective"
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Study with classmates and share knowledge effectively",
    badge: "Social"
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Access your papers anywhere, anytime with cloud synchronization",
    badge: "Convenient"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected with enterprise-grade security",
    badge: "Safe"
  }
];

const Features = () => {
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
        staggerChildren: 0.1
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
    <section ref={ref} className="py-24 bg-white dark:bg-gray-900">
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
              Everything You Need to Excel
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to make your study sessions more productive and efficient.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30"
                        animate={isLoading ? {
                          scale: [1, 1.05, 1],
                          transition: { duration: 1.5, repeat: Infinity }
                        } : {}}
                      >
                        <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 