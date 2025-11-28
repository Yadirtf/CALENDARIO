import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import EventModel from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/events/[id] - Obtener un evento específico
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

        const event = await EventModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado o no tienes permisos',
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

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Verificar que el evento pertenezca al usuario
        const existingEvent = await EventModel.findOne({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!existingEvent) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado o no tienes permisos',
                },
                { status: 404 }
            );
        }

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
            { ...body, userId: user._id?.toString() }, // Asegurar que userId no se modifique
            {
                new: true,
                runValidators: true,
            }
        );

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

        const user = await getUserFromRequest(request);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'No autenticado' },
                { status: 401 }
            );
        }

        const event = await EventModel.findOneAndDelete({
            _id: id,
            userId: user._id?.toString(),
        });

        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Evento no encontrado o no tienes permisos',
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
