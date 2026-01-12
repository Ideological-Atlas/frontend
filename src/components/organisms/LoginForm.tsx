'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { useLogin } from '@/hooks/auth/useLogin';
import { useState } from 'react';

export function LoginForm() {
  const t = useTranslations('Auth');
  const { form, globalError, onSubmit, isLoading } = useLogin();
  const { register, formState: { errors } } = form;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthCard maxWidth="max-w-[420px]">
      <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('login_title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('login_subtitle')}</p>
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
          <Label htmlFor="username">{t('username_label')}</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <Input
              id="username"
              type="text"
              placeholder={t('username_placeholder')}
              className="pl-10"
              disabled={isLoading}
              error={!!errors.username}
              {...register('username')}
            />
          </div>
          {errors.username?.message && (
            <p className="text-destructive text-xs">{t(errors.username.message)}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password_label')}</Label>
            <Link href="#" className="text-primary hover:text-primary-hover text-xs font-medium hover:underline">
              {t('forgot_password')}
            </Link>
          </div>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('password_placeholder')}
              className="pr-10 pl-10"
              disabled={isLoading}
              error={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex w-10 items-center justify-center focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-destructive text-xs">{t(errors.password.message)}</p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full text-base"
            variant="primary"
            isLoading={isLoading}
            loadingText={t('logging_in')}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{t('login_button')}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>
          </Button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="text-muted-foreground mt-8 text-center text-sm">
        {t('no_account')}{' '}
        <Link
          href="/register"
          className="text-primary hover:text-primary-hover font-semibold hover:underline"
        >
          {t('register_link')}
        </Link>
      </motion.div>
    </AuthCard>
  );
}
