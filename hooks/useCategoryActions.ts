import { useState } from 'react';
import { Category } from '@/lib/types';
import { useCategoryStore } from '@/store/categoryStore';
import { getAuthToken } from '@/lib/auth/getAuthToken';

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
            const token = await getAuthToken();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (selectedCategory?._id) {
                // Actualizar
                const response = await fetch(`/api/categories/${selectedCategory._id}`, {
                    method: 'PUT',
                    headers,
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
                    headers,
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
            const token = await getAuthToken();
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
                headers,
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

