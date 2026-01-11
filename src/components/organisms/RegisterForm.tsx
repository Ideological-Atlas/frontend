'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/molecules/Divider';
import { GoogleButton } from '@/components/molecules/GoogleButton';

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

    if (formData.password !== formData.confirmPassword) {
      setError(t('password_mismatch') || 'Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthService.registerCreate({
        email: formData.email,
        password: formData.password,
      });

      // Auto-Login logic
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
        const errorBody = err.body as Record<string, string[]>;
        if (errorBody?.email) {
          setError(errorBody.email[0]);
        } else if (errorBody?.password) {
          setError(errorBody.password[0]);
        } else {
          setError(t('register_error') || 'Error al crear la cuenta. Inténtalo de nuevo.');
        }
      } else {
        setError(t('network_error') || 'Error de conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border-border w-full max-w-[480px] rounded-2xl border p-8 shadow-2xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-foreground text-3xl font-black tracking-tight">{t('register_title') || 'Crear Cuenta'}</h1>
        <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
          {t('register_subtitle') || 'Regístrate para establecer tu perfil ideológico y explorar el espectro.'}
        </p>
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
          <Label htmlFor="email">{t('email_label') || 'Correo electrónico'}</Label>
          <div className="relative">
            <div className="text-muted-foreground pointer-events-none absolute top-0 bottom-0 left-0 flex w-10 items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <Input
              id="email"
              type="email"
              placeholder={t('email_placeholder') || 'correo@ejemplo.com'}
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">{t('password_label') || 'Contraseña'}</Label>
            <div className="relative">
              <div className="text-muted-foreground pointer-events-none absolute top-0 bottom-0 left-0 flex w-10 items-center justify-center">
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
                className="text-muted-foreground hover:text-foreground absolute top-0 right-0 bottom-0 flex w-10 items-center justify-center focus:outline-none disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirm_password_label') || 'Confirmar'}</Label>
            <div className="relative">
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
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-blue-500/10 p-3 text-blue-400">
          <span className="material-symbols-outlined shrink-0 text-[20px]">info</span>
          <p className="text-xs leading-relaxed">
            {t('password_requirements') ||
              'La contraseña debe tener al menos 7 caracteres, no puede ser totalmente numérica ni demasiado común o similar a tus datos.'}
          </p>
        </div>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary-hover w-full text-base"
          variant="primary"
          isLoading={isLoading}
          loadingText={t('registering') || 'Registrando...'}
        >
          {t('register_button') || 'Registrarse'}
        </Button>
      </form>

      <div className="text-muted-foreground mt-8 text-center text-sm">
        {t('has_account') || '¿Ya tienes cuenta?'}{' '}
        <Link href="/login" className="text-primary hover:text-primary-hover font-semibold hover:underline">
          {t('login_link') || 'Iniciar Sesión'}
        </Link>
      </div>
    </div>
  );
}
