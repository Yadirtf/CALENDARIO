import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import EventModel from '@/lib/models/Event';

// GET /api/events/[id] - Obtener un evento específico
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const event = await EventModel.findById(id);

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener evento',
            },
            { status: 500 }
        );
    }
}

// PUT /api/events/[id] - Actualizar evento
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await request.json();

        // Validar que endDate sea después de startDate
        if (body.endDate && body.startDate && new Date(body.endDate) < new Date(body.startDate)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'La fecha de fin debe ser posterior a la fecha de inicio',
                },
                { status: 400 }
            );
        }

        const event = await EventModel.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: event,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al actualizar evento',
            },
            { status: 400 }
        );
    }
}

// DELETE /api/events/[id] - Eliminar evento
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const event = await EventModel.findByIdAndDelete(id);

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado',
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
                error: error.message || 'Error al eliminar evento',
            },
            { status: 500 }
        );
    }
}
