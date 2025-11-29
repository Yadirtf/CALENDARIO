import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CompanyModel from '@/lib/models/Company';
import EventModel from '@/lib/models/Event';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/companies/[id] - Obtener una empresa específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const company = await CompanyModel.findOne({
            _id: id,
            userId: userId,
        });

        if (!company) {
            return NextResponse.json(
                { success: false, error: 'Empresa no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: company,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener empresa',
            },
            { status: 500 }
        );
    }
}

// PUT /api/companies/[id] - Actualizar una empresa
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        // Verificar que la empresa existe y pertenece al usuario
        const existingCompany = await CompanyModel.findOne({
            _id: id,
            userId: userId,
        });

        if (!existingCompany) {
            return NextResponse.json(
                { success: false, error: 'Empresa no encontrada' },
                { status: 404 }
            );
        }

        const body = await request.json();

        // Normalizar el nombre (trim y asegurar que no esté vacío)
        const companyName = body.name?.trim();
        if (!companyName) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'El nombre de la empresa es requerido',
                },
                { status: 400 }
            );
        }

        // Validar país
        if (!body.country?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'El país es requerido',
                },
                { status: 400 }
            );
        }

        // Validar teléfono
        if (!body.phone?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'El número de teléfono es requerido',
                },
                { status: 400 }
            );
        }

        // Verificar si ya existe otra empresa con el mismo nombre para ESTE usuario
        if (companyName !== existingCompany.name) {
            const allCompaniesWithName = await CompanyModel.find({
                name: companyName.trim(),
            });

            const duplicateCompany = allCompaniesWithName.find(
                (comp) =>
                    String(comp.userId || '').trim() === String(userId || '').trim() &&
                    String(comp._id) !== String(id)
            );

            if (duplicateCompany) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Ya existe una empresa con este nombre en tu cuenta',
                    },
                    { status: 400 }
                );
            }
        }

        const company = await CompanyModel.findByIdAndUpdate(
            id,
            {
                name: companyName,
                nit: body.nit?.trim() || undefined,
                country: body.country.trim(),
                address: body.address?.trim() || undefined,
                phone: body.phone.trim(),
                email: body.email?.trim() || undefined,
                website: body.website?.trim() || undefined,
                logo: body.logo?.trim() || undefined,
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            data: company,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Ya existe una empresa con este nombre en tu cuenta',
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al actualizar empresa',
            },
            { status: 400 }
        );
    }
}

// DELETE /api/companies/[id] - Eliminar una empresa
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        // Verificar que la empresa existe y pertenece al usuario
        const company = await CompanyModel.findOne({
            _id: id,
            userId: userId,
        });

        if (!company) {
            return NextResponse.json(
                { success: false, error: 'Empresa no encontrada' },
                { status: 404 }
            );
        }

        // Verificar si hay eventos asociados a esta empresa
        const eventsCount = await EventModel.countDocuments({
            companyId: id,
            userId: userId,
        });

        if (eventsCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `No se puede eliminar la empresa porque tiene ${eventsCount} evento(s) asociado(s). Primero elimina o actualiza los eventos relacionados.`,
                },
                { status: 400 }
            );
        }

        await CompanyModel.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Empresa eliminada correctamente',
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al eliminar empresa',
            },
            { status: 500 }
        );
    }
}

