import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { ResetPasswordForm } from '@/components/organisms/auth/ResetPasswordForm';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Auth' });
  return {
    title: `${t('reset_password_title')} | Ideological Atlas`,
    description: t('reset_password_subtitle'),
  };
}

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <AuthTemplate>
      <ResetPasswordForm token={token} />
    </AuthTemplate>
  );
}
