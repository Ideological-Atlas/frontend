'use client';

import { clsx } from 'clsx';

interface IdeologyBadgeProps {
  children: React.ReactNode;
  icon?: string;
}

export function IdeologyBadge({ children, icon }: IdeologyBadgeProps) {
  return (
    <span
      className={clsx(
        'flex items-center gap-1 rounded border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md',
      )}
    >
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {children}
    </span>
  );
}
