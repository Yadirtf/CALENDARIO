import { create } from 'zustand';
import { Company } from '@/lib/types';

interface CompanyState {
    companies: Company[];
    isLoading: boolean;
    error: string | null;

    fetchCompanies: () => Promise<void>;
    addCompany: (company: Company) => void;
    updateCompany: (company: Company) => void;
    deleteCompany: (id: string) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
    companies: [],
    isLoading: false,
    error: null,

    fetchCompanies: async () => {
        set({ isLoading: true, error: null });
        try {
            const { getAuthToken } = await import('@/lib/auth/getAuthToken');
            const token = await getAuthToken();
            
            if (!token) {
                set({ companies: [], isLoading: false, error: null });
                return;
            }
            
            const headers: HeadersInit = {
                'Authorization': `Bearer ${token}`,
            };
            
            const response = await fetch('/api/companies', { headers });
            const data = await response.json();
            
            if (response.status === 401) {
                // Usuario no autenticado, no es un error crítico
                set({ companies: [], isLoading: false, error: null });
                return;
            }
            
            if (data.success) {
                set({ companies: data.data, isLoading: false });
            } else {
                set({ error: data.error, isLoading: false });
            }
        } catch (error) {
            // Solo mostrar error si no es un 401 (no autenticado)
            set({ error: null, isLoading: false });
        }
    },

    addCompany: (company) => {
        set((state) => ({
            companies: [...state.companies, company].sort((a, b) => a.name.localeCompare(b.name)),
        }));
    },

    updateCompany: (updatedCompany) => {
        set((state) => ({
            companies: state.companies.map((comp) =>
                comp._id === updatedCompany._id ? updatedCompany : comp
            ).sort((a, b) => a.name.localeCompare(b.name)),
        }));
    },

    deleteCompany: (id) => {
        set((state) => ({
            companies: state.companies.filter((comp) => comp._id !== id),
        }));
    },
}));

