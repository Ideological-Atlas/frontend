import { IdeologyAtlasView } from '@/components/organisms/Atlas/IdeologyAtlasView';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Encyclopedia' });
  return {
    title: `${t('title')} - Definitions | Ideological Atlas`,
  };
}

export default async function IdeologyDefinitionsPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return (
    <div className="bg-background min-h-screen">
      <IdeologyAtlasView uuid={uuid} />
    </div>
  );
}
