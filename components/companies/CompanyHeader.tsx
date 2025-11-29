'use client';

import React from 'react';
import { Building2, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CompanyHeaderProps {
    onCreateNew: () => void;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ onCreateNew }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Building2 size={28} />
                    Gestión de Empresas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra las empresas con las que trabajas
                </p>
            </div>
            <Button onClick={onCreateNew} className="flex items-center gap-2">
                <Plus size={20} />
                Nueva Empresa
            </Button>
        </div>
    );
};

