import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | Ideological Atlas',
  description: 'Establece una nueva contraseña segura para tu cuenta.',
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <AuthTemplate>
      <ResetPasswordForm token={token} />
    </AuthTemplate>
  );
}
