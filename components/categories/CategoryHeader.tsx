import React from 'react';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface CategoryHeaderProps {
    onCreateNew: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ onCreateNew }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Categorías</h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
                    Administra las categorías para tus eventos y tareas
                </p>
            </div>
            <Button onClick={onCreateNew} className="w-full sm:w-auto">
                <Plus size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Nueva Categoría</span>
                <span className="sm:hidden">Nueva</span>
            </Button>
        </div>
    );
};

