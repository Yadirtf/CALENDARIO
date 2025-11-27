import React from 'react';

interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{message}</span>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="ml-4 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-bold"
                    aria-label="Cerrar error"
                >
                    ×
                </button>
            )}
        </div>
    );
};

