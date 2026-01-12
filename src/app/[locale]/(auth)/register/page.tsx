import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { RegisterForm } from '@/components/organisms/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Cuenta | Ideological Atlas',
  description: 'Regístrate para establecer tu perfil ideológico.',
};

export default function RegisterPage() {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
}
