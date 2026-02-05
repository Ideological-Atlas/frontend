import { ComponentProps, forwardRef, ReactNode } from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface FormFieldProps extends Omit<ComponentProps<typeof Input>, 'error'> {
  label: string;
  error?: string;
  startIcon?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className={className}>
        <Label htmlFor={id} className="mb-2 block">
          {label}
        </Label>
        <Input ref={ref} id={id} error={!!error} {...props} />
        {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
      </div>
    );
  },
);
FormField.displayName = 'FormField';
