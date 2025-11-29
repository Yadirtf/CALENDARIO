'use client';

import React from 'react';
import { Building2, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CompanyEmptyStateProps {
    onCreateNew: () => void;
}

export const CompanyEmptyState: React.FC<CompanyEmptyStateProps> = ({ onCreateNew }) => {
    return (
        <div className="text-center py-12 px-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Building2 size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No hay empresas registradas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Comienza agregando una empresa para poder relacionar tus eventos de trabajo con ella.
            </p>
            <Button onClick={onCreateNew} className="flex items-center gap-2 mx-auto">
                <Plus size={20} />
                Crear Primera Empresa
            </Button>
        </div>
    );
};

