'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShowcaseCard } from '@/components/molecules/ShowcaseCard';
import { RoadmapCard } from '@/components/molecules/RoadmapCard';
import { MagneticBackground } from '@/components/molecules/MagneticBackground';

export function FeaturesView() {
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

  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <section className="relative flex min-h-[50vh] items-center justify-center px-6 py-20 text-center">
        <MagneticBackground />
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-primary/10 text-primary inline-block rounded-full px-4 py-1.5 text-sm font-bold backdrop-blur-md"
          >
            Ideological Atlas v0.1
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

      <div className="layout-content-container mx-auto w-full max-w-7xl px-6 pb-24">
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
            <motion.div variants={itemVariants}>
              <ShowcaseCard
                title={t('cards.multidimensional.title')}
                description={t('cards.multidimensional.desc')}
                icon="hub"
                colorClass="text-blue-500"
                bgClass="bg-blue-500/10"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ShowcaseCard
                title={t('cards.contextual.title')}
                description={t('cards.contextual.desc')}
                icon="travel_explore"
                colorClass="text-purple-500"
                bgClass="bg-purple-500/10"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ShowcaseCard
                title={t('cards.privacy.title')}
                description={t('cards.privacy.desc')}
                icon="lock"
                colorClass="text-green-500"
                bgClass="bg-green-500/10"
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-foreground mb-4 text-3xl font-black tracking-tight md:text-4xl">
              {t('roadmap_title')}
            </h2>
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
              {/* 1. Explorador de ideologías */}
              <RoadmapCard
                title={t('upcoming.explorer.title')}
                description={t('upcoming.explorer.desc')}
                icon="library_books"
                delay={0.2}
              />

              {/* 2. Dashboard Analítico */}
              <RoadmapCard
                title={t('upcoming.dashboard.title')}
                description={t('upcoming.dashboard.desc')}
                icon="query_stats"
                delay={0.3}
              />

              {/* 3. Atlas por Países */}
              <RoadmapCard
                title={t('upcoming.countries.title')}
                description={t('upcoming.countries.desc')}
                icon="public"
                delay={0.4}
              />

              {/* 4. Comunidad y Grupos */}
              <RoadmapCard
                title={t('upcoming.community.title')}
                description={t('upcoming.community.desc')}
                icon="groups"
                delay={0.5}
              />

              {/* 5. IA de Ideologías */}
              <RoadmapCard
                title={t('upcoming.ai.title')}
                description={t('upcoming.ai.desc')}
                icon="psychology"
                delay={0.6}
              />

              {/* 6. Versiones Móviles */}
              <RoadmapCard
                title={t('upcoming.mobile.title')}
                description={t('upcoming.mobile.desc')}
                icon="smartphone"
                delay={0.7}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border-primary/50 bg-secondary/30 mt-8 ml-12 rounded-r-xl border-l-4 p-4"
            >
              <h4 className="text-foreground mb-1 flex items-center gap-2 text-sm font-bold">
                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                {t('help_wanted_title') || 'Necesitamos tu ayuda'}
              </h4>
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
                {t('help_wanted_desc') ||
                  'Este es un proyecto open-source ambicioso. Si eres desarrollador, diseñador o investigador, tu ayuda es bienvenida.'}
              </p>
              <a
                href="mailto:support@ideologicalatlas.com"
                className="text-primary flex items-center gap-1 text-xs font-bold hover:underline"
              >
                {t('contact_us') || 'Contáctanos'}
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
