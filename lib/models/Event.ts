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
        // Campos relacionados con trabajo
        isWork: {
            type: Boolean,
            default: false,
        },
        companyId: {
            type: String,
            trim: true,
        },
        workStatus: {
            type: String,
            enum: ['pending', 'in_progress', 'paid'],
            default: 'pending',
        },
        price: {
            type: Number,
            min: [0, 'El precio no puede ser negativo'],
        },
        includesExpenses: {
            type: Boolean,
            default: false,
        },
        expenses: {
            type: Number,
            min: [0, 'Los viáticos no pueden ser negativos'],
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
EventSchema.index({ companyId: 1 });
EventSchema.index({ isWork: 1 });

// Asegurarnos de que el modelo en caché (mongoose.models.Event) tenga
// los campos más recientes aunque el esquema haya cambiado durante el desarrollo.
let EventModel: Model<Event>;

if (mongoose.models.Event) {
    EventModel = mongoose.models.Event as Model<Event>;

    const paths = EventModel.schema.paths;

    // Añadir dinámicamente los campos de trabajo si no existen
    const needsPrice = !paths.price;
    const needsIncludesExpenses = !paths.includesExpenses;
    const needsExpenses = !paths.expenses;

    if (needsPrice || needsIncludesExpenses || needsExpenses) {
        EventModel.schema.add({
            ...(needsPrice && {
                price: {
                    type: Number,
                    min: [0, 'El precio no puede ser negativo'],
                },
            }),
            ...(needsIncludesExpenses && {
                includesExpenses: {
                    type: Boolean,
                    default: false,
                },
            }),
            ...(needsExpenses && {
                expenses: {
                    type: Number,
                    min: [0, 'Los viáticos no pueden ser negativos'],
                },
            }),
        });
    }
} else {
    EventModel = mongoose.model<Event>('Event', EventSchema);
}

export default EventModel;
