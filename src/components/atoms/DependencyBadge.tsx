'use client';

import { useTranslations } from 'next-intl';

interface DependencyBadgeProps {
  names: string[];
}

export function DependencyBadge({ names }: DependencyBadgeProps) {
  const t = useTranslations('Atlas');

  if (!names || names.length === 0) return null;

  return (
    <div className="group absolute top-0 right-0 z-40">
      <div className="text-primary-foreground bg-accent-strong flex h-7 cursor-help items-center justify-center rounded-tr-xl rounded-bl-xl px-3 text-[10px] font-black tracking-widest uppercase shadow-sm transition-colors hover:brightness-110">
        {t('conditioned_label')}
      </div>

      <div className="border-border/50 invisible absolute top-full right-0 z-50 mt-1 w-64 origin-top-right rounded-xl border bg-zinc-950 p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
          <span className="material-symbols-outlined text-accent-strong text-[16px]">link</span>
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            {t('depends_on_label')}
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {names.map((name, i) => (
            <li key={i} className="flex items-start gap-2 text-xs font-medium text-zinc-100">
              <span className="bg-accent-strong mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full text-current" />
              <span className="leading-tight">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
