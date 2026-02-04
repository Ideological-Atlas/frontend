'use client';

import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import type { ProfileSchema } from '@/lib/schemas/profile';

interface ProfilePublicSectionProps {
  register: UseFormRegister<ProfileSchema>;
  errors: FieldErrors<ProfileSchema>;
}

export function ProfilePublicSection({ register, errors }: ProfilePublicSectionProps) {
  const t = useTranslations('Profile');
  const tAuth = useTranslations('Auth');

  const getErrorMessage = (msg?: string) => {
    if (!msg) return null;
    return msg.includes(' ') ? msg : tAuth(msg);
  };

  return (
    <section
      id="public-profile"
      className="bg-card border-border scroll-mt-28 rounded-2xl border p-6 shadow-sm md:p-8"
    >
      <div className="border-border mb-6 border-b pb-4">
        <h2 className="text-foreground text-xl font-bold">{t('public_profile')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('public_profile_desc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-1 space-y-2 md:col-span-2">
          <Label htmlFor="username">{tAuth('username_label')}</Label>
          <div className="group relative">
            <span
              className={clsx(
                'absolute top-1/2 left-3 -translate-y-1/2 transition-colors',
                errors.username ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary',
              )}
            >
              @
            </span>
            <Input
              id="username"
              {...register('username')}
              className={clsx('pl-8', !errors.username && 'bg-background')}
              error={!!errors.username}
            />
          </div>
          {errors.username?.message && (
            <p className="text-destructive mt-1 text-xs font-medium">{getErrorMessage(errors.username.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_name">{t('first_name_label')}</Label>
          <Input id="first_name" {...register('first_name')} className="bg-background" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">{t('last_name_label')}</Label>
          <Input id="last_name" {...register('last_name')} className="bg-background" />
        </div>

        <div className="col-span-1 space-y-2 md:col-span-2">
          <Label htmlFor="bio">{t('bio_label')}</Label>
          <textarea
            id="bio"
            className="border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary flex min-h-[120px] w-full resize-y rounded-lg border px-4 py-3 text-sm transition-all focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register('bio')}
          />
        </div>
      </div>
    </section>
  );
}
