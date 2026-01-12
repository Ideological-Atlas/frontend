import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { VerifyStatus } from '@/components/organisms/VerifyStatus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificación | Ideological Atlas',
  description: 'Verificando tu cuenta de usuario.',
};

export default function VerifyPage() {
  return (
    <AuthTemplate>
      <VerifyStatus />
    </AuthTemplate>
  );
}
