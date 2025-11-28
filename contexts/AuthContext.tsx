'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
    User as FirebaseUser,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User, AuthUser } from '@/lib/types';

interface AuthContextType {
    user: FirebaseUser | null;
    userData: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, firstName: string, lastName: string, dateOfBirth: Date) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Cargar datos del usuario desde MongoDB
    const fetchUserData = async (firebaseUser: FirebaseUser) => {
        try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch('/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            setUserData(null);
        }
    };

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await fetchUserData(firebaseUser);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        dateOfBirth: Date
    ) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();

        // Crear usuario en MongoDB
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email,
                firstName,
                lastName,
                dateOfBirth: dateOfBirth.toISOString(),
                provider: 'email',
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al registrar usuario');
        }

        const data = await response.json();
        setUserData(data.user);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const token = await userCredential.user.getIdToken();

        // Extraer nombre y apellido del displayName de Google
        const displayName = userCredential.user.displayName || '';
        // Filtrar palabras comunes que no son parte del nombre real
        const nameParts = displayName.trim().split(' ').filter(part => 
            part.toLowerCase() !== 'google' && part.length > 0
        );
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Verificar o crear usuario en MongoDB
        const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                email: userCredential.user.email,
                firstName: firstName,
                lastName: lastName,
                provider: 'google',
            }),
        });

        if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserData(null);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const refreshUserData = async () => {
        if (user) {
            await fetchUserData(user);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userData,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut,
                resetPassword,
                refreshUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

