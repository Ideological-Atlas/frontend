import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '@/lib/schemas/auth';
import { registerAction } from '@/actions/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';

export function useRegister() {
  const locale = useLocale();
  const router = useRouter();
  const loginSuccess = useAuthStore(state => state.loginSuccess);
  const resetAtlas = useAtlasStore(state => state.reset);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setGlobalError(null);

    const result = await registerAction(data);

    if (result.success && result.user) {
      resetAtlas();
      loginSuccess(result.user);
      router.push(`/${locale}/welcome`);
    } else {
      const errorBody = result.errorBody as Record<string, string[]>;
      if (errorBody?.email?.[0]) {
        form.setError('email', { type: 'manual', message: errorBody.email[0] });
      } else if (errorBody?.password?.[0]) {
        form.setError('password', { type: 'manual', message: errorBody.password[0] });
      } else {
        setGlobalError('register_error');
      }
    }
  };

  return {
    form,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
