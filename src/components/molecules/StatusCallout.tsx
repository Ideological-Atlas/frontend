import { clsx } from 'clsx';
import { Alert } from '@/components/atoms/Alert';

interface StatusCalloutProps {
  icon: string;
  title: string;
  description: string;
  variant?: 'success' | 'warning' | 'info';
  className?: string;
}

const variantStyles = {
  success: {
    border: 'border-l-primary',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  warning: {
    border: 'border-l-warning',
    iconBg: 'bg-warning/20',
    iconColor: 'text-warning',
  },
  info: {
    border: 'border-l-accent-strong',
    iconBg: 'bg-accent-strong/20',
    iconColor: 'text-accent-strong',
  },
};

export function StatusCallout({ icon, title, description, variant = 'success', className }: StatusCalloutProps) {
  const styles = variantStyles[variant];

  return (
    <Alert
      variant="default"
      className={clsx('bg-secondary/50 flex items-center gap-4 border-l-4 text-left', styles.border, className)}
    >
      <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', styles.iconBg)}>
        <span className={clsx('material-symbols-outlined text-[20px]', styles.iconColor)}>{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-bold">{title}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </div>
    </Alert>
  );
}
