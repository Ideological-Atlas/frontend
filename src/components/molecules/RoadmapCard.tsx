'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface RoadmapCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

export function RoadmapCard({ title, description, icon, delay = 0 }: RoadmapCardProps) {
  const t = useTranslations('FeaturesPage');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="relative flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="bg-background border-primary z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
          <span className="material-symbols-outlined text-primary text-sm font-bold">{icon}</span>
        </div>
        <div className="bg-border h-full w-0.5" />
      </div>

      <div className="bg-secondary/20 border-border hover:bg-secondary/40 mb-8 flex-1 rounded-xl border p-6 transition-colors">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-foreground text-lg font-bold">{title}</h3>
          <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-black tracking-widest uppercase">
            {t('coming_soon')}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
