import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { PostRegisterStatus } from '@/components/organisms/auth/PostRegisterStatus';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return {
    title: `${t('post_register_title')} | Ideological Atlas`,
  };
}

export default function WelcomePage() {
  return (
    <AuthTemplate>
      <PostRegisterStatus />
    </AuthTemplate>
  );
}
