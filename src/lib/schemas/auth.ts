import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
});

export const registerSchema = z
  .object({
    email: z.email({ message: 'invalid_email' }),
    password: z.string().min(8, 'password_too_short').regex(/[0-9]/, 'password_numeric'),
    confirmPassword: z.string().min(1, 'required'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'password_mismatch',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
