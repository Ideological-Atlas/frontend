import { z } from 'zod';
import { AppearanceEnum } from '@/lib/client/models/AppearanceEnum';

export const profileSchema = z
  .object({
    username: z
      .string()
      .min(1, 'required')
      .max(150, 'max_length')
      .regex(/^[a-zA-Z0-9@.+-_]+$/, 'invalid_username_format'),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().email('invalid_email'),
    bio: z.string().optional().nullable(),
    website: z.string().url('invalid_url').optional().or(z.literal('')),
    appearance: z.nativeEnum(AppearanceEnum).optional(),
    preferred_language: z.string().optional(),
    is_public: z.boolean().optional(),
    new_password: z.string().min(8, 'password_too_short').optional().or(z.literal('')),
    confirm_password: z.string().optional().or(z.literal('')),
  })
  .refine(
    data => {
      if (data.new_password && data.new_password.length > 0) {
        return data.new_password === data.confirm_password;
      }
      return true;
    },
    {
      message: 'password_mismatch',
      path: ['confirm_password'],
    },
  );

export type ProfileSchema = z.infer<typeof profileSchema>;
