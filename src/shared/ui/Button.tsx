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
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-px",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-200 hover:bg-gray-50 text-slate-700",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-none"
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
