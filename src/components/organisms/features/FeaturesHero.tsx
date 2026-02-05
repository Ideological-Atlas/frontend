'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';

export function FeaturesHero() {
  const t = useTranslations('FeaturesPage');

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center px-6 py-20 text-center">
      <MagneticBackground />
      <div className="relative z-10 max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold backdrop-blur-md"
        >
          {t('version_badge')}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground text-4xl font-black tracking-tight md:text-6xl"
        >
          {t('hero_title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg"
        >
          {t('hero_subtitle')}
        </motion.p>
      </div>
    </section>
  );
}
