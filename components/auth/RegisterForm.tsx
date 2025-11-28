'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    dateOfBirth: z.string().refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 13;
        }
        return age >= 13;
    }, 'Debes tener al menos 13 años'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
    const { signUp, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError(null);
            await signUp(
                data.email,
                data.password,
                data.firstName,
                data.lastName,
                new Date(data.dateOfBirth)
            );
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        label="Nombre"
                        type="text"
                        placeholder="Juan"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                    />
                </div>
                <div>
                    <Input
                        label="Apellidos"
                        type="text"
                        placeholder="Pérez"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                    />
                </div>
            </div>

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
                    label="Fecha de nacimiento"
                    type="date"
                    {...register('dateOfBirth')}
                    error={errors.dateOfBirth?.message}
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

            <div>
                <Input
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                    Inicia sesión
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;

