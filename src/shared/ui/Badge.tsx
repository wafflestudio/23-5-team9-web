import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  className?: string;
}

export default function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-orange-100 text-primary',
    secondary: 'bg-bg-box text-text-secondary',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-status-error',
    warning: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
