import { useTranslations } from 'next-intl';
import { FeatureCard } from '../molecules/FeatureCard';

export function Features() {
  const t = useTranslations('Features');

  return (
    <div className="dark:bg-surface-dark/30 flex flex-1 justify-center bg-slate-50 px-5 py-5 md:px-20 xl:px-40">
      <div className="layout-content-container flex max-w-[1200px] flex-1 flex-col">
        <div className="@container flex flex-col gap-10 px-4 py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="tracking-light max-w-[720px] text-[32px] leading-tight font-bold text-slate-900 md:text-4xl dark:text-white">
              {t('title')}
            </h1>
            <p className="max-w-[720px] text-base leading-normal font-normal text-slate-600 dark:text-slate-400">
              {t('subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon="linear_scale"
              title={t('cards.spectrum.title')}
              description={t('cards.spectrum.description')}
            />
            <FeatureCard
              icon="explore"
              title={t('cards.exploration.title')}
              description={t('cards.exploration.description')}
            />
            <FeatureCard
              icon="query_stats"
              title={t('cards.analysis.title')}
              description={t('cards.analysis.description')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
