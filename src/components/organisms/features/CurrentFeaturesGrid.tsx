'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShowcaseCard } from '@/components/molecules/ShowcaseCard';

export function CurrentFeaturesGrid() {
  const t = useTranslations('FeaturesPage');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const features = [
    {
      id: 'multidimensional',
      icon: 'hub',
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
    },
    {
      id: 'contextual',
      icon: 'travel_explore',
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-500/10',
    },
    {
      id: 'privacy',
      icon: 'lock',
      colorClass: 'text-green-500',
      bgClass: 'bg-green-500/10',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="mb-24"
    >
      <div className="mb-12 flex items-center gap-4">
        <h2 className="text-foreground text-2xl font-bold">{t('current_title')}</h2>
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map(feature => (
          <motion.div key={feature.id} variants={itemVariants}>
            <ShowcaseCard
              title={t(`cards.${feature.id}.title`)}
              description={t(`cards.${feature.id}.desc`)}
              icon={feature.icon}
              colorClass={feature.colorClass}
              bgClass={feature.bgClass}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
