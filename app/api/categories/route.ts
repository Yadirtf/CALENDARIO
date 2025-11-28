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

        const categories = await CategoryModel.find({ userId: user._id?.toString() }).sort({ name: 1 });

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

        // Verificar si ya existe una categoría con el mismo nombre para este usuario
        const existingCategory = await CategoryModel.findOne({
            name: body.name?.trim(),
            userId: user._id?.toString(),
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

        const category = await CategoryModel.create({
            ...body,
            userId: user._id?.toString(),
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
