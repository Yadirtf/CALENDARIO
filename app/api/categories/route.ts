import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CategoryModel from '@/lib/models/Category';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/categories - Obtener todas las categorías
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const userId = user._id ? String(user._id) : null;
        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Error al identificar el usuario' },
                { status: 500 }
            );
        }

        const categories = await CategoryModel.find({ userId: userId }).sort({ name: 1 });

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener categorías',
            },
            { status: 500 }
        );
    }
}

// POST /api/categories - Crear nueva categoría
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Normalizar el nombre (trim y asegurar que no esté vacío)
        const categoryName = body.name?.trim();
        if (!categoryName) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'El nombre de la categoría es requerido',
                },
                { status: 400 }
            );
        }

        // Obtener el userId como string de forma segura
        // Asegurarse de que sea un string válido
        const userId = user._id ? String(user._id) : null;
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Error al identificar el usuario',
                },
                { status: 500 }
            );
        }

        // Verificar si ya existe una categoría con el mismo nombre para ESTE usuario específico
        // Búsqueda exacta por nombre y userId para asegurar que solo busque en las categorías del usuario actual
        // Usar $eq para asegurar comparación exacta
        const existingCategory = await CategoryModel.findOne({
            name: { $eq: categoryName },
            userId: { $eq: userId },
        });

        // Verificación adicional: asegurar que la categoría encontrada realmente pertenezca al usuario
        // Comparar ambos userIds como strings para evitar problemas de tipo
        if (existingCategory) {
            const existingUserId = String(existingCategory.userId || '');
            const currentUserId = String(userId || '');
            
            // Solo rechazar si los userIds coinciden (mismo usuario)
            if (existingUserId === currentUserId && existingUserId !== '') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Ya existe una categoría con este nombre en tu cuenta',
                    },
                    { status: 400 }
                );
            }
        }

        const category = await CategoryModel.create({
            name: categoryName,
            color: body.color,
            userId: userId,
        });

        return NextResponse.json(
            {
                success: true,
                data: category,
            },
            { status: 201 }
        );
    } catch (error: any) {
        // Manejar errores de índice duplicado de forma más clara
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Ya existe una categoría con este nombre en tu cuenta',
                },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al crear categoría',
            },
            { status: 400 }
        );
    }
}
