import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { LoginForm } from '@/components/organisms/auth/LoginForm';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });

  return {
    title: `${t('login_title')} | Ideological Atlas`,
    description: t('login_subtitle'),
  };
}

export default function LoginPage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
