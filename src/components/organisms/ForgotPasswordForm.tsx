'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
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
        <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
          <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <span className="material-symbols-outlined text-primary text-[40px]">mark_email_read</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('recovery_email_sent_title')}</h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
            {t('recovery_email_sent_description')}
          </p>
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
      <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-primary text-[32px]">lock_reset</span>
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('forgot_password_title')}</h1>
        <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
          {t('forgot_password_subtitle')}
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">{t('email_label')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('email_placeholder')}
            disabled={isLoading}
            error={!!errors.email}
            startIcon={<span className="material-symbols-outlined text-[20px]">mail</span>}
            {...register('email')}
          />
          {errors.email?.message && <p className="text-destructive text-xs">{t(errors.email.message)}</p>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('sending')}>
            {t('send_recovery_link')}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="mt-8 text-center">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t('back_to_login')}
        </Link>
      </motion.div>
    </AuthCard>
  );
}
