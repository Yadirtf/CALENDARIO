import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CategoryModel from '@/lib/models/Category';
import EventModel from '@/lib/models/Event';
import TaskModel from '@/lib/models/Task';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// PUT /api/categories/[id] - Actualizar categoría
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

        // Verificar que la categoría pertenezca al usuario
        const existingCategory = await CategoryModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!existingCategory) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Categoría no encontrada o no tienes permisos',
                },
                { status: 404 }
            );
        }

        const body = await request.json();

        // Verificar si el nombre ya existe para este usuario (excluyendo la categoría actual)
        if (body.name && body.name !== existingCategory.name) {
            const duplicateCategory = await CategoryModel.findOne({
                name: body.name,
                userId: user._id?.toString(),
                _id: { $ne: id },
            });

            if (duplicateCategory) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Ya existe una categoría con este nombre',
                    },
                    { status: 400 }
                );
            }
        }

        const category = await CategoryModel.findByIdAndUpdate(
            id,
            { ...body, userId: user._id?.toString() }, // Asegurar que userId no se modifique
            {
                new: true,
                runValidators: true,
            }
        );

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al actualizar categoría',
            },
            { status: 400 }
        );
    }
}

// DELETE /api/categories/[id] - Eliminar categoría
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

        // Verificar que la categoría pertenezca al usuario
        const category = await CategoryModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Categoría no encontrada o no tienes permisos',
                },
                { status: 404 }
            );
        }

        // Verificar si hay eventos o tareas usando esta categoría (solo del usuario actual)
        const eventsCount = await EventModel.countDocuments({
            category: category.name,
            userId: user._id?.toString(),
        });
        const tasksCount = await TaskModel.countDocuments({
            category: category.name,
            userId: user._id?.toString(),
        });

        if (eventsCount > 0 || tasksCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `No se puede eliminar la categoría porque está en uso en ${eventsCount} eventos y ${tasksCount} tareas.`,
                },
                { status: 400 }
            );
        }

        await CategoryModel.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            data: {},
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al eliminar categoría',
            },
            { status: 500 }
        );
    }
}
