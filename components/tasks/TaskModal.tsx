'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ColorPicker } from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';
import { Task, Category } from '@/lib/types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    task?: Task | null;
    categories: Category[];
}

const TaskModal: React.FC<TaskModalProps> = ({
    isOpen,
    onClose,
    onSave,
    task,
    categories,
}) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        dueDate: undefined,
        completed: false,
        priority: 'medium',
        category: categories[0]?.name || 'Personal',
        color: categories[0]?.color || '#3b82f6',
    });

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
            const defaultCategory = categories[0];
            setFormData({
                title: '',
                description: '',
                dueDate: undefined,
                completed: false,
                priority: 'medium',
                category: defaultCategory?.name || 'Personal',
                color: defaultCategory?.color || '#3b82f6',
            });
        }
    }, [task, categories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (field: keyof Task, value: any) => {
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

    const formatDateTimeLocal = (date?: Date) => {
        if (!date) return '';
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

    const priorityOptions = [
        { value: 'low', label: 'Baja' },
        { value: 'medium', label: 'Media' },
        { value: 'high', label: 'Alta' },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={task ? 'Editar Tarea' : 'Nueva Tarea'}
            size="lg"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {task ? 'Actualizar' : 'Crear'}
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
                    placeholder="Título de la tarea"
                />

                <Input
                    label="Fecha de vencimiento (opcional)"
                    type="datetime-local"
                    value={formatDateTimeLocal(formData.dueDate)}
                    onChange={(e) =>
                        handleChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Prioridad"
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                        options={priorityOptions}
                        required
                    />

                    <Select
                        label="Categoría"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        options={categoryOptions}
                    />
                </div>

                <ColorPicker
                    value={formData.color || '#3b82f6'}
                    onChange={(color) => handleChange('color', color)}
                    label="Color"
                />

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="completed"
                        checked={formData.completed}
                        onChange={(e) => handleChange('completed', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                        Marcar como completada
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción (opcional)
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Descripción de la tarea"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;
