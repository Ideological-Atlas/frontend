'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/atoms/Button';
import { Alert } from '@/components/atoms/Alert';
import { AuthCard, itemVariants } from '@/components/molecules/AuthCard';
import { StatusMessage } from '@/components/molecules/StatusMessage';
import { PasswordField } from '@/components/molecules/PasswordField';
import { LoadingState } from '@/components/molecules/LoadingState';
import { IconAlert } from '@/components/molecules/IconAlert';
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

  const renderContent = () => {
    switch (viewState) {
      case 'verifying':
        return (
          <motion.div key="verifying" initial="hidden" animate="visible" exit="hidden" variants={itemVariants}>
            <LoadingState text={t('verifying_token')} />
          </motion.div>
        );

      case 'invalid':
        return (
          <motion.div key="invalid" initial="hidden" animate="visible" exit="hidden" className="w-full">
            <motion.div variants={itemVariants} className="mb-8">
              <StatusMessage
                icon="link_off"
                title={t('invalid_token_title')}
                description={t('invalid_token_description')}
                iconClassName="text-destructive"
              />
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
            <motion.div variants={itemVariants} className="mb-8">
              <StatusMessage
                icon="check_circle"
                title={t('password_updated_title')}
                description={t('password_updated_description')}
                iconClassName="text-green-500"
              />
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
            <motion.div variants={itemVariants} className="mb-8">
              <StatusMessage
                icon="lock_reset"
                title={t('reset_password_title')}
                description={t('reset_password_subtitle')}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <Alert variant="destructive">{globalError ? t(globalError) : null}</Alert>
            </motion.div>

            <form onSubmit={onSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <PasswordField
                  id="password"
                  label={t('new_password_label')}
                  placeholder="********"
                  disabled={isLoading}
                  error={errors.password?.message ? t(errors.password.message) : undefined}
                  {...register('password')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <PasswordField
                  id="confirmPassword"
                  label={t('confirm_new_password_label')}
                  placeholder="********"
                  disabled={isLoading}
                  error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
                  {...register('confirmPassword')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <IconAlert icon="info" variant="info">
                  {t('password_requirements')}
                </IconAlert>
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
