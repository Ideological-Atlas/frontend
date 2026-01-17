import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const inputStyles = tv({
  slots: {
    base: 'relative flex w-full items-center transition-opacity duration-200',
    input:
      'flex w-full rounded-lg border bg-secondary px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
    icon: 'text-muted-foreground pointer-events-none absolute flex items-center justify-center transition-colors peer-focus:text-primary',
  },
  variants: {
    variant: {
      default: { input: 'border-transparent' },
      error: {
        input:
          'border-destructive focus-visible:ring-destructive focus-visible:border-destructive text-destructive placeholder:text-destructive/50',
        icon: 'text-destructive',
      },
    },
    size: {
      default: { input: 'h-12', icon: 'w-10' },
      sm: { input: 'h-9 px-3', icon: 'w-8' },
      lg: { input: 'h-14 px-6 text-base', icon: 'w-12' },
    },
    hasStartIcon: {
      true: { input: 'pl-10' },
    },
    hasEndIcon: {
      true: { input: 'pr-10' },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputStyles> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, variant, size, error, startIcon, endIcon, ...props }, ref) => {
    const { base, input, icon } = inputStyles({
      variant: error ? 'error' : variant,
      size,
      hasStartIcon: !!startIcon,
      hasEndIcon: !!endIcon,
    });

    return (
      <div className={base({ className: containerClassName })}>
        {startIcon && <div className={icon({ className: 'left-0' })}>{startIcon}</div>}
        <input ref={ref} className={input({ className })} {...props} />
        {endIcon && <div className="absolute right-0 flex w-10 items-center justify-center">{endIcon}</div>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
