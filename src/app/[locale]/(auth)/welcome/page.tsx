import { AuthTemplate } from '@/components/templates/AuthTemplate';
import { PostRegisterStatus } from '@/components/organisms/PostRegisterStatus';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '¡Bienvenido! | Ideological Atlas',
};

export default function WelcomePage() {
  return (
    <AuthTemplate>
      <PostRegisterStatus />
    </AuthTemplate>
  );
}
