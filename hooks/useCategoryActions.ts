import { useState } from 'react';
import { Category } from '@/lib/types';
import { useCategoryStore } from '@/store/categoryStore';

interface UseCategoryActionsReturn {
    error: string | null;
    saveCategory: (categoryData: Partial<Category>, selectedCategory: Category | null) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
    clearError: () => void;
}

export const useCategoryActions = (): UseCategoryActionsReturn => {
    const { addCategory, updateCategory, deleteCategory: removeCategory } = useCategoryStore();
    const [error, setError] = useState<string | null>(null);

    const saveCategory = async (
        categoryData: Partial<Category>,
        selectedCategory: Category | null
    ): Promise<boolean> => {
        setError(null);
        try {
            if (selectedCategory?._id) {
                // Actualizar
                const response = await fetch(`/api/categories/${selectedCategory._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(categoryData),
                });
                const data = await response.json();

                if (data.success) {
                    updateCategory(data.data);
                    return true;
                } else {
                    setError(data.error);
                    return false;
                }
            } else {
                // Crear
                const response = await fetch('/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(categoryData),
                });
                const data = await response.json();

                if (data.success) {
                    addCategory(data.data);
                    return true;
                } else {
                    setError(data.error);
                    return false;
                }
            }
        } catch (error) {
            setError('Error al guardar la categoría');
            console.error(error);
            return false;
        }
    };

    const deleteCategory = async (id: string): Promise<boolean> => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            return false;
        }

        setError(null);
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                removeCategory(id);
                return true;
            } else {
                alert(data.error); // Mostrar error si está en uso
                return false;
            }
        } catch (error) {
            setError('Error al eliminar la categoría');
            console.error(error);
            return false;
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        error,
        saveCategory,
        deleteCategory,
        clearError,
    };
};

