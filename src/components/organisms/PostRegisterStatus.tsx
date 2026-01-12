'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';

export function PostRegisterStatus() {
  const t = useTranslations('Auth');
  const locale = useLocale();

  return (
    <AuthCard maxWidth="max-w-[500px]">
      <div className="mb-8 flex flex-col items-center text-center">
        <motion.div
          variants={itemVariants}
          className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full"
        >
          <span className="material-symbols-outlined text-primary text-[40px]">mark_email_read</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-foreground text-3xl font-black tracking-tight">
          {t('post_register_title')}
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted-foreground mt-4 text-base leading-relaxed font-normal">
          {t('post_register_subtitle')}
        </motion.p>
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-secondary/50 border-border mb-8 flex items-center gap-4 rounded-xl border p-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
          <span className="material-symbols-outlined text-[20px] text-green-500">check</span>
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-bold">{t('status_completed')}</span>
          <span className="text-muted-foreground text-xs">{t('status_pending')}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <Link href={`/${locale}`} className="w-full">
          <Button variant="primary" className="h-12 w-full text-base">
            {t('explore_button')}
          </Button>
        </Link>
        <Link href={`/${locale}`} className="w-full">
          <Button variant="secondary" className="hover:border-border h-12 w-full border border-transparent text-base">
            {t('dashboard_button')}
          </Button>
        </Link>
      </motion.div>
    </AuthCard>
  );
}
