'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import CompanyModal from '@/components/companies/CompanyModal';
import { CompanyHeader } from '@/components/companies/CompanyHeader';
import CompanyList from '@/components/companies/CompanyList';
import { CompanyEmptyState } from '@/components/companies/CompanyEmptyState';
import CompanyEventsList from '@/components/companies/CompanyEventsList';
import { Tabs } from '@/components/ui/Tabs';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useCompanyStore } from '@/store/companyStore';
import { useCompanyActions } from '@/hooks/useCompanyActions';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/lib/types';

export default function WorkPage() {
    const { user, loading: authLoading } = useAuth();
    const { companies, fetchCompanies } = useCompanyStore();
    const { error, saveCompany, deleteCompany, clearError } = useCompanyActions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [activeTab, setActiveTab] = useState<string>('companies');

    useEffect(() => {
        if (!authLoading && user) {
            fetchCompanies();
        }
    }, [authLoading, user, fetchCompanies]);

    const handleOpenModal = (company: Company | null = null) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
        clearError();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
        clearError();
    };

    const handleSaveCompany = async (companyData: Partial<Company>) => {
        const success = await saveCompany(companyData, selectedCompany);
        if (success) {
            handleCloseModal();
        }
    };

    const handleEditCompany = (company: Company) => {
        handleOpenModal(company);
    };

    const handleDeleteCompany = async (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
            await deleteCompany(id);
        }
    };

    const tabs = [
        {
            id: 'companies',
            label: 'Gestión de Empresas',
            count: companies.length,
        },
        {
            id: 'events',
            label: 'Eventos de Trabajo',
            count: undefined,
        },
    ];

    return (
        <AuthGuard>
            <DashboardLayout>
            <div className="space-y-4 sm:space-y-6">
                <CompanyHeader onCreateNew={() => handleOpenModal(null)} />

                {error && <ErrorMessage message={error} onDismiss={clearError} />}

                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <div className="mb-6">
                        <Tabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {activeTab === 'companies' ? (
                        <>
                            {companies.length > 0 ? (
                                <CompanyList
                                    companies={companies}
                                    onEdit={handleEditCompany}
                                    onDelete={handleDeleteCompany}
                                />
                            ) : (
                                <CompanyEmptyState onCreateNew={() => handleOpenModal(null)} />
                            )}
                        </>
                    ) : (
                        <CompanyEventsList companies={companies} />
                    )}
                </div>
            </div>

            <CompanyModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCompany}
                company={selectedCompany}
            />
            </DashboardLayout>
        </AuthGuard>
    );
}

