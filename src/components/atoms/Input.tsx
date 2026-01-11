import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        // Quitamos 'flex', añadimos 'block' y alineación vertical
        'bg-secondary block h-12 w-full rounded-lg border px-4 py-2 text-sm transition-colors',
        'placeholder:text-muted-foreground focus:border-primary focus:ring-primary border-transparent focus:ring-1 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-destructive focus:border-destructive focus:ring-destructive',
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';
