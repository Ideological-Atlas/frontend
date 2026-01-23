'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ShowcaseCardProps {
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

export function ShowcaseCard({ title, description, icon, colorClass, bgClass }: ShowcaseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card border-border hover:border-primary/50 group relative overflow-hidden rounded-2xl border p-8 shadow-sm transition-colors"
    >
      <div
        className={clsx(
          'absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full opacity-20 blur-2xl transition-all group-hover:opacity-40',
          bgClass,
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className={clsx('flex h-12 w-12 items-center justify-center rounded-xl', bgClass, colorClass)}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>

        <div>
          <h3 className="text-foreground text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
