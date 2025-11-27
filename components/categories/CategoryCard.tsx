import React from 'react';
import { Category } from '@/lib/types';
import { Edit2, Trash2, Tag } from 'lucide-react';

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
    const handleEdit = () => {
        onEdit(category);
    };

    const handleDelete = () => {
        if (category._id) {
            onDelete(category._id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                >
                    <Tag size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                        {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase hidden sm:block">{category.color}</p>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                <button
                    onClick={handleEdit}
                    className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full transition-colors"
                    aria-label={`Editar categoría ${category.name}`}
                >
                    <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    aria-label={`Eliminar categoría ${category.name}`}
                >
                    <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>
        </div>
    );
};

