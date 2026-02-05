import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { VerifyStatus } from '@/components/organisms/auth/VerifyStatus';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Verify' });
  return {
    title: `${t('title_loading')} | Ideological Atlas`,
  };
}

export default function VerifyPage() {
  return (
    <AuthTemplate>
      <VerifyStatus />
    </AuthTemplate>
  );
}
