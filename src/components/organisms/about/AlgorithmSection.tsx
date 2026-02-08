import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { AlgorithmCard } from '@/components/molecules/about/AlgorithmCard';
import { AggregationFlow } from '@/components/molecules/AggregationFlow';

export function AlgorithmSection() {
  const t = useTranslations('AboutPage');

  return (
    <section className="mb-32">
      <SectionHeader title={t('algorithm.title')} subtitle={t('algorithm.subtitle')} className="mb-16" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AlgorithmCard
          title={t('algorithm.indifference_title')}
          description={t('algorithm.indifference_desc')}
          icon="sentiment_neutral"
          delay={0.1}
          formula={
            <div className="flex flex-col gap-1 text-center">
              <span>{t('algorithm.indifference_formula_both')}</span>
              <span>{t('algorithm.indifference_formula_one')}</span>
            </div>
          }
        />
        <AlgorithmCard
          title={t('algorithm.quadratic_title')}
          description={t('algorithm.quadratic_desc')}
          icon="function"
          delay={0.2}
          formula={
            <div className="flex flex-col gap-1 text-[10px]">
              <span>Overlap: A = 50 + 50(1 - r)²</span>
              <span>Gap: A = 50(1 - r)²</span>
            </div>
          }
        />
        <AlgorithmCard
          title={t('algorithm.modifiers_title')}
          description={t('algorithm.modifiers_desc')}
          icon="tune"
          delay={0.3}
          formula={
            <div className="flex flex-col gap-1 text-center">
              <span>{t('algorithm.modifiers_formula_base')}</span>
              <span className="opacity-70">Max: +15 / -20</span>
            </div>
          }
        />
      </div>

      <AggregationFlow
        title={t('algorithm.aggregation_title')}
        description={t('algorithm.aggregation_desc')}
        steps={[
          t('algorithm.step_axis'),
          t('algorithm.step_section'),
          t('algorithm.step_complexity'),
          t('algorithm.step_global'),
        ]}
      />
    </section>
  );
}
