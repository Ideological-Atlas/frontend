import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/lib/schemas/auth';
import { loginAction } from '@/actions/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useAtlasStore } from '@/store/useAtlasStore';

export function useLogin() {
  const locale = useLocale();
  const router = useRouter();
  const loginSuccess = useAuthStore(state => state.loginSuccess);
  const resetAtlas = useAtlasStore(state => state.reset);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setGlobalError(null);

    const result = await loginAction(data);

    if (result.success && result.user && result.access && result.refresh) {
      resetAtlas();
      loginSuccess(result.user, result.access, result.refresh);
      router.push(`/${locale}`);
      router.refresh();
    } else {
      setGlobalError('invalid_credentials');
    }
  };

  return {
    form,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
