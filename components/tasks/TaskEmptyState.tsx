import React from 'react';

interface TaskEmptyStateProps {
    hasSearchTerm: boolean;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({ hasSearchTerm }) => {
    return (
        <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No hay tareas pendientes</p>
            {hasSearchTerm && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Intenta cambiar los filtros</p>
            )}
        </div>
    );
};

