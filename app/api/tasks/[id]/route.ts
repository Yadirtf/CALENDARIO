import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import TaskModel from '@/lib/models/Task';

// GET /api/tasks/[id] - Obtener una tarea específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const task = await TaskModel.findById(id);

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener tarea',
            },
            { status: 500 }
        );
    }
}

// PUT /api/tasks/[id] - Actualizar tarea
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await request.json();

        const task = await TaskModel.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al actualizar tarea',
            },
            { status: 400 }
        );
    }
}

// DELETE /api/tasks/[id] - Eliminar tarea
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const task = await TaskModel.findByIdAndDelete(id);

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al eliminar tarea',
            },
            { status: 500 }
        );
    }
}

// PATCH /api/tasks/[id] - Marcar tarea como completada/incompleta
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await request.json();
        const { completed } = body;

        const task = await TaskModel.findByIdAndUpdate(
            id,
            { completed },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al actualizar estado de tarea',
            },
            { status: 400 }
        );
    }
}
