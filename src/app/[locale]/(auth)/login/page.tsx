import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { LoginForm } from '@/components/organisms/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Ideological Atlas',
  description: 'Inicia sesión para acceder a tu perfil ideológico.',
};

export default function LoginPage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
