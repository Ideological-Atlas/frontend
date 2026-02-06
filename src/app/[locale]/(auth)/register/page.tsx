import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { RegisterForm } from '@/components/organisms/auth/RegisterForm';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return {
    title: `${t('register_title')} | Ideological Atlas`,
    description: t('register_subtitle'),
  };
}

export default function RegisterPage() {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
}
