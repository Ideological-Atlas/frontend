'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/atoms/Alert';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { AuthHeader } from '@/components/molecules/AuthHeader';
import { AuthFooter } from '@/components/molecules/AuthFooter';
import { FormField } from '@/components/molecules/FormField';
import { PasswordField } from '@/components/molecules/PasswordField';
import { useLogin } from '@/hooks/auth/useLogin';

export function LoginForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const { form, globalError, onSubmit, isLoading } = useLogin();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard maxWidth="max-w-[420px]">
      <motion.div variants={itemVariants}>
        <AuthHeader title={t('login_title')} subtitle={t('login_subtitle')} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <GoogleButton />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Divider />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Alert variant="destructive">{globalError ? t(globalError) : null}</Alert>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-5">
        <motion.div variants={itemVariants}>
          <FormField
            id="username"
            label={t('username_label')}
            placeholder={t('username_placeholder')}
            disabled={isLoading}
            error={errors.username?.message ? t(errors.username.message) : undefined}
            startIcon={<span className="material-symbols-outlined text-[20px]">person</span>}
            {...register('username')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <PasswordField
            id="password"
            label={t('password_label')}
            placeholder={t('password_placeholder')}
            disabled={isLoading}
            error={errors.password?.message ? t(errors.password.message) : undefined}
            showForgotPassword
            {...register('password')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('logging_in')}>
            <div className="flex items-center justify-center gap-2">
              <span>{t('login_button')}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants}>
        <AuthFooter text={t('no_account')} linkText={t('register_link')} href={`/${locale}/register`} />
      </motion.div>
    </AuthCard>
  );
}
