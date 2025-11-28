import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import TaskModel from '@/lib/models/Task';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/tasks/[id] - Obtener una tarea específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const task = await TaskModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada o no tienes permisos',
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

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Verificar que la tarea pertenezca al usuario
        const existingTask = await TaskModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!existingTask) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada o no tienes permisos',
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        const task = await TaskModel.findByIdAndUpdate(
            id,
            { ...body, userId: user._id?.toString() }, // Asegurar que userId no se modifique
            {
                new: true,
                runValidators: true,
            }
        );

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

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const task = await TaskModel.findOneAndDelete({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada o no tienes permisos',
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

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Verificar que la tarea pertenezca al usuario
        const existingTask = await TaskModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!existingTask) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Tarea no encontrada o no tienes permisos',
                },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { completed } = body;

        const task = await TaskModel.findByIdAndUpdate(
            id,
            { completed, userId: user._id?.toString() }, // Asegurar que userId no se modifique
            {
                new: true,
                runValidators: true,
            }
        );

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
