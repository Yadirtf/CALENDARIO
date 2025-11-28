import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import UserModel from '@/lib/models/User';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
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

        // Buscar usuario en MongoDB
        const user = await UserModel.findOne({ firebaseUid });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error: any) {
        console.error('Error al obtener usuario:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Error al obtener usuario',
            },
            { status: 500 }
        );
    }
}

