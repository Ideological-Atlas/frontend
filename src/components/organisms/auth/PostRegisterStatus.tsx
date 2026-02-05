'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { StatusCallout } from '@/components/molecules/StatusCallout';

export function PostRegisterStatus() {
  const t = useTranslations('Auth');
  const locale = useLocale();

  return (
    <AuthCard maxWidth="max-w-[500px]">
      <motion.div variants={itemVariants} className="mb-8">
        <StatusMessage
          icon="mark_email_read"
          title={t('post_register_title')}
          description={t('post_register_subtitle')}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        <StatusCallout variant="success" icon="check" title={t('status_completed')} description={t('status_pending')} />
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
