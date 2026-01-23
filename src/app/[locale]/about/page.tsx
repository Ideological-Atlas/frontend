import { getTranslations } from 'next-intl/server';
import { AboutView } from '@/components/organisms/AboutView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  return {
    title: `${t('hero.title')} | Ideological Atlas`,
    description: t('hero.subtitle'),
  };
}

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <AboutView />
    </div>
  );
}
