import { clsx } from 'clsx';
import { WavyBackground } from '@/components/atoms/WavyBackground';
import { useTranslations } from 'next-intl';
import { getAffinityBadgeStyles } from '@/lib/affinity-utils';

interface PageHeaderProps {
  title: string;
  description: string;
  affinity?: number;
  variant?: 'default' | 'other';
}

export function PageHeader({ title, description, affinity, variant = 'default' }: PageHeaderProps) {
  const t = useTranslations('Atlas');
  const affinityStyle = affinity !== undefined ? getAffinityBadgeStyles(affinity) : null;

  return (
    <section className="border-border bg-card relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border p-8 text-center shadow-sm">
      <WavyBackground variant={variant} />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-foreground text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        {affinityStyle && (
          <div
            className={clsx(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur-sm transition-transform hover:scale-105',
              affinityStyle.solidClass,
            )}
          >
            <span className="material-symbols-outlined text-[18px]">percent</span>
            {Math.round(affinity!)}% {t('affinity_short_label') || 'Afinidad'}
          </div>
        )}
        <p className="text-muted-foreground max-w-[600px] text-base leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
