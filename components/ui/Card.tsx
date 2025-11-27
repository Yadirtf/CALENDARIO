import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
}) => {
    const paddingStyles = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const hoverStyles = hover
        ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200'
        : '';

    return (
        <div
            className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
