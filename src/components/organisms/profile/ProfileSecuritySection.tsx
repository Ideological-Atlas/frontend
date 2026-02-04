'use client';

import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import type { ProfileSchema } from '@/lib/schemas/profile';
import type { Me } from '@/lib/client/models/Me';

interface ProfileSecuritySectionProps {
  register: UseFormRegister<ProfileSchema>;
  errors: FieldErrors<ProfileSchema>;
  user: Me;
}

export function ProfileSecuritySection({ register, errors, user }: ProfileSecuritySectionProps) {
  const t = useTranslations('Profile');
  const tAuth = useTranslations('Auth');

  return (
    <section id="security" className="bg-card border-border scroll-mt-28 rounded-2xl border p-6 shadow-sm md:p-8">
      <div className="border-border mb-6 border-b pb-4">
        <h2 className="text-foreground text-xl font-bold">{t('security_title')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('security_desc')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">{tAuth('email_label')}</Label>
          {!user.is_verified && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-medium text-amber-600 dark:text-amber-500">
              <span className="material-symbols-outlined text-[18px]">mark_email_unread</span>
              {t('email_not_verified_warning')}
            </div>
          )}
          <div className="relative">
            <Input id="email" {...register('email')} disabled className="bg-secondary/50 pr-10 opacity-70" />
            {user.is_verified && (
              <span className="material-symbols-outlined absolute top-1/2 right-3 -translate-y-1/2 text-[20px] text-green-500">
                verified
              </span>
            )}
          </div>
        </div>

        <div className="bg-secondary/30 border-border/50 rounded-xl border p-6">
          <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-bold">
            <div className="bg-primary/10 text-primary rounded-md p-1.5">
              <span className="material-symbols-outlined block text-[18px]">lock</span>
            </div>
            {t('change_password_title')}
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new_password">{t('new_password_label')}</Label>
              <Input
                id="new_password"
                type="password"
                {...register('new_password')}
                error={!!errors.new_password}
                placeholder="••••••••"
                className={clsx(!errors.new_password && 'bg-background')}
              />
              {errors.new_password?.message && (
                <p className="text-destructive mt-1 text-xs font-medium">{tAuth(errors.new_password.message)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">{tAuth('confirm_password_label')}</Label>
              <Input
                id="confirm_password"
                type="password"
                {...register('confirm_password')}
                error={!!errors.confirm_password}
                placeholder="••••••••"
                className={clsx(!errors.confirm_password && 'bg-background')}
              />
              {errors.confirm_password?.message && (
                <p className="text-destructive mt-1 text-xs font-medium">{tAuth(errors.confirm_password.message)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
