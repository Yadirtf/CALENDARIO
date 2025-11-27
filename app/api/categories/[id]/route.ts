import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CategoryModel from '@/lib/models/Category';
import EventModel from '@/lib/models/Event';
import TaskModel from '@/lib/models/Task';

// PUT /api/categories/[id] - Actualizar categoría
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await request.json();

        // Verificar si el nombre ya existe (excluyendo la categoría actual)
        if (body.name) {
            const existingCategory = await CategoryModel.findOne({
                name: body.name,
                _id: { $ne: id }
            });

            if (existingCategory) {
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
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Categoría no encontrada',
                },
                { status: 404 }
            );
        }

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

        // Verificar si la categoría existe
        const category = await CategoryModel.findById(id);

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Categoría no encontrada',
                },
                { status: 404 }
            );
        }

        // Verificar si hay eventos o tareas usando esta categoría
        // Nota: Buscamos por nombre ya que actualmente guardamos el nombre en los modelos de Event y Task
        // Idealmente deberíamos migrar a usar IDs, pero para mantener compatibilidad buscamos por nombre
        const eventsCount = await EventModel.countDocuments({ category: category.name });
        const tasksCount = await TaskModel.countDocuments({ category: category.name });

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
