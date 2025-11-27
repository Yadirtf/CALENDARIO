import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CategoryModel from '@/lib/models/Category';

// GET /api/categories - Obtener todas las categorías
export async function GET() {
    try {
        await dbConnect();

        const categories = await CategoryModel.find({}).sort({ name: 1 });

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

        const body = await request.json();

        const category = await CategoryModel.create(body);

        return NextResponse.json(
            {
                success: true,
                data: category,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al crear categoría',
            },
            { status: 400 }
        );
    }
}
