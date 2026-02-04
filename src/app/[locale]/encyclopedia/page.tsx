import { getTranslations } from 'next-intl/server';
import { EncyclopediaView } from '@/components/organisms/EncyclopediaView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Encyclopedia' });
  return {
    title: `${t('title')} | Ideological Atlas`,
    description: t('subtitle'),
  };
}

export default function EncyclopediaPage() {
  return (
    <div className="bg-background min-h-screen">
      <EncyclopediaView />
    </div>
  );
}
