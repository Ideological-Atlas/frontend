import { tv, type VariantProps } from 'tailwind-variants';
import { clsx } from 'clsx';

const alertVariants = tv({
  base: 'rounded-lg border p-3 text-center text-sm font-medium transition-all',
  variants: {
    variant: {
      default: 'bg-secondary/50 border-border text-foreground',
      destructive: 'bg-destructive/10 text-destructive border-destructive/20',
      success: 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400',
      warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-500',
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface AlertProps extends VariantProps<typeof alertVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, variant, className }: AlertProps) {
  if (!children) return null;

  return <div className={clsx(alertVariants({ variant }), className)}>{children}</div>;
}
