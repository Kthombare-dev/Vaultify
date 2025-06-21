'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Shield, 
  Zap, 
  Users, 
  Clock,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find any question or topic instantly with our intelligent search algorithm",
    badge: "AI-Powered"
  },
  {
    icon: FileText,
    title: "PDF Upload",
    description: "Upload your question papers and get instant access to organized content",
    badge: "Easy"
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Your documents are encrypted and stored safely in the cloud",
    badge: "Secure"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in milliseconds with our optimized search engine",
    badge: "Fast"
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "Share papers with classmates and study together effectively",
    badge: "Social"
  },
  {
    icon: Clock,
    title: "24/7 Access",
    description: "Access your papers anytime, anywhere with cloud synchronization",
    badge: "Always On"
  }
];

const stats = [
  { icon: BookOpen, value: "10K+", label: "Papers Indexed" },
  { icon: Users, value: "5K+", label: "Active Students" },
  { icon: Target, value: "95%", label: "Search Accuracy" },
  { icon: TrendingUp, value: "50%", label: "Study Time Saved" }
];

const Features = () => {
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
            Everything You Need to Excel
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Powerful features designed to make your study sessions more productive and efficient.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
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

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Trusted by Students Worldwide</h3>
              <p className="text-blue-100">Join thousands of students who have transformed their study habits</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <stat.icon className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features; 