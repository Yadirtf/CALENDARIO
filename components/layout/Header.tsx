'use client';

import React from 'react';
import { Calendar, Settings, Menu, Sun, Moon, Sunset } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { theme, actualTheme, toggleTheme } = useTheme();

    const getThemeIcon = () => {
        if (theme === 'auto') {
            return <Sunset size={20} />;
        }
        return actualTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />;
    };

    const getThemeLabel = () => {
        if (theme === 'auto') return 'Automático';
        return theme === 'dark' ? 'Oscuro' : 'Claro';
    };

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors">
            <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} className="text-gray-900 dark:text-gray-100" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-primary-600 dark:text-primary-400" size={32} />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Sistema de Calendario
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                        title={`Tema: ${getThemeLabel()}`}
                    >
                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {getThemeIcon()}
                        </span>
                        <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {getThemeLabel()}
                        </span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Settings size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
