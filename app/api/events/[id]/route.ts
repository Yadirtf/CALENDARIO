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

        // Preparar los datos del evento
        const eventData: any = {
            ...body,
            userId: user._id?.toString(), // Asegurar que userId no se modifique
        };

        const updateData: any = { ...eventData };
        const unsetData: any = {};

        // Procesar campos de trabajo
        // Si isWork es false o no está definido, limpiar todos los campos relacionados con trabajo
        if (!updateData.isWork) {
            updateData.isWork = false;
            // Usar $unset para eliminar campos existentes
            unsetData.companyId = '';
            unsetData.workStatus = '';
            unsetData.price = '';
            unsetData.includesExpenses = '';
            unsetData.expenses = '';
        } else {
            // Si isWork es true pero no hay companyId válido, limpiar campos
            if (!updateData.companyId || (typeof updateData.companyId === 'string' && updateData.companyId.trim() === '')) {
                updateData.isWork = false;
                unsetData.companyId = '';
                unsetData.workStatus = '';
                unsetData.price = '';
                unsetData.includesExpenses = '';
                unsetData.expenses = '';
            } else {
                // Asegurar que workStatus tenga un valor válido
                if (!updateData.workStatus || !['pending', 'in_progress', 'paid'].includes(updateData.workStatus)) {
                    updateData.workStatus = 'pending';
                }
                
                // Asegurar que includesExpenses sea un booleano
                updateData.includesExpenses = Boolean(updateData.includesExpenses);
                
                // Convertir price a número si existe (asegurar que sea válido)
                // Verificar si price está presente (puede ser 0, que es válido)
                if (updateData.price !== undefined && updateData.price !== null) {
                    // Si es string vacío, eliminarlo
                    if (updateData.price === '') {
                        unsetData.price = '';
                    } else {
                        const priceNum = Number(updateData.price);
                        if (!isNaN(priceNum) && priceNum >= 0) {
                            updateData.price = priceNum;
                        } else {
                            unsetData.price = '';
                        }
                    }
                } else {
                    // Si no hay precio, eliminarlo
                    unsetData.price = '';
                }
                
                // Si includesExpenses es false, limpiar expenses
                if (!updateData.includesExpenses) {
                    unsetData.expenses = '';
                } else {
                    // Convertir expenses a número si existe y includesExpenses es true
                    // Verificar si expenses está presente (puede ser 0, que es válido)
                    if (updateData.expenses !== undefined && updateData.expenses !== null) {
                        // Si es string vacío, eliminarlo
                        if (updateData.expenses === '') {
                            unsetData.expenses = '';
                        } else {
                            const expensesNum = Number(updateData.expenses);
                            if (!isNaN(expensesNum) && expensesNum >= 0) {
                                updateData.expenses = expensesNum;
                            } else {
                                unsetData.expenses = '';
                            }
                        }
                    } else {
                        unsetData.expenses = '';
                    }
                }
            }
        }

        // Construir el objeto de actualización
        const updateQuery: any = { ...updateData };
        if (Object.keys(unsetData).length > 0) {
            updateQuery.$unset = unsetData;
        }

        const event = await EventModel.findByIdAndUpdate(
            id,
            updateQuery,
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
