'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { useRegister } from '@/hooks/auth/useRegister';

export function RegisterForm() {
  const t = useTranslations('Auth');
  const { form, globalError, onSubmit, isLoading } = useRegister();
  const {
    register,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthCard maxWidth="max-w-[480px]">
      <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-foreground text-3xl font-black tracking-tight">{t('register_title')}</h1>
        <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">{t('register_subtitle')}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GoogleButton />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Divider />
      </motion.div>

      {globalError && (
        <motion.div
          variants={itemVariants}
          className="bg-destructive/10 text-destructive border-destructive/20 mb-6 rounded-lg border p-3 text-center text-sm"
        >
          {t(globalError)}
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
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

        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">{t('password_label')}</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              disabled={isLoading}
              error={!!errors.password}
              startIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="text-muted-foreground hover:text-foreground flex items-center justify-center focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
              {...register('password')}
            />
            {errors.password?.message && <p className="text-destructive text-xs">{t(errors.password.message)}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirm_password_label')}</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className="pl-4"
              disabled={isLoading}
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword?.message && (
              <p className="text-destructive text-xs">{t(errors.confirmPassword.message)}</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-3 rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <span className="material-symbols-outlined shrink-0 text-[20px]">info</span>
          <p className="text-xs leading-relaxed">{t('password_requirements')}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('registering')}>
            {t('register_button')}
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="text-muted-foreground mt-8 text-center text-sm">
        {t('has_account')}{' '}
        <Link href="/login" className="text-primary hover:text-primary-hover font-semibold hover:underline">
          {t('login_link')}
        </Link>
      </motion.div>
    </AuthCard>
  );
}
