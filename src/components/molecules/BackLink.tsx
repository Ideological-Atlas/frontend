import { clsx } from 'clsx';
import { Link } from '@/components/atoms/SmartLink';

interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors',
        className,
      )}
    >
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      {label}
    </Link>
  );
}
