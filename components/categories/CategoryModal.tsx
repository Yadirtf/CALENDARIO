'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';
import { Category } from '@/lib/types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: Partial<Category>) => void;
    category?: Category | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    category,
}) => {
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        color: '#3b82f6',
    });

    useEffect(() => {
        if (category) {
            setFormData(category);
        } else {
            setFormData({
                name: '',
                color: '#3b82f6',
            });
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (field: keyof Category, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category ? 'Editar Categoría' : 'Nueva Categoría'}
            size="sm"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {category ? 'Actualizar' : 'Crear'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nombre"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="Nombre de la categoría"
                />

                <ColorPicker
                    value={formData.color || '#3b82f6'}
                    onChange={(color) => handleChange('color', color)}
                    label="Color"
                />

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vista previa
                    </label>
                    <div
                        className="w-full h-12 rounded-lg flex items-center justify-center text-white font-medium shadow-sm transition-all"
                        style={{ backgroundColor: formData.color }}
                    >
                        {formData.name || 'Nombre de categoría'}
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
