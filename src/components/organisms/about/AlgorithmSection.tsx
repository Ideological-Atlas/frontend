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
        />
        <AlgorithmCard
          title={t('algorithm.quadratic_title')}
          description={t('algorithm.quadratic_desc')}
          icon="function"
          delay={0.2}
          formula={<span>A = 50 * (1 - g/200)²</span>}
        />
        <AlgorithmCard
          title={t('algorithm.phases_title')}
          description={t('algorithm.phases_gap')}
          icon="join_inner"
          delay={0.3}
          formula={<span>Gap vs Overlap Logic</span>}
        />
      </div>

      <AggregationFlow
        title={t('algorithm.aggregation_title')}
        description={t('algorithm.aggregation_desc')}
        steps={['Axis', 'Section', 'Complexity', 'Global']}
      />
    </section>
  );
}
