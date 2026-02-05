'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { FormField } from '@/components/molecules/FormField';
import { BackLink } from '@/components/molecules/BackLink';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';

export function ForgotPasswordForm() {
  const t = useTranslations('Auth');
  const { form, isSuccess, onSubmit, isLoading } = useForgotPassword();
  const {
    register,
    formState: { errors },
  } = form;

  if (isSuccess) {
    return (
      <AuthCard maxWidth="max-w-[480px]">
        <motion.div variants={itemVariants} className="mb-8">
          <StatusMessage
            icon="mark_email_read"
            title={t('recovery_email_sent_title')}
            description={t('recovery_email_sent_description')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/login" className="w-full">
            <Button variant="primary" className="w-full" size="lg">
              {t('back_to_login')}
            </Button>
          </Link>
        </motion.div>
      </AuthCard>
    );
  }

  return (
    <AuthCard maxWidth="max-w-[480px]">
      <motion.div variants={itemVariants} className="mb-8">
        <StatusMessage
          icon="lock_reset"
          title={t('forgot_password_title')}
          description={t('forgot_password_subtitle')}
          iconClassName="text-[32px]"
        />
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-6">
        <motion.div variants={itemVariants}>
          <FormField
            id="email"
            type="email"
            label={t('email_label')}
            placeholder={t('email_placeholder')}
            disabled={isLoading}
            error={errors.email?.message ? t(errors.email.message) : undefined}
            startIcon={<span className="material-symbols-outlined text-[20px]">mail</span>}
            {...register('email')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('sending')}>
            {t('send_recovery_link')}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="mt-8 text-center">
        <BackLink href="/login" label={t('back_to_login')} />
      </motion.div>
    </AuthCard>
  );
}
