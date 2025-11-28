'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import CategoryModal from '@/components/categories/CategoryModal';
import { CategoryHeader } from '@/components/categories/CategoryHeader';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryEmptyState } from '@/components/categories/CategoryEmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCategoryStore } from '@/store/categoryStore';
import { useCategoryActions } from '@/hooks/useCategoryActions';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
    const { user, loading: authLoading } = useAuth();
    const { categories, fetchCategories } = useCategoryStore();
    const { error, saveCategory, deleteCategory, clearError } = useCategoryActions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (!authLoading && user) {
            fetchCategories();
        }
    }, [authLoading, user, fetchCategories]);

    const handleOpenModal = (category: Category | null = null) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
        clearError();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        clearError();
    };

    const handleSaveCategory = async (categoryData: Partial<Category>) => {
        const success = await saveCategory(categoryData, selectedCategory);
        if (success) {
            handleCloseModal();
        }
    };

    const handleEditCategory = (category: Category) => {
        handleOpenModal(category);
    };

    const handleDeleteCategory = async (id: string) => {
        await deleteCategory(id);
    };

    return (
        <AuthGuard>
            <DashboardLayout>
            <div className="space-y-4 sm:space-y-6">
                <CategoryHeader onCreateNew={() => handleOpenModal(null)} />

                {error && <ErrorMessage message={error} onDismiss={clearError} />}

                {categories.length > 0 ? (
                    <CategoryList
                        categories={categories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />
                ) : (
                    <CategoryEmptyState onCreateNew={() => handleOpenModal(null)} />
                )}
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                category={selectedCategory}
            />
            </DashboardLayout>
        </AuthGuard>
    );
}
