import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import TaskModel from '@/lib/models/Task';

// GET /api/tasks - Obtener todas las tareas
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const completed = searchParams.get('completed');
        const priority = searchParams.get('priority');
        const category = searchParams.get('category');
        const date = searchParams.get('date');

        let query: any = {};

        // Filtrar por estado de completado
        if (completed !== null) {
            query.completed = completed === 'true';
        }

        // Filtrar por prioridad
        if (priority) {
            query.priority = priority;
        }

        // Filtrar por categoría
        if (category) {
            query.category = category;
        }

        // Filtrar por fecha de vencimiento
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.dueDate = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        }

        const tasks = await TaskModel.find(query).sort({ dueDate: 1, priority: -1 });

        return NextResponse.json({
            success: true,
            data: tasks,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener tareas',
            },
            { status: 500 }
        );
    }
}

// POST /api/tasks - Crear nueva tarea
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        const task = await TaskModel.create(body);

        return NextResponse.json(
            {
                success: true,
                data: task,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al crear tarea',
            },
            { status: 400 }
        );
    }
}
