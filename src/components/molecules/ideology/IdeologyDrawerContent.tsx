'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface IdeologyDrawerContentProps {
  activeTab: string;
  description: string | null | undefined;
}

export function IdeologyDrawerContent({ activeTab, description }: IdeologyDrawerContentProps) {
  const t = useTranslations('Encyclopedia');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-base leading-relaxed font-normal whitespace-pre-line text-zinc-400">
            {description || t('no_description')}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
