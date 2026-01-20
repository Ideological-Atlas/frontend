import { ProfileForm } from '@/components/organisms/ProfileForm';
import { PageHeader } from '@/components/molecules/PageHeader';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Profile' });
  return {
    title: `${t('page_title')} | Ideological Atlas`,
  };
}

export default async function ProfilePage() {
  const t = await getTranslations('Profile');

  return (
    <div className="bg-background min-h-screen">
      <div className="layout-content-container mx-auto max-w-[1200px] px-5 py-8 md:px-10">
        <div className="mb-10">
          <PageHeader title={t('header_title')} description={t('header_description')} />
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
