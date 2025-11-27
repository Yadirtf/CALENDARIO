'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, CheckSquare, Tag, X } from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Calendario',
            href: '/calendar',
            icon: Calendar,
        },
        
        {
            name: 'Categorías',
            href: '/categories',
            icon: Tag,
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky 
          top-0 lg:top-[73px]
          left-0 
          h-screen lg:h-[calc(100vh-73px)]
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          z-50 lg:z-30
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
        `}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Close button for mobile */}
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menú</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X size={24} className="text-gray-900 dark:text-gray-100" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                  `}
                                    onClick={onClose}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Sistema de Calendario v1.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
