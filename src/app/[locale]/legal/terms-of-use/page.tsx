'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { LegalSidebar } from '@/components/molecules/legal/LegalSidebar';
import { LegalSection } from '@/components/molecules/legal/LegalSection';

export default function TermsOfUsePage() {
  const t = useTranslations('Terms');
  const tCommon = useTranslations('Common');
  const locale = useLocale();

  const sidebarItems = [
    { id: 'intro', icon: 'info', label: t('sidebar.intro') },
    { id: 'acceptance', icon: 'check_circle', label: t('sidebar.acceptance') },
    { id: 'service', icon: 'description', label: t('sidebar.service') },
    { id: 'responsible', icon: 'gavel', label: t('sidebar.responsible') },
    { id: 'accounts', icon: 'group', label: t('sidebar.accounts') },
    { id: 'modifications', icon: 'update', label: t('sidebar.modifications') },
    { id: 'liability', icon: 'security', label: t('sidebar.liability') },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
              className="border-border mb-10 flex flex-col gap-6 border-b pb-8"
            >
              <nav className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                  {tCommon('home')}
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-foreground font-medium">{t('title')}</span>
              </nav>

              <div className="flex flex-col gap-4">
                <h1 className="text-foreground text-4xl leading-tight font-black tracking-tight md:text-5xl">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  <span>{t('last_updated')}: 2026-01-23</span>
                  <span className="mx-2 opacity-50">•</span>
                  <span>{t('version')}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-12"
            >
              <LegalSection id="intro" icon="info" title={t('sidebar.intro')}>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p className="text-foreground font-medium">{t('intro.p1')}</p>
                  <p>{t('intro.p2')}</p>
                </div>
              </LegalSection>

              <LegalSection id="acceptance" icon="check_circle" title={t('acceptance.title')}>
                <div className="border-primary/20 border-l-2 pl-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed">{t('acceptance.p1')}</p>
                  <p className="text-muted-foreground leading-relaxed">{t('acceptance.p2')}</p>
                </div>
              </LegalSection>

              <LegalSection id="service" icon="description" title={t('service.title')}>
                <div className="border-primary/20 border-l-2 pl-6">
                  <p className="text-muted-foreground leading-relaxed">{t('service.p1')}</p>
                </div>
              </LegalSection>

              <motion.section
                id="responsible"
                className="scroll-mt-28"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="bg-secondary/10 border-border relative overflow-hidden rounded-2xl border p-8">
                  <div className="from-primary via-accent absolute top-0 left-0 h-1 w-full bg-gradient-to-r to-transparent" />

                  <div className="mb-8 flex flex-col gap-2">
                    <h2 className="text-primary flex items-center gap-2 text-2xl font-black">
                      <span className="material-symbols-outlined">gavel</span>
                      {t('responsible.title')}
                    </h2>
                    <p className="text-muted-foreground">{t('responsible.desc')}</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                      <div className="bg-destructive/10 text-destructive mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined">shield_lock</span>
                      </div>
                      <h3 className="text-foreground mb-2 text-lg font-bold">{t('responsible.prohibitions_title')}</h3>
                      <p className="text-muted-foreground mb-3 text-sm">{t('responsible.prohibitions_desc')}</p>
                      <ul className="text-muted-foreground space-y-2 text-sm">
                        {t.raw('responsible.prohibitions_list').map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-destructive mt-0.5">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
                      <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                        <span className="material-symbols-outlined">code</span>
                      </div>
                      <h3 className="text-foreground mb-2 text-lg font-bold">{t('responsible.license_title')}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">{t('responsible.license_desc')}</p>
                      <div className="bg-secondary/50 border-border rounded border p-3 font-mono text-xs opacity-80">
                        &quot;{t('responsible.license_quote')}&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <LegalSection id="accounts" icon="group" title={t('accounts.title')}>
                <div className="border-primary/20 space-y-4 border-l-2 pl-6">
                  <p className="text-muted-foreground leading-relaxed">{t('accounts.p1')}</p>
                  <p className="text-muted-foreground leading-relaxed">{t('accounts.p2')}</p>
                </div>
              </LegalSection>

              <LegalSection id="modifications" icon="update" title={t('modifications.title')}>
                <div className="border-primary/20 border-l-2 pl-6">
                  <p className="text-muted-foreground leading-relaxed">{t('modifications.p1')}</p>
                </div>
              </LegalSection>

              <LegalSection id="liability" icon="security" title={t('liability.title')}>
                <div className="border-primary/20 border-l-2 pl-6">
                  <p className="text-muted-foreground leading-relaxed">{t('liability.p1')}</p>
                </div>
              </LegalSection>

              <div className="bg-secondary/20 border-border flex flex-col items-center justify-between gap-4 rounded-xl border p-6 md:flex-row">
                <div className="text-center md:text-left">
                  <p className="text-foreground mb-1 font-bold">{t('contact_community.title')}</p>
                  <p className="text-muted-foreground text-sm">{t('contact_community.desc')}</p>
                </div>
                <a
                  href="mailto:legal@ideologicalatlas.org"
                  className="bg-card text-primary hover:text-primary-hover border-border flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold shadow-sm transition-colors hover:shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  {t('contact_community.btn')}
                </a>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
