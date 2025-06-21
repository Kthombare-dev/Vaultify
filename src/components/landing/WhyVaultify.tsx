'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Clock, 
  Target, 
  Users, 
  Zap, 
  Shield
} from 'lucide-react';

const benefits = [
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

const WhyVaultify = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Why Choose Vaultify?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Join thousands of students who have already transformed their study experience
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <benefit.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {benefit.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2 text-gray-900 dark:text-white">
                    {benefit.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyVaultify; 