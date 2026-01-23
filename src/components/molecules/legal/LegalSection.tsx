'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LegalSectionProps {
  id: string;
  icon: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LegalSection({ id, icon, title, children, className }: LegalSectionProps) {
  return (
    <motion.section
      id={id}
      variants={itemVariants}
      className="scroll-mt-28"
      viewport={{ once: true, margin: '-100px' }}
    >
      <div className={clsx('bg-card border-border rounded-2xl border p-6 shadow-sm md:p-8', className)}>
        <h2 className="text-foreground mb-6 flex items-center gap-2 text-2xl font-bold">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}
