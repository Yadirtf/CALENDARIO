'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';
import { Event, Category, Company } from '@/lib/types';
import { useCompanyStore } from '@/store/companyStore';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Partial<Event>) => void;
    event?: Event | null;
    initialData?: { start: Date; end: Date } | null;
    categories: Category[];
}

const EventModal: React.FC<EventModalProps> = ({
    isOpen,
    onClose,
    onSave,
    event,
    initialData,
    categories,
}) => {
    const { companies, fetchCompanies } = useCompanyStore();
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
        category: categories[0]?.name || 'Personal',
        color: categories[0]?.color || '#3b82f6',
        location: '',
        isWork: false,
        companyId: '',
        workStatus: 'pending',
        price: undefined,
        includesExpenses: false,
        expenses: undefined,
    });

    // Estados para los valores formateados (con puntos)
    const [priceDisplay, setPriceDisplay] = useState<string>('');
    const [expensesDisplay, setExpensesDisplay] = useState<string>('');

    // Función para formatear número con punto como separador de miles (sin decimales)
    const formatNumber = (value: number | undefined): string => {
        if (value === undefined || value === null) return '';
        return Math.round(value).toLocaleString('es-ES');
    };


    useEffect(() => {
        if (isOpen) {
            fetchCompanies();
        }
    }, [isOpen, fetchCompanies]);

    useEffect(() => {
        if (event) {
            setFormData(event);
            // Formatear los valores numéricos para mostrar
            setPriceDisplay(formatNumber(event.price));
            setExpensesDisplay(formatNumber(event.expenses));
        } else {
            const defaultCategory = categories[0];
            setFormData({
                title: '',
                description: '',
                startDate: initialData?.start || new Date(),
                endDate: initialData?.end || new Date(),
                allDay: false,
                category: defaultCategory?.name || 'Personal',
                color: defaultCategory?.color || '#3b82f6',
                location: '',
                isWork: false,
                companyId: '',
                workStatus: 'pending',
                price: undefined,
                includesExpenses: false,
                expenses: undefined,
            });
            setPriceDisplay('');
            setExpensesDisplay('');
        }
    }, [event, initialData, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Preparar los datos para enviar
        const dataToSave: Partial<Event> = { ...formData };
        
        console.log('🔍 DEBUG - formData antes de procesar:', {
            isWork: formData.isWork,
            companyId: formData.companyId,
            price: formData.price,
            includesExpenses: formData.includesExpenses,
            expenses: formData.expenses,
        });
        
        // Si isWork es false, limpiar los campos relacionados con trabajo
        if (!dataToSave.isWork) {
            delete dataToSave.companyId;
            delete dataToSave.workStatus;
            delete dataToSave.price;
            delete dataToSave.expenses;
            dataToSave.includesExpenses = false;
        } else {
            // Si isWork es true pero no hay companyId, no guardar la relación
            if (!dataToSave.companyId || (typeof dataToSave.companyId === 'string' && dataToSave.companyId.trim() === '')) {
                delete dataToSave.companyId;
                delete dataToSave.workStatus;
                delete dataToSave.price;
                delete dataToSave.expenses;
                dataToSave.includesExpenses = false;
                dataToSave.isWork = false;
            } else {
                // Asegurar que includesExpenses sea un booleano
                dataToSave.includesExpenses = Boolean(dataToSave.includesExpenses);
                
                // Convertir price a número si existe (asegurar que sea un número válido)
                if (dataToSave.price !== undefined && dataToSave.price !== null) {
                    const priceNum = Number(dataToSave.price);
                    if (!isNaN(priceNum) && priceNum >= 0) {
                        dataToSave.price = priceNum;
                    } else {
                        delete dataToSave.price;
                    }
                } else {
                    delete dataToSave.price;
                }
                
                // Si includesExpenses es false, limpiar expenses
                if (!dataToSave.includesExpenses) {
                    delete dataToSave.expenses;
                } else {
                    // Convertir expenses a número si existe y includesExpenses es true
                    if (dataToSave.expenses !== undefined && dataToSave.expenses !== null) {
                        const expensesNum = Number(dataToSave.expenses);
                        if (!isNaN(expensesNum) && expensesNum >= 0) {
                            dataToSave.expenses = expensesNum;
                        } else {
                            delete dataToSave.expenses;
                        }
                    } else {
                        delete dataToSave.expenses;
                    }
                }
            }
        }
        
        console.log('🔍 DEBUG - dataToSave después de procesar:', {
            isWork: dataToSave.isWork,
            companyId: dataToSave.companyId,
            price: dataToSave.price,
            includesExpenses: dataToSave.includesExpenses,
            expenses: dataToSave.expenses,
        });
        
        onSave(dataToSave);
        onClose();
    };

    const handleChange = (field: keyof Event, value: any) => {
        setFormData((prev) => {
            const updates: any = { [field]: value };
            
            // Debug para campos de precio y viáticos
            if (field === 'price' || field === 'expenses') {
                console.log(`🔍 DEBUG - handleChange ${field}:`, value, 'tipo:', typeof value);
            }

            // Si cambia la categoría, actualizar también el color
            if (field === 'category') {
                const selectedCategory = categories.find(c => c.name === value);
                if (selectedCategory) {
                    updates.color = selectedCategory.color;
                }
            }

            // Si se desmarca isWork, limpiar todos los campos relacionados con trabajo
            if (field === 'isWork' && !value) {
                updates.companyId = '';
                updates.workStatus = 'pending';
                updates.price = undefined;
                updates.includesExpenses = false;
                updates.expenses = undefined;
                setPriceDisplay('');
                setExpensesDisplay('');
            }

            // Si se desmarca includesExpenses, limpiar expenses
            if (field === 'includesExpenses' && !value) {
                updates.expenses = undefined;
                setExpensesDisplay('');
            }

            return { ...prev, ...updates };
        });
    };

    const formatDateTimeLocal = (date: Date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.name,
        label: cat.name,
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? 'Editar Evento' : 'Nuevo Evento'}
            size="lg"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {event ? 'Actualizar' : 'Crear'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Título"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                    placeholder="Título del evento"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Fecha y hora de inicio"
                        type="datetime-local"
                        value={formatDateTimeLocal(formData.startDate || new Date())}
                        onChange={(e) => handleChange('startDate', new Date(e.target.value))}
                        required
                    />

                    <Input
                        label="Fecha y hora de fin"
                        type="datetime-local"
                        value={formatDateTimeLocal(formData.endDate || new Date())}
                        onChange={(e) => handleChange('endDate', new Date(e.target.value))}
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="allDay"
                        checked={formData.allDay}
                        onChange={(e) => handleChange('allDay', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="allDay" className="text-sm font-medium text-gray-700">
                        Evento de todo el día
                    </label>
                </div>

                <Select
                    label="Categoría"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    options={categoryOptions}
                    required
                />

                <ColorPicker
                    value={formData.color || '#3b82f6'}
                    onChange={(color) => handleChange('color', color)}
                    label="Color"
                />

                <Input
                    label="Ubicación (opcional)"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Ubicación del evento"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción (opcional)
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Descripción del evento"
                    />
                </div>

                {/* Sección de Trabajo */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isWork"
                            checked={formData.isWork || false}
                            onChange={(e) => handleChange('isWork', e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
                        />
                        <label htmlFor="isWork" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Este evento está relacionado con trabajo
                        </label>
                    </div>

                    {formData.isWork && (
                        <>
                            <Select
                                label="Empresa *"
                                value={formData.companyId || ''}
                                onChange={(e) => handleChange('companyId', e.target.value)}
                                options={[
                                    { value: '', label: 'Selecciona una empresa' },
                                    ...companies.map((comp) => ({
                                        value: comp._id || '',
                                        label: comp.name,
                                    })),
                                ]}
                                required
                            />

                            <Select
                                label="Estado del trabajo *"
                                value={formData.workStatus || 'pending'}
                                onChange={(e) => handleChange('workStatus', e.target.value)}
                                options={[
                                    { value: 'pending', label: 'Pendiente' },
                                    { value: 'in_progress', label: 'En Proceso' },
                                    { value: 'paid', label: 'Pagado' },
                                ]}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Precio *
                                </label>
                                <input
                                    type="text"
                                    value={priceDisplay}
                                    onChange={(e) => {
                                        // Solo permitir números
                                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                                        if (rawValue === '') {
                                            setPriceDisplay('');
                                            handleChange('price', undefined);
                                            return;
                                        }
                                        // Convertir a número
                                        const numValue = parseInt(rawValue, 10);
                                        if (!isNaN(numValue)) {
                                            // Formatear con puntos mientras se escribe
                                            setPriceDisplay(formatNumber(numValue));
                                            handleChange('price', numValue);
                                        }
                                    }}
                                    placeholder="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="includesExpenses"
                                    checked={formData.includesExpenses || false}
                                    onChange={(e) => handleChange('includesExpenses', e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600"
                                />
                                <label htmlFor="includesExpenses" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Incluye viáticos
                                </label>
                            </div>

                            {formData.includesExpenses && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Viáticos *
                                    </label>
                                    <input
                                        type="text"
                                        value={expensesDisplay}
                                        onChange={(e) => {
                                            // Solo permitir números
                                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                                            if (rawValue === '') {
                                                setExpensesDisplay('');
                                                handleChange('expenses', undefined);
                                                return;
                                            }
                                            // Convertir a número
                                            const numValue = parseInt(rawValue, 10);
                                            if (!isNaN(numValue)) {
                                                // Formatear con puntos mientras se escribe
                                                setExpensesDisplay(formatNumber(numValue));
                                                handleChange('expenses', numValue);
                                            }
                                        }}
                                        placeholder="0"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default EventModal;
