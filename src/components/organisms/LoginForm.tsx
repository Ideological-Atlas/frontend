'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';

export function LoginForm() {
  const t = useTranslations('Auth');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt');
    // TODO: Connect with AuthService
  };

  const handleGoogleLogin = () => {
    console.log('Google login attempt');
    // TODO: Connect with AuthService
  };

  return (
    <div className="bg-card border-border w-full max-w-[420px] rounded-2xl border p-8 shadow-2xl">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('login_title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('login_subtitle')}</p>
      </div>

      {/* Social Login */}
      <GoogleButton onClick={handleGoogleLogin} />

      <Divider />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">{t('username_label')}</Label>
          <div className="relative">
            {/* Icono de persona para indicar usuario/email */}
            <div className="text-muted-foreground pointer-events-none absolute top-0 bottom-0 left-0 flex w-10 items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <Input id="username" type="text" placeholder={t('username_placeholder')} className="pl-10" required />
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
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0 bottom-0 flex w-10 items-center justify-center focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full text-base" variant="primary">
          <div className="flex items-center justify-center gap-2">
            <span>{t('login_button')}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </Button>
      </form>

      {/* Footer Links */}
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
