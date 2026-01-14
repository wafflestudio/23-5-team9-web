import { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block mb-2 font-bold text-sm text-text-secondary">{label}</label>}
        <select
          ref={ref}
          className={`w-full rounded-xl bg-bg-box p-4 text-base outline-none transition-all appearance-none border-none focus:bg-bg-box-hover focus:ring-2 focus:ring-primary/10 ${
            error ? 'ring-2 ring-status-error/20 bg-red-50' : ''
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-status-error ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
