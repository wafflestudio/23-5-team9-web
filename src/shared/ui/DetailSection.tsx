import { ReactNode, CSSProperties } from 'react';

interface DetailSectionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function DetailSection({ children, className = '', style }: DetailSectionProps) {
  return (
    <section className={`bg-bg-page rounded-2xl border border-border-base shadow-sm p-6 overflow-hidden ${className}`} style={style}>
      {children}
    </section>
  );
}
