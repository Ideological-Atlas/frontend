'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { useVerifyUser, type VerifyState } from '@/hooks/auth/useVerifyUser';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export function VerifyStatus() {
  const t = useTranslations('Verify');
  const locale = useLocale();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();

  const { status } = useVerifyUser(params.uuid as string);

  const stateConfig: Record<VerifyState, { icon: string; iconClass: string; title: string; desc: string }> = {
    loading: {
      icon: 'sync',
      iconClass: 'text-primary animate-spin',
      title: t('title_loading'),
      desc: t('description_loading'),
    },
    success: {
      icon: 'check_circle',
      iconClass: 'text-green-500',
      title: t('title_success'),
      desc: t('description_success'),
    },
    already_verified: {
      icon: 'verified',
      iconClass: 'text-primary',
      title: t('title_already_verified'),
      desc: t('description_already_verified'),
    },
    error: {
      icon: 'error',
      iconClass: 'text-destructive',
      title: t('title_error'),
      desc: t('description_error'),
    },
  };

  const config = stateConfig[status];

  return (
    <AuthCard maxWidth="max-w-[420px]">
      <motion.div variants={itemVariants} className="mb-8">
        <StatusMessage
          icon={config.icon}
          title={config.title}
          description={config.desc}
          iconClassName={config.iconClass}
        />
      </motion.div>

      {status !== 'loading' && (
        <motion.div variants={itemVariants} className="w-full">
          <Link href={`/${locale}${isAuthenticated ? DEFAULT_LOGIN_REDIRECT : '/login'}`} className="w-full">
            <Button className="w-full" variant="primary">
              {isAuthenticated ? t('go_to_dashboard') : t('go_to_login')}
              <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
            </Button>
          </Link>
        </motion.div>
      )}
    </AuthCard>
  );
}
