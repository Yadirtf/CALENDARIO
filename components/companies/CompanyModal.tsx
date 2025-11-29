'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Company } from '@/lib/types';
import CountrySelect from 'react-select-country-list';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const companySchema = z.object({
    name: z.string().min(1, 'El nombre de la empresa es requerido').max(200, 'El nombre no puede exceder 200 caracteres'),
    nit: z.string().max(50, 'El NIT no puede exceder 50 caracteres').optional().or(z.literal('')),
    country: z.string().min(1, 'El país es requerido'),
    address: z.string().max(500, 'La dirección no puede exceder 500 caracteres').optional().or(z.literal('')),
    phone: z.string().min(1, 'El número de teléfono es requerido'),
    email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
    website: z.string().refine((val) => !val || /^https?:\/\/.+/.test(val), {
        message: 'La URL debe comenzar con http:// o https://',
    }).optional().or(z.literal('')),
    logo: z.string().refine((val) => !val || /^https?:\/\/.+/.test(val), {
        message: 'La URL debe comenzar con http:// o https://',
    }).optional().or(z.literal('')),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (company: Partial<Company>) => void;
    company?: Company | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    company,
}) => {
    const [error, setError] = useState<string | null>(null);
    const countryOptions = CountrySelect().getData();
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            nit: '',
            country: '',
            address: '',
            phone: '',
            email: '',
            website: '',
            logo: '',
        },
    });

    const phoneValue = watch('phone');

    useEffect(() => {
        if (company) {
            reset({
                name: company.name || '',
                nit: company.nit || '',
                country: company.country || '',
                address: company.address || '',
                phone: company.phone || '',
                email: company.email || '',
                website: company.website || '',
                logo: company.logo || '',
            });
            setSelectedCountry(company.country || '');
        } else {
            reset({
                name: '',
                nit: '',
                country: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                logo: '',
            });
            setSelectedCountry('');
        }
    }, [company, reset]);

    const onSubmit = async (data: CompanyFormData) => {
        try {
            setError(null);
            const companyData: Partial<Company> = {
                name: data.name.trim(),
                nit: data.nit?.trim() || undefined,
                country: data.country.trim(),
                address: data.address?.trim() || undefined,
                phone: data.phone.trim(),
                email: data.email?.trim() || undefined,
                website: data.website?.trim() || undefined,
                logo: data.logo?.trim() || undefined,
            };
            onSave(companyData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al guardar empresa');
        }
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setValue('country', country, { shouldValidate: true });
    };

    return (
        <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={company ? 'Editar Empresa' : 'Nueva Empresa'}
                size="lg"
                footer={
                    <>
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)}>
                            {company ? 'Actualizar' : 'Crear'}
                        </Button>
                    </>
                }
            >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && <ErrorMessage message={error} />}

                <Input
                    label="Nombre de la empresa *"
                    value={watch('name')}
                    onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
                    required
                    placeholder="Nombre de la empresa"
                    error={errors.name?.message}
                />

                <Input
                    label="NIT (opcional)"
                    value={watch('nit')}
                    onChange={(e) => setValue('nit', e.target.value)}
                    placeholder="Número de identificación tributaria"
                    error={errors.nit?.message}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        País *
                    </label>
                    <select
                        {...register('country')}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        required
                    >
                        <option value="">Selecciona un país</option>
                        {countryOptions.map((country) => (
                            <option key={country.value} value={country.label}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    {errors.country && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.country.message}
                        </p>
                    )}
                </div>

                <Input
                    label="Dirección (opcional)"
                    value={watch('address')}
                    onChange={(e) => setValue('address', e.target.value)}
                    placeholder="Dirección de la empresa"
                    error={errors.address?.message}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número de celular *
                    </label>
                    <PhoneInput
                        international
                        defaultCountry="CO"
                        value={phoneValue}
                        onChange={(value) => setValue('phone', value || '', { shouldValidate: true })}
                        className="w-full"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.phone.message}
                        </p>
                    )}
                </div>

                <Input
                    label="Correo electrónico (opcional)"
                    type="email"
                    value={watch('email')}
                    onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
                    placeholder="empresa@ejemplo.com"
                    error={errors.email?.message}
                />

                <Input
                    label="Página web (opcional)"
                    type="url"
                    value={watch('website')}
                    onChange={(e) => setValue('website', e.target.value, { shouldValidate: true })}
                    placeholder="https://www.ejemplo.com"
                    error={errors.website?.message}
                />

                <Input
                    label="Logo (URL de imagen, opcional)"
                    type="url"
                    value={watch('logo')}
                    onChange={(e) => setValue('logo', e.target.value, { shouldValidate: true })}
                    placeholder="https://www.ejemplo.com/logo.png"
                    error={errors.logo?.message}
                />
            </form>
        </Modal>
    );
};

export default CompanyModal;

