'use client';

import { motion } from 'framer-motion';
import { FileText, Search, Upload, Shield } from 'lucide-react';

const features = [
  {
    name: 'Extensive Collection',
    description: 'Access a vast library of previous year exam papers and study materials.',
    icon: FileText,
  },
  {
    name: 'Easy Search',
    description: 'Find exactly what you need with our powerful search functionality.',
    icon: Search,
  },
  {
    name: 'Simple Upload',
    description: 'Share your resources with the community in just a few clicks.',
    icon: Upload,
  },
  {
    name: 'Secure Platform',
    description: 'Your data is protected with enterprise-grade security measures.',
    icon: Shield,
  },
];

const Features = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Everything you need for academic success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Our platform provides all the tools and resources you need to excel in your studies.
          </motion.p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-blue-100 dark:border-blue-900"
                style={{
                  boxShadow: '0 4px 32px 0 rgba(36, 107, 253, 0.07)',
                }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-md">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;