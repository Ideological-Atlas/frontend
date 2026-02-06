import { Alert } from '@/components/atoms/Alert';
import { cn } from '@/lib/utils';

interface IconAlertProps {
  icon: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
}

export function IconAlert({ icon, children, variant = 'info', className }: IconAlertProps) {
  return (
    <Alert variant={variant} className={cn('flex items-start gap-3 text-left', className)}>
      <span className="material-symbols-outlined shrink-0 text-[20px]">{icon}</span>
      <div className="text-xs leading-relaxed">{children}</div>
    </Alert>
  );
}
