import { useState, forwardRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Link } from '@/components/atoms/SmartLink';

interface PasswordFieldProps extends Omit<React.ComponentProps<typeof Input>, 'error'> {
  label: string;
  error?: string;
  showForgotPassword?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, id, showForgotPassword, disabled, ...props }, ref) => {
    const t = useTranslations('Auth');
    const locale = useLocale();
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={id}>{label}</Label>
          {showForgotPassword && (
            <Link
              href={`/${locale}/forgot-password`}
              className="text-primary hover:text-primary-hover text-xs font-medium hover:underline"
            >
              {t('forgot_password')}
            </Link>
          )}
        </div>
        <Input
          ref={ref}
          id={id}
          type={showPassword ? 'text' : 'password'}
          error={!!error}
          disabled={disabled}
          startIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground flex items-center justify-center focus:outline-none"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
          {...props}
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    );
  },
);
PasswordField.displayName = 'PasswordField';
