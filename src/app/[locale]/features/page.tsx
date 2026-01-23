import { getTranslations } from 'next-intl/server';
import { FeaturesView } from '@/components/organisms/FeaturesView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'FeaturesPage' });
  return {
    title: `${t('hero_title')} | Ideological Atlas`,
    description: t('hero_subtitle'),
  };
}

export default function FeaturesPage() {
  return (
    <div className="bg-background min-h-screen">
      <FeaturesView />
    </div>
  );
}
