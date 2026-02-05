import { Link } from '@/components/atoms/SmartLink';
import { cn } from '@/lib/utils';

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
  className?: string;
}

export function AuthFooter({ text, linkText, href, className }: AuthFooterProps) {
  return (
    <div className={cn('text-muted-foreground mt-8 text-center text-sm', className)}>
      {text}{' '}
      <Link href={href} className="text-primary hover:text-primary-hover font-semibold hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
