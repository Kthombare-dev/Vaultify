'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUp, Search, BookOpen, Share2 } from 'lucide-react';

const steps = [
  {
    icon: FileUp,
    title: "Upload Your PDF",
    description: "Simply drag and drop your question papers or click to upload from your device",
    badge: "Step 1"
  },
  {
    icon: Search,
    title: "Smart Processing",
    description: "Our AI automatically extracts and organizes questions for easy searching",
    badge: "Step 2"
  },
  {
    icon: BookOpen,
    title: "Start Studying",
    description: "Search for specific topics, questions, or concepts instantly",
    badge: "Step 3"
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Share papers with classmates and study together effectively",
    badge: "Step 4"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Get started in minutes with our simple 4-step process
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white dark:bg-gray-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <step.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
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
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Study Habits?</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have already improved their exam preparation with Vaultify
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 