'use client';

import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

interface DependencyBadgeProps {
  names: string[];
  variant?: 'default' | 'other';
}

export function DependencyBadge({ names, variant = 'default' }: DependencyBadgeProps) {
  const t = useTranslations('Atlas');
  const isOther = variant === 'other';
  if (!names || names.length === 0) return null;
  const bgClass = isOther ? 'bg-other-user-strong' : 'bg-accent-strong';
  const fgClass = isOther ? 'text-other-user-strong-foreground' : 'text-primary-foreground';
  const tooltipIconClass = isOther ? 'text-other-user-strong' : 'text-accent-strong';
  return (
    <div className="group absolute top-0 right-0 z-40">
      <div
        className={clsx(
          'flex h-7 cursor-help items-center justify-center rounded-tr-xl rounded-bl-xl px-3 text-[10px] font-black tracking-widest uppercase shadow-sm transition-colors hover:brightness-110',
          bgClass,
          fgClass,
        )}
      >
        {t('conditioned_label')}
      </div>

      <div className="border-border/50 invisible absolute top-full right-0 z-50 mt-1 w-64 origin-top-right rounded-xl border bg-zinc-950 p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
          <span className={clsx('material-symbols-outlined text-[16px]', tooltipIconClass)}>link</span>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            {t('depends_on_label')}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {names.map((name, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-medium text-zinc-100">
              <span className={clsx('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full text-current', bgClass)} />
              <span className="leading-tight">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
