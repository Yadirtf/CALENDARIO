import { useState } from 'react';
import { Company } from '@/lib/types';
import { useCompanyStore } from '@/store/companyStore';

interface UseCompanyActionsReturn {
    error: string | null;
    saveCompany: (company: Partial<Company>, existingCompany?: Company | null) => Promise<boolean>;
    deleteCompany: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useCompanyActions = (): UseCompanyActionsReturn => {
    const [error, setError] = useState<string | null>(null);
    const { addCompany, updateCompany, deleteCompany: removeCompany } = useCompanyStore();

    const saveCompany = async (
        companyData: Partial<Company>,
        existingCompany?: Company | null
    ): Promise<boolean> => {
        try {
            setError(null);

            const { getAuthToken } = await import('@/lib/auth/getAuthToken');
            const token = await getAuthToken();

            if (!token) {
                setError('No autenticado');
                return false;
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const url = existingCompany
                ? `/api/companies/${existingCompany._id}`
                : '/api/companies';
            const method = existingCompany ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(companyData),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error || 'Error al guardar empresa');
                return false;
            }

            if (existingCompany) {
                updateCompany(data.data);
            } else {
                addCompany(data.data);
            }

            return true;
        } catch (err: any) {
            setError(err.message || 'Error al guardar empresa');
            return false;
        }
    };

    const deleteCompany = async (id: string): Promise<void> => {
        try {
            setError(null);

            const { getAuthToken } = await import('@/lib/auth/getAuthToken');
            const token = await getAuthToken();

            if (!token) {
                setError('No autenticado');
                return;
            }

            const headers: HeadersInit = {
                Authorization: `Bearer ${token}`,
            };

            const response = await fetch(`/api/companies/${id}`, {
                method: 'DELETE',
                headers,
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.error || 'Error al eliminar empresa');
                return;
            }

            removeCompany(id);
        } catch (err: any) {
            setError(err.message || 'Error al eliminar empresa');
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        error,
        saveCompany,
        deleteCompany,
        clearError,
    };
};

