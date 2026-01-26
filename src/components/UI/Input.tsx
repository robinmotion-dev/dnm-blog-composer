import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, fullWidth = false, className = '', ...props }, ref) => {
    const baseStyles =
      'px-3 py-2 rounded-lg border bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-neutral-300 focus:ring-blue-500 focus:border-blue-500';

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${errorStyles} ${widthStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
