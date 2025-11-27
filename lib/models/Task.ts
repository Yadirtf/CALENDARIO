import mongoose, { Schema, Model } from 'mongoose';
import { Task } from '@/lib/types';

const TaskSchema = new Schema<Task>(
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
        dueDate: {
            type: Date,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        category: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
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

// Índices para mejorar el rendimiento de las consultas
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ userId: 1 });

const TaskModel: Model<Task> = mongoose.models.Task || mongoose.model<Task>('Task', TaskSchema);

export default TaskModel;
