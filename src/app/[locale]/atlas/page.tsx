import { AtlasView } from '@/components/organisms/Atlas/AtlasView';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Atlas' });

  return {
    title: `${t('header_title')} | Ideological Atlas`,
    description: t('header_description'),
  };
}

export default function AtlasPage() {
  return (
    <div className="bg-background min-h-screen">
      <AtlasView />
    </div>
  );
}
