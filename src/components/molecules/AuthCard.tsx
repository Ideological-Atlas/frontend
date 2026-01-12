'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function AuthCard({ children, className, maxWidth = 'max-w-[480px]' }: AuthCardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx('bg-card border-border w-full rounded-2xl border p-8 shadow-2xl md:p-10', maxWidth, className)}
    >
      {children}
    </motion.div>
  );
}
