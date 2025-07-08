import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-bookmania-medium leading-none text-brown-dark peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          type={type}
          className={clsx(
            'flex h-12 w-full rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] px-4 py-3 text-sm font-bookmania text-brown-dark placeholder:text-brown-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-medium focus-visible:ring-offset-2 focus-visible:border-teal-medium disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
            error && 'border-burgundy-medium focus-visible:ring-burgundy-medium focus-visible:border-burgundy-medium',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm font-bookmania text-burgundy-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm font-bookmania text-brown-light">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
