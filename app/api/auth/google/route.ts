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
        const firebaseEmail = decodedToken.email;

        const body = await request.json();
        const { email, firstName, lastName, provider } = body;

        // Verificar si el usuario ya existe
        let user = await UserModel.findOne({ firebaseUid });

        if (user) {
            // Usuario existe, actualizar nombre si tiene "Google" en el lastName
            if (user.lastName && user.lastName.toLowerCase() === 'google') {
                user.lastName = lastName || '';
                await user.save();
            }
            return NextResponse.json(
                { success: true, user },
                { status: 200 }
            );
        }

        // Crear nuevo usuario (para Google, usamos fecha de nacimiento por defecto)
        // En producción, podrías pedirla después del primer login
        user = await UserModel.create({
            firebaseUid,
            email: email || firebaseEmail || '',
            firstName: firstName || 'Usuario',
            lastName: lastName || '', // No usar "Google" como valor por defecto
            dateOfBirth: new Date('1990-01-01'), // Fecha por defecto, se puede actualizar después
            provider: provider || 'google',
        });

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error en login con Google:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al autenticar con Google',
            },
            { status: 500 }
        );
    }
}

