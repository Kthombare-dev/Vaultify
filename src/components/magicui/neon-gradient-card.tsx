"use client";

import React from 'react';

interface NeonGradientCardProps {
  children: React.ReactNode;
  className?: string;
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({ children, className = '' }) => (
  <div className={`relative p-6 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);
