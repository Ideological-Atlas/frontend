'use client';

import { useTranslations } from 'next-intl';
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
import { useRegister } from '@/hooks/auth/useRegister';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const { form, globalError, onSubmit, isLoading } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthCard maxWidth="max-w-[480px]">
      <motion.div variants={itemVariants}>
        <AuthHeader title={t('register_title')} subtitle={t('register_subtitle')} />
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

        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <PasswordField
            id="password"
            label={t('password_label')}
            placeholder="********"
            disabled={isLoading}
            error={errors.password?.message ? t(errors.password.message) : undefined}
            {...register('password')}
          />
          <PasswordField
            id="confirmPassword"
            label={t('confirm_password_label')}
            placeholder="********"
            disabled={isLoading}
            error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
            {...register('confirmPassword')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Alert variant="info" className="flex items-start gap-3 text-left">
            <span className="material-symbols-outlined shrink-0 text-[20px]">info</span>
            <span className="text-xs leading-relaxed">{t('password_requirements')}</span>
          </Alert>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('registering')}>
            {t('register_button')}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants}>
        <AuthFooter text={t('has_account')} linkText={t('login_link')} href="/login" />
      </motion.div>
    </AuthCard>
  );
}
