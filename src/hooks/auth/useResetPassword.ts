import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordSchema } from '@/lib/schemas/auth';
import { AuthService } from '@/lib/client/services/AuthService';

type ViewState = 'verifying' | 'valid' | 'invalid' | 'success';

export function useResetPassword(token: string) {
  const locale = useLocale();
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>('verifying');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    let mounted = true;
    const verifyToken = async () => {
      try {
        await AuthService.passwordResetVerifyRetrieve(token);
        if (mounted) setViewState('valid');
      } catch {
        if (mounted) setViewState('invalid');
      }
    };
    if (token) verifyToken();
    return () => {
      mounted = false;
    };
  }, [token]);

  const onSubmit = async (data: ResetPasswordSchema) => {
    setGlobalError(null);
    try {
      await AuthService.passwordResetConfirmCreate(token, { new_password: data.password });
      setViewState('success');
    } catch {
      setGlobalError('reset_password_error');
    }
  };

  const navigateLogin = () => {
    router.push(`/${locale}/login`);
  };

  return {
    form,
    viewState,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
    navigateLogin,
  };
}
