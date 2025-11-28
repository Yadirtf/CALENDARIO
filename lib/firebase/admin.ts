import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let adminAuth: Auth | null = null;

export function initializeFirebaseAdmin(): { app: App | null; auth: Auth | null } {
    // Si ya está inicializado, retornar las instancias existentes
    if (adminApp && adminAuth) {
        return { app: adminApp, auth: adminAuth };
    }

    // Verificar que las credenciales estén disponibles
    if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
        console.warn('Firebase Admin no está configurado. Las credenciales FIREBASE_PRIVATE_KEY y FIREBASE_CLIENT_EMAIL son requeridas.');
        return { app: null, auth: null };
    }

    try {
        // Si ya hay una app inicializada, usarla
        if (getApps().length > 0) {
            adminApp = getApps()[0];
            adminAuth = getAuth(adminApp);
            return { app: adminApp, auth: adminAuth };
        }

        // Inicializar nueva app
        adminApp = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });

        adminAuth = getAuth(adminApp);
        return { app: adminApp, auth: adminAuth };
    } catch (error) {
        console.error('Error al inicializar Firebase Admin:', error);
        return { app: null, auth: null };
    }
}

export function getAdminAuth(): Auth | null {
    if (!adminAuth) {
        const { auth } = initializeFirebaseAdmin();
        return auth;
    }
    return adminAuth;
}

