import { PublicAtlasView } from '@/components/organisms/Atlas/PublicAtlasView';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Atlas' });

  return {
    title: `${t('public_profile_title')} | Ideological Atlas`,
    description: t('public_profile_description'),
  };
}

export default async function PublicAnswerPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params;
  return (
    <div className="bg-background min-h-screen">
      <PublicAtlasView uuid={uuid} />
    </div>
  );
}
