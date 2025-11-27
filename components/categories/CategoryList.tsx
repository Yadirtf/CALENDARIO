import React from 'react';
import { Category } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
                <CategoryCard
                    key={category._id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

