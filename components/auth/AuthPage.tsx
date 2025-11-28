'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetError, setResetError] = useState<string | null>(null);
    const [resetSuccess, setResetSuccess] = useState(false);
    const { signInWithGoogle, resetPassword, loading } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            console.error('Error al iniciar sesión con Google:', err);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setResetError(null);
            setResetSuccess(false);
            await resetPassword(resetEmail);
            setResetSuccess(true);
        } catch (err: any) {
            setResetError(err.message || 'Error al enviar correo de recuperación');
        }
    };

    if (forgotPasswordMode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Calendar className="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400" />
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Recuperar contraseña
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
                        {resetError && <ErrorMessage message={resetError} />}
                        {resetSuccess && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña.
                                </p>
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                required
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={loading || resetSuccess}>
                                {loading ? 'Enviando...' : 'Enviar correo'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setForgotPasswordMode(false);
                                    setResetEmail('');
                                    setResetError(null);
                                    setResetSuccess(false);
                                }}
                            >
                                Volver
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-primary-600 dark:text-primary-400" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {mode === 'login'
                            ? 'Accede a tu calendario personal'
                            : 'Comienza a organizar tu vida'}
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continuar con Google
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                O continúa con
                            </span>
                        </div>
                    </div>

                    {mode === 'login' ? (
                        <LoginForm
                            onToggleMode={() => setMode('register')}
                            onForgotPassword={() => setForgotPasswordMode(true)}
                        />
                    ) : (
                        <RegisterForm onToggleMode={() => setMode('login')} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

