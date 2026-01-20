import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { profileSchema, type ProfileSchema } from '@/lib/schemas/profile';
import { UsersService } from '@/lib/client/services/UsersService';
import { useAuthStore } from '@/store/useAuthStore';
import { AppearanceEnum } from '@/lib/client/models/AppearanceEnum';
import { ApiError } from '@/lib/client/core/ApiError';

export function useProfile() {
  const { user, setUser } = useAuthStore();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      bio: '',
      website: '',
      appearance: AppearanceEnum.AUTO,
      preferred_language: 'es',
      is_public: false,
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        bio: user.bio || '',
        appearance: user.appearance || AppearanceEnum.AUTO,
        preferred_language: user.preferred_language || 'es',
        is_public: user.is_public || false,
        website: '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileSchema) => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const updatedUser = await UsersService.mePartialUpdate({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        appearance: data.appearance,
        preferred_language: data.preferred_language,
        is_public: data.is_public,
      });

      setUser(updatedUser);

      if (data.new_password) {
        await UsersService.mePasswordUpdate({
          new_password: data.new_password,
        });
      }

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);

      if (data.preferred_language && data.preferred_language !== locale) {
        const newPath = pathname.replace(`/${locale}`, `/${data.preferred_language}`);
        router.push(newPath);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError && error.body) {
        const serverErrors = error.body as Record<string, string[]>;
        Object.entries(serverErrors).forEach(([key, messages]) => {
          if (key in data || key === 'username') {
            form.setError(key as keyof ProfileSchema, {
              type: 'server',
              message: messages[0],
            });
          }
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    isSuccess,
    user,
  };
}
