import React from 'react';
import Button from '@/components/ui/Button';
import { Plus, Tag } from 'lucide-react';

interface CategoryEmptyStateProps {
    onCreateNew: () => void;
}

export const CategoryEmptyState: React.FC<CategoryEmptyStateProps> = ({ onCreateNew }) => {
    return (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-colors">
            <Tag className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay categorías</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comienza creando una nueva categoría.</p>
            <div className="mt-6">
                <Button onClick={onCreateNew}>
                    <Plus size={20} className="mr-2" />
                    Nueva Categoría
                </Button>
            </div>
        </div>
    );
};

