import mongoose, { Schema, Model } from 'mongoose';
import { Event } from '@/lib/types';

const EventSchema = new Schema<Event>(
    {
        title: {
            type: String,
            required: [true, 'El título es requerido'],
            trim: true,
            maxlength: [100, 'El título no puede exceder 100 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'La descripción no puede exceder 500 caracteres'],
        },
        startDate: {
            type: Date,
            required: [true, 'La fecha de inicio es requerida'],
        },
        endDate: {
            type: Date,
            required: [true, 'La fecha de fin es requerida'],
        },
        allDay: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            required: [true, 'La categoría es requerida'],
            trim: true,
        },
        color: {
            type: String,
            required: [true, 'El color es requerido'],
            match: [/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido'],
        },
        location: {
            type: String,
            trim: true,
            maxlength: [200, 'La ubicación no puede exceder 200 caracteres'],
        },
        reminder: {
            type: Date,
        },
        userId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Índices para mejorar el rendimiento de las consultas
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ userId: 1 });

const EventModel: Model<Event> = mongoose.models.Event || mongoose.model<Event>('Event', EventSchema);

export default EventModel;
