import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterSchema } from '@/lib/schemas/auth';
import { AuthService } from '@/lib/client/services/AuthService';
import { useAuthStore } from '@/store/useAuthStore';
import { ApiError } from '@/lib/client/core/ApiError';

export function useRegister() {
  const locale = useLocale();
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
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
    try {
      const response = await AuthService.registerCreate({
        email: data.email,
        password: data.password,
      });
      
      login({ access: response.access, refresh: response.refresh, user: response.user });
      router.push(`/${locale}/welcome`);
    } catch (err) {
      if (err instanceof ApiError) {
        const errorBody = err.body as Record<string, string[]>;
        if (errorBody?.email?.[0]) {
          form.setError('email', { type: 'manual', message: errorBody.email[0] });
        } else if (errorBody?.password?.[0]) {
          form.setError('password', { type: 'manual', message: errorBody.password[0] });
        } else {
          setGlobalError('register_error');
        }
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
