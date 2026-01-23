'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { LegalSidebar } from '@/components/molecules/legal/LegalSidebar';
import { LegalSection } from '@/components/molecules/legal/LegalSection';
import { LegalGridCard } from '@/components/molecules/legal/LegalGridCard';

export default function PrivacyPolicyPage() {
  const t = useTranslations('Legal');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  const sidebarItems = [
    { id: 'intro', icon: 'info', label: t('intro_title') },
    { id: 'collection', icon: 'database', label: t('collection_title') },
    { id: 'usage', icon: 'bar_chart', label: t('usage_title') },
    { id: 'cookies', icon: 'cookie_off', label: t('cookies_title') },
    { id: 'rights', icon: 'shield_lock', label: t('rights_title') },
    { id: 'contact', icon: 'mail', label: t('contact_title') },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="layout-content-container mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <LegalSidebar items={sidebarItems} />

          <main className="lg:col-span-9">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="border-border mb-12 flex flex-col gap-6 border-b pb-8"
            >
              <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                  {tCommon('home')}
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-foreground font-medium">{t('privacy_policy_title')}</span>
              </nav>

              <div className="flex max-w-3xl flex-col gap-4">
                <h1 className="text-foreground text-4xl leading-[1.1] font-black tracking-tight md:text-5xl">
                  {t('privacy_policy_title')}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">{t('privacy_policy_subtitle')}</p>
              </div>

              <div className="bg-secondary/50 text-muted-foreground flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-sm">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <p>
                  {t('last_updated')}: <span className="text-foreground font-medium">2026-01-23</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-12"
            >
              <LegalSection id="intro" icon="info" title={t('intro_title')} className="relative overflow-hidden">
                <div className="bg-primary absolute top-0 left-0 h-full w-1"></div>
                <div className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>{t('intro_p1')}</p>
                  <p>{t('intro_p2')}</p>
                </div>
              </LegalSection>

              <LegalSection id="collection" icon="database" title={t('collection_title')}>
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { icon: 'person', title: t('col_account_title'), description: t('col_account_desc') },
                    { icon: 'psychology', title: t('col_interaction_title'), description: t('col_interaction_desc') },
                    { icon: 'devices', title: t('col_tech_title'), description: t('col_tech_desc') },
                    { icon: 'folder_shared', title: t('col_contrib_title'), description: t('col_contrib_desc') },
                  ].map((item, idx) => (
                    <LegalGridCard key={idx} {...item} />
                  ))}
                </div>
              </LegalSection>

              <LegalSection id="usage" icon="bar_chart" title={t('usage_title')}>
                <p className="text-muted-foreground mb-6 leading-relaxed">{t('usage_intro')}</p>
                <ul className="space-y-4">
                  {[
                    { title: t('use_algo_title'), desc: t('use_algo_desc') },
                    { title: t('use_perso_title'), desc: t('use_perso_desc') },
                    { title: t('use_sec_title'), desc: t('use_sec_desc') },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
                      <div>
                        <strong className="text-foreground block">{item.title}</strong>
                        <span className="text-muted-foreground text-sm">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </LegalSection>

              <LegalSection id="cookies" icon="cookie_off" title={t('cookies_title')}>
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="hidden md:block">
                      <div className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-full">
                        <span className="material-symbols-outlined text-primary text-4xl">cookie_off</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{t('cookies_desc')}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                    <span className="material-symbols-outlined shrink-0 text-green-600 dark:text-green-400">
                      shield
                    </span>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>{t('cookies_note_label')}:</strong> {t('cookies_note_text')}
                    </p>
                  </div>
                </div>
              </LegalSection>

              <LegalSection id="rights" icon="shield_lock" title={t('rights_title')}>
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{t('rights_intro')}</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { title: t('right_access_title'), description: t('right_access_desc') },
                      { title: t('right_rect_title'), description: t('right_rect_desc') },
                      { title: t('right_del_title'), description: t('right_del_desc') },
                      { title: t('right_port_title'), description: t('right_port_desc') },
                    ].map((item, idx) => (
                      <LegalGridCard key={idx} {...item} variant="outline" />
                    ))}
                  </div>
                </div>
              </LegalSection>

              <motion.section
                id="contact"
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { type: 'spring' } },
                }}
                className="scroll-mt-28"
              >
                <div className="bg-primary relative overflow-hidden rounded-2xl p-8 text-white shadow-lg">
                  <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl"></div>
                  <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex-1">
                      <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                        <span className="material-symbols-outlined">mail</span>
                        {t('contact_title')}
                      </h2>
                      <p className="mb-6 max-w-lg text-blue-50">{t('contact_desc')}</p>
                      <div className="flex flex-col gap-2">
                        <a
                          href="mailto:legal@ideologicalatlas.com"
                          className="inline-flex items-center gap-2 font-bold hover:underline"
                        >
                          legal@ideologicalatlas.com
                          <span className="material-symbols-outlined text-sm">arrow_outward</span>
                        </a>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <a href="mailto:legal@ideologicalatlas.com">
                        <button className="text-primary rounded-xl bg-white px-6 py-3 font-bold shadow-xl transition-transform hover:-translate-y-1 hover:bg-blue-50 active:translate-y-0">
                          {t('contact_btn')}
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
