import { DiscoveryView } from '@/components/organisms/Atlas/DiscoveryView';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Atlas' });
  return {
    title: `${t('discovery_title')} | Ideological Atlas`,
  };
}

export default function DiscoveryPage() {
  return (
    <div className="bg-background min-h-screen">
      <DiscoveryView />
    </div>
  );
}
