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

        const userId = user._id?.toString();
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
        // Usar el mismo patrón que en otras rutas para mantener consistencia
        const userId = user._id?.toString();
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
        // Estrategia: Buscar todas las categorías con ese nombre y filtrar manualmente por userId
        // Esto evita problemas con índices o consultas que no filtren correctamente
        const allCategoriesWithName = await CategoryModel.find({
            name: categoryName.trim(),
        });

        // Filtrar manualmente para encontrar solo la categoría del usuario actual
        const existingCategory = allCategoriesWithName.find(
            (cat) => String(cat.userId || '').trim() === String(userId || '').trim()
        );

        // Si encontramos una categoría del usuario actual, rechazar
        if (existingCategory) {
            // DEBUG: Log temporal para ver qué está pasando
            console.log('DEBUG - Categoría duplicada encontrada:');
            console.log('  - Nombre categoría:', categoryName);
            console.log('  - userId actual:', userId);
            console.log('  - userId de categoría existente:', String(existingCategory.userId || ''));
            console.log('  - Total categorías con ese nombre:', allCategoriesWithName.length);
            console.log('  - userIds de todas las categorías encontradas:', allCategoriesWithName.map(c => String(c.userId || '')));
            
            return NextResponse.json(
                {
                    success: false,
                    error: 'Ya existe una categoría con este nombre en tu cuenta',
                },
                { status: 400 }
            );
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
