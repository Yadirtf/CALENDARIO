import mongoose, { Schema, Model } from 'mongoose';
import { Company } from '@/lib/types';

const CompanySchema = new Schema<Company>(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la empresa es requerido'],
            trim: true,
            maxlength: [200, 'El nombre no puede exceder 200 caracteres'],
        },
        nit: {
            type: String,
            trim: true,
            maxlength: [50, 'El NIT no puede exceder 50 caracteres'],
        },
        country: {
            type: String,
            required: [true, 'El país es requerido'],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
            maxlength: [500, 'La dirección no puede exceder 500 caracteres'],
        },
        phone: {
            type: String,
            required: [true, 'El número de teléfono es requerido'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo electrónico no es válido'],
        },
        website: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'La URL del sitio web debe comenzar con http:// o https://'],
        },
        logo: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'La URL del logo debe comenzar con http:// o https://'],
        },
        userId: {
            type: String,
            required: [true, 'El userId es requerido'],
        },
    },
    {
        timestamps: true,
    }
);

// Índice compuesto para asegurar que el nombre de empresa sea único por usuario
CompanySchema.index({ name: 1, userId: 1 }, { unique: true });
CompanySchema.index({ userId: 1 });

const CompanyModel: Model<Company> = mongoose.models.Company || mongoose.model<Company>('Company', CompanySchema);

export default CompanyModel;

