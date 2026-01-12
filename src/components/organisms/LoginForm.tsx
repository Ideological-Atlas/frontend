'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';

import { AuthService } from '@/lib/client/services/AuthService';
import { ApiError } from '@/lib/client/core/ApiError';
import { useAuthStore } from '@/store/useAuthStore';

export function LoginForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.tokenLoginCreate({
        username: formData.username,
        password: formData.password,
      });

      login({ access: response.access, refresh: response.refresh, user: response.user });
      router.push(`/${locale}`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? t('invalid_credentials') : t('login_error'));
      } else {
        setError(t('network_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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

      {error && (
        <motion.div
          variants={itemVariants}
          className="bg-destructive/10 text-destructive border-destructive/20 mb-6 rounded-lg border p-3 text-center text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
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
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
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
          href={`/${locale}/register`}
          className="text-primary hover:text-primary-hover font-semibold hover:underline"
        >
          {t('register_link')}
        </Link>
      </motion.div>
    </AuthCard>
  );
}
