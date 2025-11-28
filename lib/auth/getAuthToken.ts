import { auth } from '@/lib/firebase/config';

export async function getAuthToken(): Promise<string | null> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return null;
        }
        const token = await user.getIdToken();
        return token;
    } catch (error) {
        console.error('Error al obtener token:', error);
        return null;
    }
}

