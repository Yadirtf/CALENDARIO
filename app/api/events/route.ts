import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import EventModel from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/events - Obtener todos los eventos
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

        const { searchParams } = new URL(request.url);
        const start = searchParams.get('start');
        const end = searchParams.get('end');
        const category = searchParams.get('category');

        let query: any = {
            userId: user._id?.toString(),
        };

        // Filtrar por rango de fechas
        if (start && end) {
            query.startDate = {
                $gte: new Date(start),
                $lte: new Date(end),
            };
        }

        // Filtrar por categoría
        if (category) {
            query.category = category;
        }

        const events = await EventModel.find(query).sort({ startDate: 1 });

        return NextResponse.json({
            success: true,
            data: events,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener eventos',
            },
            { status: 500 }
        );
    }
}

// POST /api/events - Crear nuevo evento
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

        // Validar que endDate sea después de startDate
        if (new Date(body.endDate) < new Date(body.startDate)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'La fecha de fin debe ser posterior a la fecha de inicio',
                },
                { status: 400 }
            );
        }

        const event = await EventModel.create({
            ...body,
            userId: user._id?.toString(),
        });

        return NextResponse.json(
            {
                success: true,
                data: event,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al crear evento',
            },
            { status: 400 }
        );
    }
}
