'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthPage from '@/components/auth/AuthPage';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPageRoute() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/calendar');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return null;
    }

    return <AuthPage />;
}

