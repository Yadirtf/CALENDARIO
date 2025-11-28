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
        },
    },
    {
        timestamps: true,
    }
);

// Índices
CategorySchema.index({ userId: 1 });
// Índice compuesto para que el nombre sea único por usuario
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const CategoryModel: Model<Category> = mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema);

export default CategoryModel;
