'use client';

import React, { useState } from 'react';
import { Check, Palette } from 'lucide-react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    showCustomColor?: boolean;
}

const PRESET_COLORS = [
    { value: '#3b82f6', name: 'Azul' },
    { value: '#8b5cf6', name: 'Púrpura' },
    { value: '#10b981', name: 'Verde' },
    { value: '#f59e0b', name: 'Amarillo' },
    { value: '#ef4444', name: 'Rojo' },
    { value: '#ec4899', name: 'Rosa' },
    { value: '#6366f1', name: 'Índigo' },
    { value: '#14b8a6', name: 'Turquesa' },
    { value: '#f97316', name: 'Naranja' },
    { value: '#64748b', name: 'Gris' },
    { value: '#06b6d4', name: 'Cian' },
    { value: '#84cc16', name: 'Lima' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    onChange,
    label = 'Color',
    showCustomColor = true,
}) => {
    const [showCustom, setShowCustom] = useState(false);
    const isPresetColor = PRESET_COLORS.some((color) => color.value === value);

    const handlePresetColorClick = (color: string) => {
        onChange(color);
        setShowCustom(false);
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowCustom(true);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

            {/* Vista previa compacta y colores predeterminados */}
            <div className="flex items-center gap-2">
                {/* Vista previa del color seleccionado */}
                <div
                    className="w-8 h-8 rounded-md border-2 border-gray-300 shadow-sm flex items-center justify-center transition-all hover:scale-105 cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: value }}
                    onClick={() => showCustomColor && setShowCustom(!showCustom)}
                    title={showCustomColor ? "Click para color personalizado" : ""}
                >
                    {isPresetColor && (
                        <Check className="text-white drop-shadow-lg" size={14} />
                    )}
                </div>

                {/* Colores predeterminados compactos */}
                <div className="flex-1 flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((color) => {
                        const isSelected = value === color.value;
                        return (
                            <button
                                key={color.value}
                                type="button"
                                onClick={() => handlePresetColorClick(color.value)}
                                className={`
                                    w-7 h-7 rounded-full border transition-all
                                    hover:scale-110 hover:shadow-md
                                    ${isSelected ? 'border-gray-900 shadow-md scale-110 ring-2 ring-offset-1 ring-gray-300' : 'border-gray-300'}
                                `}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                                aria-label={`Seleccionar color ${color.name}`}
                            >
                                {isSelected && (
                                    <Check
                                        className="text-white drop-shadow-lg mx-auto"
                                        size={12}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selector de color personalizado colapsable */}
            {showCustomColor && (
                <div className={`transition-all duration-200 overflow-hidden ${showCustom ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-2 pt-1">
                        <Palette size={14} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="color"
                            value={value}
                            onChange={handleCustomColorChange}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
                            title="Seleccionar color personalizado"
                        />
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                                const hexColor = e.target.value;
                                if (/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
                                    onChange(hexColor);
                                }
                            }}
                            placeholder="#000000"
                            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                            pattern="^#[0-9A-Fa-f]{6}$"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

