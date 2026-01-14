import { ReactNode } from 'react';

interface StatProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function Stat({ icon, label, value, className = '' }: StatProps) {
  return (
    <span className={`text-text-muted text-[13px] flex items-center gap-1 ${className}`}>
      {icon}
      {label && <span className="sr-only">{label}</span>}
      <span>{value}</span>
    </span>
  );
}

interface StatGroupProps {
  children: ReactNode;
  className?: string;
}

export function StatGroup({ children, className = '' }: StatGroupProps) {
  return (
    <div className={`flex gap-3 items-center ${className}`}>
      {children}
    </div>
  );
}
