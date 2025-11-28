import mongoose, { Schema, Model } from 'mongoose';
import { User } from '@/lib/types';

const UserSchema = new Schema<User>(
    {
        firebaseUid: {
            type: String,
            required: [true, 'El Firebase UID es requerido'],
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, 'El correo electrónico es requerido'],
            lowercase: true,
            trim: true,
            index: true,
        },
        firstName: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
        },
        lastName: {
            type: String,
            required: [true, 'El apellido es requerido'],
            trim: true,
            maxlength: [50, 'El apellido no puede exceder 50 caracteres'],
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'La fecha de nacimiento es requerida'],
        },
        provider: {
            type: String,
            enum: ['email', 'google'],
            required: [true, 'El proveedor es requerido'],
            default: 'email',
        },
    },
    {
        timestamps: true,
    }
);

// Índices para mejorar el rendimiento
UserSchema.index({ email: 1 });
UserSchema.index({ firebaseUid: 1 });

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;

