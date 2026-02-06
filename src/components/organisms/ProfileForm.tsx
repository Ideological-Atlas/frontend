'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/atoms/Button';
import { Dropdown } from '@/components/atoms/Dropdown';
import { Label } from '@/components/atoms/Label';
import { AppearanceEnum } from '@/lib/client/models/AppearanceEnum';
import Link from 'next/link';
import { ProfilePublicSection } from './profile/ProfilePublicSection';
import { ProfileSecuritySection } from './profile/ProfileSecuritySection';

export function ProfileForm() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const { form, onSubmit, isLoading, isSuccess, user } = useProfile();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentAppearance = watch('appearance') || AppearanceEnum.AUTO;
  const currentLang = watch('preferred_language') || 'es';
  const isPublic = watch('is_public');

  if (!user) return null;

  const menuItems = [
    { id: 'public-profile', icon: 'person', label: t('public_profile') },
    { id: 'preferences', icon: 'tune', label: t('preferences_title') },
    { id: 'security', icon: 'shield', label: t('security_title') },
    { id: 'privacy', icon: 'visibility', label: t('privacy_title') },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const displayBio = user.bio ? (user.bio.length > 255 ? user.bio.substring(0, 255) + '...' : user.bio) : '';

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-20">
      <div className="bg-card border-border relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border p-6 shadow-sm md:flex-row md:p-8">
        <div className="from-primary via-accent to-primary absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-50" />
        <div className="z-10 flex w-full items-center gap-6 md:w-auto">
          <div className="relative flex shrink-0 items-center justify-center">
            <div className="bg-card relative z-10 flex h-20 w-20 items-center justify-center rounded-full p-[4px]">
              <div className="from-primary/20 to-secondary text-primary flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-3xl font-black shadow-inner">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-foreground truncate text-2xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed break-words">{displayBio}</p>
          </div>
        </div>
        <Link href={`/${locale}/answers/${user.uuid}`} className="shrink-0">
          <Button variant="primary" className="shadow-primary/20 shadow-lg">
            {t('view_public_profile')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-3">
          <div>
            <h3 className="text-muted-foreground mb-3 px-2 text-xs font-bold tracking-wider uppercase">
              {t('menu_configuration')}
            </h3>
            <nav className="flex flex-col gap-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 group flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all"
                >
                  <span className="material-symbols-outlined group-hover:text-primary text-[20px] transition-colors">
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <form onSubmit={onSubmit} className="space-y-8">
            <ProfilePublicSection register={register} errors={errors} />

            <section
              id="preferences"
              className="bg-card border-border scroll-mt-28 rounded-2xl border p-6 shadow-sm md:p-8"
            >
              <div className="border-border mb-6 border-b pb-4">
                <h2 className="text-foreground text-xl font-bold">{t('preferences_title')}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{t('preferences_desc')}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('language_label')}</Label>
                  <Dropdown
                    value={currentLang}
                    options={['es', 'en']}
                    onChange={val => setValue('preferred_language', val, { shouldDirty: true })}
                    label={t('language_select')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('appearance_label')}</Label>
                  <Dropdown
                    value={currentAppearance}
                    options={Object.values(AppearanceEnum)}
                    onChange={val => setValue('appearance', val as AppearanceEnum, { shouldDirty: true })}
                    label={t('theme_select')}
                  />
                </div>
              </div>
            </section>

            <ProfileSecuritySection register={register} errors={errors} user={user} />

            <section
              id="privacy"
              className="bg-card border-border scroll-mt-28 rounded-2xl border p-6 shadow-sm md:p-8"
            >
              <div className="border-border mb-6 border-b pb-4">
                <h2 className="text-foreground text-xl font-bold">{t('privacy_title')}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{t('privacy_desc')}</p>
              </div>
              <div className="bg-secondary/10 border-border/50 flex items-center justify-between rounded-xl border p-5">
                <div className="space-y-1">
                  <Label className="text-base font-semibold">{t('visibility_label')}</Label>
                  <p className="text-muted-foreground max-w-[400px] text-xs">{t('visibility_description')}</p>
                </div>
                <div className="w-[160px]">
                  <Dropdown
                    value={isPublic ? t('public') : t('private')}
                    options={[t('public'), t('private')]}
                    onChange={val => setValue('is_public', val === t('public'), { shouldDirty: true })}
                    align="end"
                  />
                </div>
              </div>
            </section>

            <div className="bg-card/80 border-border sticky bottom-6 z-20 flex justify-end gap-4 rounded-xl border p-4 shadow-2xl backdrop-blur-md">
              <Button type="button" variant="ghost" onClick={() => window.location.reload()} disabled={isLoading}>
                {tCommon('cancel')}
              </Button>
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className={isSuccess ? 'w-[180px] bg-green-600 hover:bg-green-700' : 'w-[180px]'}
              >
                {isSuccess ? (
                  <>
                    <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
                    {t('saved')}
                  </>
                ) : (
                  t('save_changes')
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
