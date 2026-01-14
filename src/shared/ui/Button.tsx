import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  className = '', 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  ...props 
}: ButtonProps) {
  const base = "rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const styles = {
    primary: "bg-primary text-text-inverse hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-px",
    secondary: "bg-bg-box text-text-body hover:bg-bg-box-hover",
    outline: "border border-border-base hover:bg-bg-box-light text-text-body",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-box hover:text-text-body shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${base} ${styles[variant]} ${sizes[size]} ${widthClass} ${className}`} 
      {...props} 
    />
  );
}
