'use client';

import React, { useState } from 'react';
import { Calendar, Settings, Menu, Sun, Moon, Sunset, LogOut, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { theme, actualTheme, toggleTheme } = useTheme();
    const { user, userData, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

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
                    
                    {user && userData && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {userData.firstName}{userData.lastName && userData.lastName.toLowerCase() !== 'google' ? ` ${userData.lastName}` : ''}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {userData.email}
                                    </span>
                                </div>
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={`${userData.firstName} ${userData.lastName}`}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                                        {userData.firstName.charAt(0).toUpperCase()}
                                        {userData.lastName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>
                            
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                        <div className="p-2">
                                            <button
                                                onClick={signOut}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Settings size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
