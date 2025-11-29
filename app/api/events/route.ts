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

        console.log('🔍 DEBUG - Body recibido en API:', {
            isWork: body.isWork,
            companyId: body.companyId,
            price: body.price,
            includesExpenses: body.includesExpenses,
            expenses: body.expenses,
        });

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

        // Preparar los datos del evento
        const eventData: any = {
            ...body,
            userId: user._id?.toString(),
        };

        // Procesar campos de trabajo
        // Si isWork es false o no está definido, limpiar campos relacionados con trabajo
        if (!eventData.isWork) {
            delete eventData.companyId;
            delete eventData.workStatus;
            delete eventData.price;
            delete eventData.includesExpenses;
            delete eventData.expenses;
            eventData.isWork = false;
        } else {
            // Si isWork es true pero no hay companyId válido, limpiar campos
            if (!eventData.companyId || eventData.companyId.trim() === '') {
                delete eventData.companyId;
                delete eventData.workStatus;
                delete eventData.price;
                delete eventData.includesExpenses;
                delete eventData.expenses;
                eventData.isWork = false;
            } else {
                // Asegurar que workStatus tenga un valor válido
                if (!eventData.workStatus || !['pending', 'in_progress', 'paid'].includes(eventData.workStatus)) {
                    eventData.workStatus = 'pending';
                }
                
                // Asegurar que includesExpenses sea un booleano
                eventData.includesExpenses = Boolean(eventData.includesExpenses);
                
                // Convertir price a número si existe (asegurar que sea válido)
                // Verificar si price está presente (puede ser 0, que es válido)
                if (eventData.price !== undefined && eventData.price !== null) {
                    // Si es string vacío, no guardarlo
                    if (eventData.price === '') {
                        delete eventData.price;
                    } else {
                        const priceNum = Number(eventData.price);
                        if (!isNaN(priceNum) && priceNum >= 0) {
                            eventData.price = priceNum;
                        } else {
                            delete eventData.price;
                        }
                    }
                } else {
                    // Si no hay precio, no guardarlo
                    delete eventData.price;
                }
                
                // Si includesExpenses es false, limpiar expenses
                if (!eventData.includesExpenses) {
                    delete eventData.expenses;
                } else {
                    // Convertir expenses a número si existe y includesExpenses es true
                    // Verificar si expenses está presente (puede ser 0, que es válido)
                    if (eventData.expenses !== undefined && eventData.expenses !== null) {
                        // Si es string vacío, no guardarlo
                        if (eventData.expenses === '') {
                            delete eventData.expenses;
                        } else {
                            const expensesNum = Number(eventData.expenses);
                            if (!isNaN(expensesNum) && expensesNum >= 0) {
                                eventData.expenses = expensesNum;
                            } else {
                                delete eventData.expenses;
                            }
                        }
                    } else {
                        delete eventData.expenses;
                    }
                }
            }
        }

        console.log('🔍 DEBUG - eventData antes de crear:', {
            isWork: eventData.isWork,
            companyId: eventData.companyId,
            price: eventData.price,
            includesExpenses: eventData.includesExpenses,
            expenses: eventData.expenses,
        });

        const event = await EventModel.create(eventData);
        
        console.log('🔍 DEBUG - Evento creado:', {
            _id: (event as any)._id?.toString(),
            price: (event as any).price,
            expenses: (event as any).expenses,
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
