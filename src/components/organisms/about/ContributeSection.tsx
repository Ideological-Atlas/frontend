import { useTranslations } from 'next-intl';
import { Button } from '@/components/atoms/Button';
import { InfoGrid } from '@/components/molecules/InfoGrid';
import { env } from '@/env';

export function ContributeSection() {
  const t = useTranslations('AboutPage');

  const contributeItems = [
    { icon: 'code', title: t('contribute.role_dev'), description: t('contribute.role_dev_desc') },
    { icon: 'school', title: t('contribute.role_research'), description: t('contribute.role_research_desc') },
    { icon: 'palette', title: t('contribute.role_design'), description: t('contribute.role_design_desc') },
    { icon: 'lightbulb', title: t('contribute.role_product'), description: t('contribute.role_product_desc') },
    { icon: 'bar_chart', title: t('contribute.role_data'), description: t('contribute.role_data_desc') },
    { icon: 'translate', title: t('contribute.role_translate'), description: t('contribute.role_translate_desc') },
  ];

  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-6 py-16 text-center shadow-2xl">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-6 text-3xl font-black">{t('contribute.title')}</h2>
        <p className="mb-10 text-xl opacity-90">{t('contribute.subtitle')}</p>

        <InfoGrid items={contributeItems} className="mb-10" />

        <a href={env.NEXT_PUBLIC_GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg" className="font-bold shadow-lg">
            <span className="material-symbols-outlined mr-2">group_add</span>
            GitHub Repository
          </Button>
        </a>
      </div>
    </section>
  );
}
