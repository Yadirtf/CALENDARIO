import { create } from 'zustand';
import { Category } from '@/lib/types';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    addCategory: (category: Category) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const { getAuthToken } = await import('@/lib/auth/getAuthToken');
            const token = await getAuthToken();
            
            if (!token) {
                set({ categories: [], isLoading: false, error: null });
                return;
            }
            
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
            };
            
            const response = await fetch('/api/categories', { headers });
            const data = await response.json();
            
            if (response.status === 401) {
                // Usuario no autenticado, no es un error crítico
                set({ categories: [], isLoading: false, error: null });
                return;
            }
            
            if (data.success) {
                set({ categories: data.data, isLoading: false });
            } else {
                set({ error: data.error, isLoading: false });
            }
        } catch (error) {
            // Solo mostrar error si no es un 401 (no autenticado)
            set({ error: null, isLoading: false });
        }
    },

    addCategory: (category) => {
        set((state) => ({
            categories: [...state.categories, category].sort((a, b) => a.name.localeCompare(b.name)),
        }));
    },

    updateCategory: (updatedCategory) => {
        set((state) => ({
            categories: state.categories.map((cat) =>
                cat._id === updatedCategory._id ? updatedCategory : cat
            ).sort((a, b) => a.name.localeCompare(b.name)),
        }));
    },

    deleteCategory: (id) => {
        set((state) => ({
            categories: state.categories.filter((cat) => cat._id !== id),
        }));
    },
}));
