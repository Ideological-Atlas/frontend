'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
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

export function RegisterForm() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('password_mismatch'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.registerCreate({
        email: formData.email,
        password: formData.password,
      });

      login({ access: response.access, refresh: response.refresh, user: response.user });
      router.push(`/${locale}/welcome`);
    } catch (err) {
      if (err instanceof ApiError) {
        const errorBody = err.body as Record<string, string[]>;
        setError(errorBody?.email?.[0] || errorBody?.password?.[0] || t('register_error'));
      } else {
        setError(t('network_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <Label htmlFor="email">{t('email_label')}</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder')}
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">{t('password_label')}</Label>
            <div className="relative">
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirm_password_label')}</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className="pl-4"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-3 rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <span className="material-symbols-outlined shrink-0 text-[20px]">info</span>
          <p className="text-xs leading-relaxed">{t('password_requirements')}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary-hover w-full text-base"
            variant="primary"
            isLoading={isLoading}
            loadingText={t('registering')}
          >
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
