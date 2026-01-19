'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations('Auth');
  const { form, viewState, globalError, onSubmit, isLoading, navigateLogin } = useResetPassword(token);
  const {
    register,
    formState: { errors },
  } = form;
  const [showPassword, setShowPassword] = useState(false);

  const renderContent = () => {
    switch (viewState) {
      case 'verifying':
        return (
          <motion.div
            key="verifying"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-10"
          >
            <div className="bg-primary/10 flex h-16 w-16 animate-pulse items-center justify-center rounded-full">
              <span className="material-symbols-outlined text-primary animate-spin text-[32px]">sync</span>
            </div>
            <p className="text-muted-foreground mt-6 text-sm font-medium">{t('verifying_token')}</p>
          </motion.div>
        );

      case 'invalid':
        return (
          <motion.div key="invalid" initial="hidden" animate="visible" exit="hidden" className="w-full">
            <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
              <div className="bg-destructive/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-destructive text-[40px]">link_off</span>
              </div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('invalid_token_title')}</h1>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
                {t('invalid_token_description')}
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button onClick={navigateLogin} variant="primary" className="w-full" size="lg">
                {t('back_to_login')}
              </Button>
            </motion.div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div key="success" initial="hidden" animate="visible" exit="hidden" className="w-full">
            <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <span className="material-symbols-outlined text-[40px] text-green-500">check_circle</span>
              </div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('password_updated_title')}</h1>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
                {t('password_updated_description')}
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button onClick={navigateLogin} variant="primary" className="w-full" size="lg">
                {t('go_to_login_button')}
              </Button>
            </motion.div>
          </motion.div>
        );

      case 'valid':
      default:
        return (
          <motion.div key="valid" initial="hidden" animate="visible" exit="hidden" className="w-full">
            <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center text-center">
              <div className="bg-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="material-symbols-outlined text-primary text-[32px]">lock_reset</span>
              </div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('reset_password_title')}</h1>
              <p className="text-muted-foreground mt-2 text-base leading-relaxed font-normal">
                {t('reset_password_subtitle')}
              </p>
            </motion.div>

            {globalError && (
              <motion.div
                variants={itemVariants}
                className="bg-destructive/10 text-destructive border-destructive/20 mb-6 rounded-lg border p-3 text-center text-sm"
              >
                {t(globalError)}
              </motion.div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password">{t('new_password_label')}</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  disabled={isLoading}
                  error={!!errors.password}
                  startIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-foreground flex items-center justify-center focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  }
                  {...register('password')}
                />
                {errors.password?.message && <p className="text-destructive text-xs">{t(errors.password.message)}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirm_new_password_label')}</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  className="pl-4"
                  disabled={isLoading}
                  error={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword?.message && (
                  <p className="text-destructive text-xs">{t(errors.confirmPassword.message)}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-3 rounded-lg bg-blue-500/10 p-3 text-blue-400">
                <span className="material-symbols-outlined shrink-0 text-[20px]">info</span>
                <p className="text-xs leading-relaxed">{t('password_requirements')}</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading} loadingText={t('updating')}>
                  {t('update_password_button')}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        );
    }
  };

  return (
    <AuthCard maxWidth="max-w-[480px]">
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </AuthCard>
  );
}
