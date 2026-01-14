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
  // cursor-pointer 추가: 마우스 오버 시 포인터 모양 표시
  const base = "rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer";

  const styles = {
    primary: "bg-primary text-text-inverse hover:bg-primary-hover border border-transparent",
    secondary: "bg-bg-box-alt text-text-body hover:bg-bg-box-hover border border-transparent",
    outline: "border border-border-medium text-text-body hover:bg-bg-box-light",
    ghost: "bg-transparent text-text-secondary hover:bg-bg-box-light hover:text-text-primary"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3.5 text-lg"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${base} ${styles[variant]} ${sizes[size]} ${widthClass} ${className}`} 
      {...props} 
    />
  );
}