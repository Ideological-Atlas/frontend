import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { ForgotPasswordForm } from '@/components/organisms/ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | Ideological Atlas',
  description: 'Solicita un enlace para restablecer tu contraseña.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthTemplate>
      <ForgotPasswordForm />
    </AuthTemplate>
  );
}
