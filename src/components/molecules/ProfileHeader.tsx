'use client';

import { useTranslations } from 'next-intl';
import type { SimpleUser } from '@/lib/client/models/SimpleUser';

interface ProfileHeaderProps {
  user: SimpleUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const t = useTranslations('Atlas');
  const initial = user.username ? user.username.substring(0, 2).toUpperCase() : '??';
  return (
    <div className="bg-card border-border mb-8 flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 shadow-sm md:flex-row md:items-center">
      <div className="flex items-center gap-5">
        <div className="bg-other-user flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-black text-white shadow-lg">
          {initial}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-foreground text-xl font-bold md:text-2xl">@{user.username}</h1>
          <div className="flex gap-2 pt-1">
            <div className="bg-secondary/50 text-muted-foreground flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold tracking-wider uppercase">
              {user.bio || t('atlas_profile_label') || 'Perfil Atlas'}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="bg-secondary/30 h-10 w-32 rounded-lg"></div>
      </div>
    </div>
  );
}
