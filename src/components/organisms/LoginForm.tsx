'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';

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
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
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

      login({
        access: response.access,
        refresh: response.refresh,
        user: response.user,
      });

      router.push(`/${locale}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        } else {
          setError('Ocurrió un error al iniciar sesión. Inténtalo más tarde.');
        }
      } else {
        setError('Error de conexión. Comprueba tu internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border-border w-full max-w-[420px] rounded-2xl border p-8 shadow-2xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('login_title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('login_subtitle')}</p>
      </div>

      <GoogleButton />

      <Divider />

      {error && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 mb-6 rounded-lg border p-3 text-center text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">{t('username_label')}</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-0 bottom-0 left-0 flex w-10 items-center justify-center">
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password_label')}</Label>
            <Link href="#" className="text-primary hover:text-primary-hover text-xs font-medium hover:underline">
              {t('forgot_password')}
            </Link>
          </div>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-0 bottom-0 left-0 flex w-10 items-center justify-center">
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
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0 bottom-0 flex w-10 items-center justify-center focus:outline-none disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

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
      </form>

      <div className="text-muted-foreground mt-8 text-center text-sm">
        {t('no_account')}{' '}
        <Link href="/register" className="text-primary hover:text-primary-hover font-semibold hover:underline">
          {t('register_link')}
        </Link>
      </div>

      <div className="border-border text-muted-foreground/50 mt-8 border-t pt-6 text-center text-xs">
        {t('copyright')}
      </div>
    </div>
  );
}
