'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: Theme;
    actualTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('auto');
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

    // Detectar si es hora de noche (18:00 - 6:00)
    const isNightTime = () => {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 6;
    };

    // Calcular el tema actual basado en la preferencia y la hora
    const calculateActualTheme = (preference: Theme): 'light' | 'dark' => {
        if (preference === 'light') return 'light';
        if (preference === 'dark') return 'dark';
        // Auto: cambiar según la hora
        return isNightTime() ? 'dark' : 'light';
    };

    // Inicializar tema desde localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
            const calculated = calculateActualTheme(savedTheme);
            setActualTheme(calculated);
            document.documentElement.classList.toggle('dark', calculated === 'dark');
        } else {
            // Si no hay preferencia guardada, usar auto
            const calculated = calculateActualTheme('auto');
            setActualTheme(calculated);
            document.documentElement.classList.toggle('dark', calculated === 'dark');
        }
    }, []);

    // Actualizar tema cuando cambia la preferencia
    useEffect(() => {
        const calculated = calculateActualTheme(theme);
        setActualTheme(calculated);
        document.documentElement.classList.toggle('dark', calculated === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Verificar cada minuto si cambió la hora (para modo auto)
    useEffect(() => {
        if (theme !== 'auto') return;

        const interval = setInterval(() => {
            const calculated = calculateActualTheme('auto');
            if (calculated !== actualTheme) {
                setActualTheme(calculated);
                document.documentElement.classList.toggle('dark', calculated === 'dark');
            }
        }, 60000); // Verificar cada minuto

        return () => clearInterval(interval);
    }, [theme, actualTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('auto');
        } else {
            setTheme('light');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

