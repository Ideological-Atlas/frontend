'use client';

import { motion } from 'framer-motion';

interface AlgorithmCardProps {
  title: string;
  description: string;
  icon: string;
  formula?: React.ReactNode;
  delay?: number;
}

export function AlgorithmCard({ title, description, icon, formula, delay = 0 }: AlgorithmCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-card border-border hover:border-primary/50 group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all"
    >
      <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="bg-secondary/50 flex h-10 w-10 items-center justify-center rounded-lg">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>

        <div>
          <h3 className="text-foreground font-bold">{title}</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
        </div>

        {formula && (
          <div className="bg-background/50 border-border text-foreground/80 mt-2 overflow-x-auto rounded-lg border p-3 font-mono text-xs">
            {formula}
          </div>
        )}
      </div>
    </motion.div>
  );
}
