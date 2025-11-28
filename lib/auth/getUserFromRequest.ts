import { NextRequest } from 'next/server';
import UserModel from '@/lib/models/User';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function getUserFromRequest(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const token = authHeader.split('Bearer ')[1];
        
        // Verificar token con Firebase Admin
        const auth = getAdminAuth();
        if (!auth) {
            console.warn('Firebase Admin no está configurado. Las credenciales FIREBASE_PRIVATE_KEY y FIREBASE_CLIENT_EMAIL son requeridas.');
            return null;
        }

        const decodedToken = await auth.verifyIdToken(token);
        const firebaseUid = decodedToken.uid;

        // Buscar usuario en MongoDB
        const user = await UserModel.findOne({ firebaseUid });
        
        return user;
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return null;
    }
}

