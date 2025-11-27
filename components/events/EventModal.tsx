'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';
import { Event, Category } from '@/lib/types';

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
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        allDay: false,
        category: categories[0]?.name || 'Personal',
        color: categories[0]?.color || '#3b82f6',
        location: '',
    });

    useEffect(() => {
        if (event) {
            setFormData(event);
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
            });
        }
    }, [event, initialData, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (field: keyof Event, value: any) => {
        setFormData((prev) => {
            const updates: any = { [field]: value };

            // Si cambia la categoría, actualizar también el color
            if (field === 'category') {
                const selectedCategory = categories.find(c => c.name === value);
                if (selectedCategory) {
                    updates.color = selectedCategory.color;
                }
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción (opcional)
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Descripción del evento"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EventModal;
