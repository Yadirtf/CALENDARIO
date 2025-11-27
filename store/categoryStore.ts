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
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (data.success) {
                set({ categories: data.data, isLoading: false });
            } else {
                set({ error: data.error, isLoading: false });
            }
        } catch (error) {
            set({ error: 'Error al cargar categorías', isLoading: false });
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
