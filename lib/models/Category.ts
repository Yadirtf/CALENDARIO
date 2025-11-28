import mongoose, { Schema, Model } from 'mongoose';
import { Category } from '@/lib/types';

const CategorySchema = new Schema<Category>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
        },
        color: {
            type: String,
            required: [true, 'El color es requerido'],
            match: [/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido'],
        },
        userId: {
            type: String,
            required: [true, 'El userId es requerido'],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Índice compuesto para que el nombre sea único por usuario (no globalmente)
// Esto permite que diferentes usuarios tengan categorías con el mismo nombre
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const CategoryModel: Model<Category> = mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema);

export default CategoryModel;
