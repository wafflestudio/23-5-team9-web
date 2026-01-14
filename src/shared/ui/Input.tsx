import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`w-full rounded-xl bg-bg-box p-4 text-base outline-none transition-all placeholder:text-text-placeholder focus:bg-bg-box-hover focus:ring-2 focus:ring-primary/10 ${
             error ? 'ring-2 ring-status-error/20 bg-red-50' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
