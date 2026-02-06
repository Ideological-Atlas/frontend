'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { RoadmapCard } from '@/components/molecules/RoadmapCard';
import { VolunteerCallout } from '@/components/molecules/VolunteerCallout';

export function RoadmapSection() {
  const t = useTranslations('FeaturesPage');

  const roadmapItems = [
    { id: 'dashboard', icon: 'query_stats', delay: 0.2 },
    { id: 'countries', icon: 'public', delay: 0.3 },
    { id: 'community', icon: 'groups', delay: 0.4 },
    { id: 'ai', icon: 'psychology', delay: 0.5 },
    { id: 'mobile', icon: 'smartphone', delay: 0.6 },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center"
      >
        <h2 className="text-foreground mb-4 text-3xl font-black tracking-tight md:text-4xl">{t('roadmap_title')}</h2>
        <p className="text-muted-foreground text-lg">{t('roadmap_subtitle')}</p>

        <div className="from-secondary/50 to-background mt-8 hidden h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br p-1 lg:block">
          <div className="bg-background/50 relative h-full w-full rounded-xl backdrop-blur-3xl">
            <div className="bg-primary/20 absolute top-10 left-10 h-32 w-32 animate-pulse rounded-full blur-3xl" />
            <div className="bg-accent/20 absolute right-10 bottom-10 h-40 w-40 animate-pulse rounded-full blur-3xl delay-700" />
          </div>
        </div>
      </motion.div>

      <div className="relative">
        <div className="bg-border/50 absolute top-4 bottom-10 left-[19px] w-0.5" />

        <div className="flex flex-col gap-2">
          {roadmapItems.map(item => (
            <RoadmapCard
              key={item.id}
              title={t(`upcoming.${item.id}.title`)}
              description={t(`upcoming.${item.id}.desc`)}
              icon={item.icon}
              delay={item.delay}
            />
          ))}
        </div>

        <VolunteerCallout />
      </div>
    </div>
  );
}
