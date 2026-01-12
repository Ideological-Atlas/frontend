import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginSchema } from '@/lib/schemas/auth';
import { AuthService } from '@/lib/client/services/AuthService';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/client/core/ApiError';

export function useLogin() {
  const locale = useLocale();
  const router = useRouter();
  const login = useAuthStore(state => state.login);
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
    try {
      const response = await AuthService.tokenLoginCreate(data);
      login({
        access: response.access,
        refresh: response.refresh,
        user: response.user,
      });
      router.push(`/${locale}`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setGlobalError(err.status === 401 ? 'invalid_credentials' : 'login_error');
      } else {
        setGlobalError('network_error');
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
