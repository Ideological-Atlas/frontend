'use client';

import { useTranslations } from 'next-intl';
import { HeroSection } from '@/components/molecules/HeroSection';
import { FeatureSplit } from '@/components/molecules/FeatureSplit';
import { AlgorithmSection } from '@/components/organisms/about/AlgorithmSection';
import { ContributeSection } from '@/components/organisms/about/ContributeSection';
import { env } from '@/env';

export function AboutView() {
  const t = useTranslations('AboutPage');

  return (
    <div className="relative flex w-full flex-col overflow-hidden">
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        primaryAction={{
          label: t('hero.github_btn'),
          href: env.NEXT_PUBLIC_GITHUB_URL,
          icon: 'code',
        }}
      />

      <div className="bg-muted/40 border-border w-full border-t py-24">
        <div className="layout-content-container mx-auto w-full max-w-7xl px-6">
          <FeatureSplit
            title={t('story.title')}
            description={
              <>
                <p>{t('story.content_p1')}</p>
                <p>{t('story.content_p2')}</p>
              </>
            }
            imageSrc={env.NEXT_PUBLIC_HERO_IMAGE_URL}
            imageAlt="Ideological Atlas Viz"
            quote={t('story.quote')}
          />

          <AlgorithmSection />

          <ContributeSection />
        </div>
      </div>
    </div>
  );
}
