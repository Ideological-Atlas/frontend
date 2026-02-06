'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export function VolunteerCallout() {
  const t = useTranslations('FeaturesPage');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-primary/50 bg-secondary/30 mt-8 ml-12 rounded-r-xl border-l-4 p-4"
    >
      <h4 className="text-foreground mb-1 flex items-center gap-2 text-sm font-bold">
        <span className="material-symbols-outlined text-primary">volunteer_activism</span>
        {t('help_wanted_title')}
      </h4>
      <p className="text-muted-foreground mb-3 text-xs leading-relaxed">
        {t('help_wanted_desc') ||
          'Este es un proyecto open-source ambicioso. Si eres desarrollador, diseñador o investigador, tu ayuda es bienvenida.'}
      </p>
      <a
        href="mailto:support@ideologicalatlas.com"
        className="text-primary flex items-center gap-1 text-xs font-bold hover:underline"
      >
        {t('contact_us')}
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </a>
    </motion.div>
  );
}
