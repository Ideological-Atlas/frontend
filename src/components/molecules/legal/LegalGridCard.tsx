'use client';

import { clsx } from 'clsx';

interface LegalGridCardProps {
  icon?: string;
  title: string;
  description: string;
  variant?: 'default' | 'outline';
}

export function LegalGridCard({ icon, title, description, variant = 'default' }: LegalGridCardProps) {
  const isOutline = variant === 'outline';

  return (
    <div
      className={clsx(
        'rounded-xl p-5 transition-colors',
        isOutline
          ? 'bg-secondary/20 border-border hover:border-primary/50 flex cursor-default flex-col gap-2 border'
          : 'bg-secondary/20 border-border border',
      )}
    >
      {icon && !isOutline && (
        <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-primary">{icon}</span>
        </div>
      )}
      <h3 className={clsx('mb-2 font-bold', isOutline ? 'text-primary' : 'text-foreground text-lg')}>{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
