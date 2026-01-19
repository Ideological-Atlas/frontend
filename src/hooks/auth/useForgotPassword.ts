import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/lib/schemas/auth';
import { AuthService } from '@/lib/client/services/AuthService';

export function useForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setGlobalError(null);
    try {
      await AuthService.passwordResetRequestCreate({ email: data.email });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    }
  };

  return {
    form,
    isSuccess,
    globalError,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting,
  };
}
