'use client';

import { motion } from 'framer-motion';

export const ShimmerEffect = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      x: ['-100%', '100%'],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  />
); 