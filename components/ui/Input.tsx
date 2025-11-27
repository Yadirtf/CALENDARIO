import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-3 py-2 border rounded-lg
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default Input;
