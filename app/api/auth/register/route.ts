import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import UserModel from '@/lib/models/User';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Token de autenticación no proporcionado' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        
        // Verificar token con Firebase Admin
        const auth = getAdminAuth();
        if (!auth) {
            return NextResponse.json(
                { success: false, error: 'Firebase Admin no está configurado' },
                { status: 500 }
            );
        }
        const decodedToken = await auth.verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        const body = await request.json();
        const { email, firstName, lastName, dateOfBirth, provider } = body;

        // Validar datos
        if (!email || !firstName || !lastName || !dateOfBirth) {
            return NextResponse.json(
                { success: false, error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Verificar si el usuario ya existe
        const existingUser = await UserModel.findOne({ firebaseUid });
        if (existingUser) {
            return NextResponse.json(
                { success: true, user: existingUser },
                { status: 200 }
            );
        }

        // Crear nuevo usuario
        const user = await UserModel.create({
            firebaseUid,
            email,
            firstName,
            lastName,
            dateOfBirth: new Date(dateOfBirth),
            provider: provider || 'email',
        });

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error en registro:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al registrar usuario',
            },
            { status: 500 }
        );
    }
}

