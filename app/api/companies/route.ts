import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import CompanyModel from '@/lib/models/Company';
import { getUserFromRequest } from '@/lib/auth/getUserFromRequest';

// GET /api/companies - Obtener todas las empresas del usuario
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

        const companies = await CompanyModel.find({ userId: userId }).sort({ name: 1 });

        return NextResponse.json({
            success: true,
            data: companies,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener empresas',
            },
            { status: 500 }
        );
    }
}

// POST /api/companies - Crear nueva empresa
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

        // Obtener el userId como string de forma segura
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

        // Verificar si ya existe una empresa con el mismo nombre para ESTE usuario específico
        const allCompaniesWithName = await CompanyModel.find({
            name: companyName.trim(),
        });

        // Filtrar manualmente para encontrar solo la empresa del usuario actual
        const existingCompany = allCompaniesWithName.find(
            (comp) => String(comp.userId || '').trim() === String(userId || '').trim()
        );

        // Si encontramos una empresa del usuario actual, rechazar
        if (existingCompany) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Ya existe una empresa con este nombre en tu cuenta',
                },
                { status: 400 }
            );
        }

        const company = await CompanyModel.create({
            name: companyName,
            nit: body.nit?.trim() || undefined,
            country: body.country.trim(),
            address: body.address?.trim() || undefined,
            phone: body.phone.trim(),
            email: body.email?.trim() || undefined,
            website: body.website?.trim() || undefined,
            logo: body.logo?.trim() || undefined,
            userId: userId,
        });

        return NextResponse.json(
            {
                success: true,
                data: company,
            },
            { status: 201 }
        );
    } catch (error: any) {
        // Manejar errores de índice duplicado de forma más clara
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
                error: error.message || 'Error al crear empresa',
            },
            { status: 400 }
        );
    }
}

