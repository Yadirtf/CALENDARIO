import React, { SelectHTMLAttributes } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    className = '',
    id,
    ...props
}) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`
          w-full px-3 py-2 border rounded-lg
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
};

export default Select;
