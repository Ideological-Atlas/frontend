import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { ForgotPasswordForm } from '@/components/organisms/auth/ForgotPasswordForm';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });

  return {
    title: `${t('forgot_password_title')} | Ideological Atlas`,
    description: t('forgot_password_subtitle'),
  };
}

export default function ForgotPasswordPage() {
  return (
    <AuthTemplate>
      <ForgotPasswordForm />
    </AuthTemplate>
  );
}
