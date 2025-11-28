'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onToggleMode: () => void;
    onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onForgotPassword }) => {
    const { signIn, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError(null);
            await signIn(data.email, data.password);
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div>
                <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                />
            </div>

            <div>
                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    error={errors.password?.message}
                />
            </div>

            {onForgotPassword && (
                <div className="text-right">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta?{' '}
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                    Regístrate
                </button>
            </div>
        </form>
    );
};

export default LoginForm;

